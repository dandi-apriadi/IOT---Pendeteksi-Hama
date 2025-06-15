import dotenv from 'dotenv';
dotenv.config();

import { Sequelize, Op } from 'sequelize'; // Add Op import
import express from 'express';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import db from './config/Database.js';

// Import models
import Sensor from './models/sensorModel.js';

// Import routes
import authRoutes from './routes/shared/authRoutes.js';
import esp32Routes from './routes/esp32Routes.js';
import modelDataRoutes from './routes/modelDataRoutes.js';
import dashboardRoutes from './routes/administrator/dashboardRoutes.js';
import profileRoutes from './routes/administrator/profileRoutes.js';
import userManagementRoutes from './routes/administrator/userManagementRoutes.js';
import alarmRoutes from './routes/alarm.js';
import analyticsRoutes from './routes/analytics.js';

// Import the new data processing function
import { processWebSocketData } from './controllers/esp32Controller.js';

// Define ESP32 data processing function
const processESP32Data = (data) => {
    // Ensure all values are correct types
    return {
        device_id: data.device_id || 'unknown',
        voltage: parseFloat(data.voltage) || 0,
        current: parseFloat(data.current) || 0,
        power: parseFloat(data.power) || 0,
        energy: parseFloat(data.energy) || 0,
        pir_status: !!data.pir_status,
        pump_status: !!data.pump_status,
        auto_mode: !!data.auto_mode,
        timestamp: data.timestamp || new Date().toISOString()
    };
};

// Define ESP32 data logging function
const logESP32DataOnly = (data) => {
    // First display any warnings before showing the data
    if (data && data.device_id &&
        data.voltage === 0 &&
        data.current === 0 &&
        data.power === 0 &&
        data.energy === 0) {
        console.warn(JSON.stringify({
            warning_type: "ZERO_VALUES",
            timestamp: new Date().toISOString(),
            device_id: data.device_id,
            message: "All electrical values are zero. Possible PZEM connection issue"
        }, null, 2));
    }

    // Print ESP32 data objects in JSON format
    if (data && data.device_id && (data.voltage !== undefined || data.current !== undefined)) {
        console.log(JSON.stringify({
            type: "ESP32_DATA",
            timestamp: new Date().toISOString(),
            device_id: data.device_id,
            data: {
                voltage: parseFloat(data.voltage) || 0,
                current: parseFloat(data.current) || 0,
                power: parseFloat(data.power) || 0,
                energy: parseFloat(data.energy) || 0,
                pir_status: data.pir_status,
                pump_status: data.pump_status
            }
        }, null, 2));
    }
};

// Function to log device events in a consistent table format
const logDeviceEventTable = (deviceId, eventType, message) => {
    console.log(`Device Event: ${deviceId} | ${eventType} | ${message} | ${new Date().toISOString()}`);
};

// Function to calculate connection quality based on metrics
const calculateConnectionQuality = (avgLatency, messageCount, uptime) => {
    // Simple algorithm - can be enhanced with more sophisticated metrics
    let quality = 100;

    // Reduce quality for high latency
    if (avgLatency > 1000) quality -= 30;
    else if (avgLatency > 500) quality -= 20;
    else if (avgLatency > 200) quality -= 10;

    // Boost quality for high message count and uptime
    if (messageCount > 100 && uptime > 3600) quality += 10;    // Cap within 0-100 range
    return Math.max(0, Math.min(100, quality));
};

// Add these constants for WebSocket management
const WEBSOCKET_PING_INTERVAL = 30000; // Send ping every 30 seconds
const WEBSOCKET_TIMEOUT = 10000; // Wait 10 seconds for pong response
const DATA_BUFFER_SIZE = 100; // Number of recent readings to keep in memory

// Initialize Express app
const app = express();
const server = createServer(app);

// CORS Configuration
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    })
);

// Socket.IO untuk frontend komunikasi
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true, // Add credentials support
        allowedHeaders: ["*"] // Allow all headers for better compatibility
    },
    // Add ping timeout settings for better detection
    pingTimeout: 10000,
    pingInterval: 5000
});

// WebSocket server untuk ESP32 komunikasi
const wss = new WebSocketServer({
    server: server,
    path: '/ws'
});

// Add global error handler for WebSocket server
wss.on('error', (error) => {
    console.error(JSON.stringify({
        event: "SERVER_ERROR",
        timestamp: new Date().toISOString(),
        source: "WebSocketServer",
        error: error.message || 'Unknown WebSocket server error'
    }, null, 2));
});

