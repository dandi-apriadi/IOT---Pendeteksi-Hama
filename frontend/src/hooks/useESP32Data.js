import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { errorOnce } from '../utils/consoleLogger';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useESP32Data(deviceId = 'ESP32-PUMP-01') {
    // State
    const [sensorData, setSensorData] = useState(null);
    const [deviceStatus, setDeviceStatus] = useState({});
    const [deviceOnlineStatus, setDeviceOnlineStatus] = useState({});
    const [lastUpdate, setLastUpdate] = useState(null);
    const [sensorHistory, setSensorHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [loading, setLoading] = useState({
        latest: false,
        history: false,
        status: false
    });

    // WebSocket connection
    const socketRef = useRef(null);
    const callbacksRef = useRef(new Set());

    // Create socket connection
    useEffect(() => {
        console.log('Initializing WebSocket connection to server...');

        const newSocket = io(API_BASE_URL.replace('/api', ''), {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity
        });

        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            console.log('%cWebSocket connected! 🟢', 'color: green; font-weight: bold');
            setIsConnected(true);
            setIsOffline(false);
        });

        newSocket.on('disconnect', () => {
            console.log('%cWebSocket disconnected! 🔴', 'color: red; font-weight: bold');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            if (navigator.onLine === false) {
                setIsOffline(true);
                console.log('Device is offline, switching to offline mode');
            }
        });

        newSocket.on('sensor_data', (data) => {
            console.group('%cReal-time data received from server', 'background: #8e44ad; color: white; padding: 2px 5px;');
            console.log('Raw data:', data);
            console.table({
                voltage: data.voltage || data.data?.voltage || 'N/A',
                current: data.current || data.data?.current || 'N/A',
                power: data.power || data.data?.power || 'N/A',
                energy: data.energy || data.data?.energy || 'N/A',
                pir_status: data.pir_status || data.data?.pir_status || false,
                pump_status: data.pump_status || data.data?.pump_status || false
            });
            console.groupEnd();

            // Process data for component
            const processedData = {
                ...(data.data || data),
                timestamp: data.timestamp || new Date().toISOString()
            };

            setSensorData(processedData);
            setLastUpdate(new Date());

            // Notify all registered callbacks
            callbacksRef.current.forEach(callback => {
                try {
                    callback(processedData);
                } catch (e) {
                    console.error('Error in real-time data callback:', e);
                }
            });
        });

        // Clean up on unmount
        return () => {
            console.log('Cleaning up WebSocket connection...');
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [API_BASE_URL]);

    // Register real-time callback
    const registerRealTimeCallback = useCallback((callback) => {
        callbacksRef.current.add(callback);
        return () => callbacksRef.current.delete(callback);
    }, []);

    // Log all data changes
    useEffect(() => {
        if (sensorData) {
            console.log('useESP32Data - Sensor data updated:', sensorData);
        }
    }, [sensorData]);

    useEffect(() => {
        if (sensorHistory && sensorHistory.length > 0) {
            console.log('useESP32Data - History data updated:',
                { count: sensorHistory.length, first: sensorHistory[0], last: sensorHistory[sensorHistory.length - 1] });
        }
    }, [sensorHistory]);

    // Return the hook's API
    return {
        sensorData,
        deviceStatus,
        deviceOnlineStatus,
        lastUpdate,
        sensorHistory,
        isConnected,
        isOffline,
        loading,
        registerRealTimeCallback
    };
}