// Implement the broadcastSensorData function
const broadcastSensorData = (data, deviceId) => {
    if (!data) return;

    try {
        // Normalize data format for frontend
        const normalizedData = {
            type: "ESP32_DATA",
            timestamp: new Date().toISOString(),
            device_id: deviceId || data.device_id,
            data: {
                voltage: parseFloat(data.voltage) || 0,
                current: parseFloat(data.current) || 0,
                power: parseFloat(data.power) || 0,
                energy: parseFloat(data.energy) || 0,
                pir_status: !!data.pir_status,
                pump_status: !!data.pump_status,
                auto_mode: !!data.auto_mode
            }
        };

        // Log the data being broadcast (add this for debugging)
        console.log("Broadcasting data to frontend:", JSON.stringify(normalizedData, null, 2));

        // Broadcast to all connected Socket.IO clients
        if (global.io) {
            global.io.emit('sensor_data', normalizedData);
            console.log(`Real-time data broadcast to ${frontendConnections.size} frontend clients`);
        }

        // Return the normalized data (useful for chaining)
        return normalizedData;
    } catch (err) {
        console.error('Error broadcasting sensor data:', err);
    }
};

// Store untuk koneksi aktif
const espConnections = new Map(); // ESP32 connections 
const frontendConnections = new Set(); // Frontend connections
const sensorDataHistory = []; // Store recent sensor data

// Make connections available globally for controllers to use
global.espConnections = espConnections;

// Setup Socket.IO global reference for use in controllers
global.io = io;

const sessionStore = SequelizeStore(session.Store);

// Create session store with database
const store = new sessionStore({
    db: db,
});

// Middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(express.static("public")); // Serve static files

// File upload configuration - modify to only apply to specific routes
const fileUploadMiddleware = fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
        files: 6 // Maximum number of files
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: path.join(process.cwd(), 'tmp'),
    parseNested: true, // Enable nested object parsing
    debug: false, // Set to false to disable debug messages
    safeFileNames: true,
    preserveExtension: true,
    // Silence noisy messages
    responseOnLimit: 'File size limit exceeded',
    // Only allow certain MIME types
    useTempFiles: true,
    // Add a filter to skip file upload processing for certain routes
    uploadFileFilter: function (req, res) {
        return req.path.startsWith('/api/upload') || req.path.includes('/files/');
    }
});

// Apply fileUpload middleware only to routes that actually need it
app.use(['/api/upload', '/files'], fileUploadMiddleware);
// Use basic express.json and urlencoded for other routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
    session({
        secret: process.env.SESS_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
        // Add silent option
        silent: true
    })
);

// Create upload directories
const createUploadDirs = () => {
    const dirs = [
        path.join(process.cwd(), 'public', 'uploads', 'destinations'),
        path.join(process.cwd(), 'tmp')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            fs.chmodSync(dir, 0o755);
        }
    });
};

createUploadDirs();

// Make uploads directory accessible
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// =====================================================
// Routes Configuration
// =====================================================
// Mount auth routes both with /api/auth prefix and directly for frontend compatibility
app.use('/api/auth', authRoutes);
app.use('/', authRoutes); // Direct mounting for frontend compatibility

app.use('/api/esp32', esp32Routes);
app.use('/api/data', modelDataRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/alarms', alarmRoutes);
app.use('/api/analytics', analyticsRoutes);

// =====================================================
// ESP32 WebSocket Handler
// =====================================================
wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`New WebSocket connection from ${clientIp}`);

    let deviceId = null;
    let dbDeviceId = null;
    let connectionAlive = true;
    let lastMessageReceived = Date.now();

    // Keep track of ping/pong for improved connection monitoring
    ws.isAlive = true;
    ws.lastPingTime = Date.now();
    ws.pingTimeoutId = null;

    // Setup ping timeout handler
    const setupPingTimeout = () => {
        clearTimeout(ws.pingTimeoutId);
        ws.pingTimeoutId = setTimeout(() => {
            if (!ws.isAlive) {
                // Connection is dead, terminate it
                console.error(`WebSocket ping timeout for ${deviceId || 'unknown device'}`);
                ws.terminate();
                return;
            }
            ws.isAlive = false;
            ws.ping();
            ws.lastPingTime = Date.now();
            setupPingTimeout();
        }, WEBSOCKET_PING_INTERVAL);
    };

    // Start ping/pong monitoring
    setupPingTimeout();

    // Send initial welcome message to confirm connection
    try {
        ws.send(JSON.stringify({
            type: 'server_welcome',
            message: 'Connected to IoT server',
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        // Silent error handling
    }

    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            const messageType = message.type;

            console.log(`Received ${messageType} message from ${clientIp}`);

            // Handle device_register message
            if (messageType === 'device_register') {
                deviceId = message.device_id;
                console.log(`Device ${deviceId} attempting to register`);

                // Add device to the connections map with proper initialized connectionStats
                espConnections.set(deviceId, {
                    ws: ws,
                    deviceInfo: {
                        device_type: message.device_type || 'ESP32',
                        location: message.location || 'Unknown',
                        connected_since: new Date(),
                        last_seen: new Date()
                    },
                    connectionStats: {
                        messagesReceived: 0,
                        messagesSent: 0,
                        connectionQuality: 100,
                        latencyMeasurements: []  // Initialize the array
                    }
                });

                // Try to register device in the database if not yet registered
                try {
                    // Import Device model dynamically to avoid circular dependencies
                    const { Device } = await import("./models/tableModel.js");

                    // Check if device exists in database
                    let deviceRecord = await Device.findOne({
                        where: { device_name: deviceId }
                    });

                    // Create device record if it doesn't exist
                    if (!deviceRecord) {
                        deviceRecord = await Device.create({
                            device_name: deviceId,
                            device_type: message.device_type || 'ESP32',
                            location: message.location || 'Unknown',
                            device_status: 'aktif',
                            last_online: new Date()
                        });
                        console.log(`Device ${deviceId} registered in database with ID ${deviceRecord.device_id}`);
                    } else {
                        // Update existing device record
                        await deviceRecord.update({
                            device_status: 'aktif',
                            last_online: new Date()
                        });
                        console.log(`Device ${deviceId} status updated in database`);
                    }

                    // Send successful registration response
                    ws.send(JSON.stringify({
                        status: 'success',
                        received_at: new Date().toISOString(),
                        echo: 'device_register',
                        db_device_id: deviceRecord.device_id,
                        message: 'Device registration successful',
                        timestamp: new Date().toISOString()
                    }));
                } catch (dbError) {
                    console.error(`Database registration failed for ${deviceId}: ${dbError}`);

                    // Send registration response even if database operation fails
                    ws.send(JSON.stringify({
                        status: 'warning',
                        received_at: new Date().toISOString(),
                        echo: 'device_register',
                        message: 'Connected to server but database registration failed',
                        error: dbError.message,
                        timestamp: new Date().toISOString()
                    }));
                }
            }
            // Handle sensor_data message with our updated processing function
            else if (messageType === 'sensor_data') {
                // Process the sensor data with our new filtering function
                const processingResult = await processWebSocketData(message);

                // Send acknowledgment back to the device
                try {
                    ws.send(JSON.stringify({
                        status: processingResult.status,
                        received_at: new Date().toISOString(),
                        echo: 'sensor_data',
                        saved_energy: processingResult.saved_energy || false,
                        saved_sensor: processingResult.saved_sensor || false,
                        reason: processingResult.reason || 'unknown',
                        timestamp: new Date().toISOString()
                    }));
                } catch (sendError) {
                    console.error(`Error sending acknowledgment: ${sendError.message}`);
                }
            }
            // ... handle other message types ...
        } catch (error) {
            // ...existing code...
        }
    });

    // Enhanced WebSocket ping/pong handling for better connection monitoring
    ws.on('pong', () => {
        ws.isAlive = true;
        if (deviceId && espConnections.has(deviceId)) {
            const deviceConn = espConnections.get(deviceId);

            // Update last seen timestamp
            deviceConn.deviceInfo.last_seen = new Date();

            // Calculate ping latency
            const pingLatency = Date.now() - ws.lastPingTime;

            // Make sure connectionStats and latencyMeasurements exist
            if (!deviceConn.connectionStats) {
                deviceConn.connectionStats = {
                    messagesReceived: 0,
                    messagesSent: 0,
                    connectionQuality: 100,
                    latencyMeasurements: []
                };
            }

            if (!deviceConn.connectionStats.latencyMeasurements) {
                deviceConn.connectionStats.latencyMeasurements = [];
            }

            // Now safely push the measurement
            deviceConn.connectionStats.latencyMeasurements.push(pingLatency);

            // Keep only the last 10 measurements
            if (deviceConn.connectionStats.latencyMeasurements.length > 10) {
                deviceConn.connectionStats.latencyMeasurements.shift();
            }

            // Update connection quality based on latency
            const avgLatency = deviceConn.connectionStats.latencyMeasurements.reduce(
                (sum, val) => sum + val, 0
            ) / deviceConn.connectionStats.latencyMeasurements.length;

            deviceConn.connectionStats.avgLatency = avgLatency;

            // Calculate connection quality (0-100)
            deviceConn.connectionStats.connectionQuality = Math.max(
                0,
                Math.min(
                    100,
                    100 - (avgLatency > 500 ? (avgLatency - 500) / 50 : 0)
                )
            );
        }
    });

    ws.on('ping', () => {
        ws.pong();
    });

    // Handle connection close with better cleanup
    ws.on('close', async () => {
        // Clear ping timeout
        clearTimeout(ws.pingTimeoutId);

        if (deviceId) {
            // Log device disconnect with table format
            logDeviceEventTable(deviceId, 'DISCONNECT', 'WebSocket connection closed');
            console.log(`WebSocket connection closed for device ${deviceId}`);

            // Update device status in database
            try {
                const { Device } = await import("./models/tableModel.js");
                await Device.update(
                    { device_status: 'nonaktif' },
                    { where: { device_name: deviceId } }
                );
                console.log(`Device ${deviceId} marked as offline in database`);
            } catch (error) {
                console.error(`Failed to update device status for ${deviceId}:`, error);
            }

            // Clean up connection tracking
            espConnections.delete(deviceId);

            // Broadcast device offline status
            io.emit('device_status', {
                device_id: deviceId,
                status: 'offline',
                timestamp: new Date()
            });
        }
    });

    ws.on('error', (error) => {
        // Improve error handling with logging
        console.error(JSON.stringify({
            event: "ERROR",
            timestamp: new Date().toISOString(),
            source: "WebSocket",
            error: error.message || 'Unknown WebSocket error',
            deviceId: deviceId || 'unknown'
        }, null, 2));

        clearTimeout(ws.pingTimeoutId);
    });
});

// Handle WebSocket message from frontend client
io.on('connection', (socket) => {
    console.log('Frontend client connected:', socket.id);
    frontendConnections.add(socket);

    // Send immediate server status on connection
    socket.emit('server_status', {
        status: 'online',
        timestamp: new Date(),
        active_esp_connections: espConnections.size
    });

    // Send current device status
    const deviceStatuses = [];
    espConnections.forEach((conn, deviceId) => {
        deviceStatuses.push({
            device_id: deviceId,
            status: 'online',
            ...conn.deviceInfo
        });
    });

    socket.emit('device_list', deviceStatuses);

    // Send recent sensor data 
    if (sensorDataHistory.length > 0) {
        socket.emit('sensor_history', sensorDataHistory.slice(-10)); // Last 10 readings
    }

    // Handle frontend commands
    socket.on('send_command', (data) => {
        const { device_id, command, value } = data;

        if (espConnections.has(device_id)) {
            const deviceConn = espConnections.get(device_id);
            const commandMessage = {
                command: command,
                value: value,
                timestamp: new Date().toISOString()
            };

            deviceConn.ws.send(JSON.stringify(commandMessage));
            console.log(`Command sent to ${device_id}:`, commandMessage);

            // Send confirmation to frontend
            socket.emit('command_sent', {
                device_id: device_id,
                command: command,
                status: 'sent',
                timestamp: new Date()
            });
        } else {
            socket.emit('command_error', {
                device_id: device_id,
                error: 'Device not connected',
                timestamp: new Date()
            });
        }
    });

    // Add ping handler to help the frontend detect connection status
    socket.on('ping_server', (data) => {
        console.log(`Ping received from client ${socket.id}:`, data);
        // Send back a pong with the same data plus server timestamp
        socket.emit('pong_client', {
            ...data,
            server_timestamp: new Date(),
            esp_connections: espConnections.size
        });
    });

    // Handle device status request with improved error handling
    socket.on('get_device_status', () => {
        try {
            // Get device statuses
            const deviceStatuses = [];
            espConnections.forEach((conn, deviceId) => {
                const isActive = Date.now() - conn.lastSeen < 30000;

                deviceStatuses.push({
                    device_id: deviceId,
                    status: isActive ? 'online' : 'offline',
                    last_seen: conn.lastSeen,
                    ...conn.deviceInfo
                });
            });

            // Send device status response to the client
            socket.emit('device_status', {
                type: 'device_status',
                devices: deviceStatuses,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error('Error processing device status request:', err);
            socket.emit('error', {
                message: 'Error processing device status request',
                error: err.message
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Frontend client disconnected:', socket.id);
        frontendConnections.delete(socket);
    });
});

// Add the missing checkInactiveDevices function
/**
 * Checks for inactive devices and updates their status
 * Called periodically by setInterval to detect offline devices
 */
async function checkInactiveDevices() {
    try {
        const now = Date.now();
        const INACTIVE_THRESHOLD = 30000; // 30 seconds without data = inactive

        // Get all devices from the database with a connection
        const { Device } = await import("./models/tableModel.js");
        const activeDevices = await Device.findAll({
            where: {
                device_status: 'aktif'
            }
        });

        // Check each active device
        for (const device of activeDevices) {
            const deviceId = device.device_name;
            const lastOnline = device.last_online ? new Date(device.last_online).getTime() : 0;
            const timeSinceLastActive = now - lastOnline;

            // Check if this device has a WebSocket connection
            const hasWsConnection = espConnections.has(deviceId);

            // If device is inactive for too long and has no active WebSocket, mark as offline
            if (timeSinceLastActive > INACTIVE_THRESHOLD && !hasWsConnection) {
                console.log(`Device ${deviceId} inactive for ${Math.floor(timeSinceLastActive / 1000)} seconds, marking as offline`);

                // Update device status in the database
                await device.update({ device_status: 'nonaktif' });

                // Broadcast device offline status to frontend clients
                io.emit('device_status', {
                    device_id: deviceId,
                    status: 'offline',
                    timestamp: new Date(),
                    last_seen: new Date(lastOnline)
                });
            }
            // If connection exists but no activity, ping the device
            else if (hasWsConnection && timeSinceLastActive > 15000) {
                const connection = espConnections.get(deviceId);
                try {
                    // Try to ping the device to check connection
                    connection.ws.ping();
                    console.log(`Sent ping to inactive device ${deviceId}`);
                } catch (err) {
                    console.error(`Error pinging device ${deviceId}:`, err);
                    // Connection might be broken, clean it up
                    espConnections.delete(deviceId);
                }
            }
        }

        // Also check for any devices that are marked as active but don't have recent data
        const staleDevices = await Device.findAll({
            where: {
                device_status: 'aktif',
                last_online: {
                    [Op.lt]: new Date(now - INACTIVE_THRESHOLD)
                }
            }
        });

        // Update any stale devices to inactive status
        if (staleDevices.length > 0) {
            console.log(`Found ${staleDevices.length} stale devices to mark inactive`);

            for (const device of staleDevices) {
                await device.update({ device_status: 'nonaktif' });

                // Broadcast status change to frontend
                io.emit('device_status', {
                    device_id: device.device_name,
                    status: 'offline',
                    timestamp: new Date(),
                    last_seen: device.last_online
                });
            }
        }
    } catch (error) {
        console.error('Error checking inactive devices:', error);
    }
}

// Run the inactive device check every 10 seconds
setInterval(checkInactiveDevices, 10000);

// Make sure you have a route to the server running
const PORT = process.env.PORT || 5000;

// Initialize database connection before starting server
const initializeDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await db.authenticate();
        console.log('Database connection has been established successfully.');

        // Import models to register them
        await import('./models/sensorModel.js');
        await import('./models/tableModel.js');
        await import('./models/userModel.js');
        await import('./models/alarmModel.js');

        console.log('Models imported successfully.');

        // Sync database (don't force in production)
        await db.sync({ alter: true });
        console.log('Database synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

// Start server after database initialization
const startServer = async () => {
    await initializeDatabase();

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`WebSocket server is ready at ws://localhost:${PORT}/ws`);
        console.log(`Socket.IO is ready at http://localhost:${PORT}`);
        console.log(`API endpoints available:`);
        console.log(`  GET  http://localhost:${PORT}/api/esp32/data/latest`);
        console.log(`  GET  http://localhost:${PORT}/api/esp32/diagnostics`);
        console.log(`  POST http://localhost:${PORT}/api/esp32/data`);
    });
};

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
