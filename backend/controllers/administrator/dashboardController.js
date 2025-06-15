import { Sequelize } from 'sequelize';
const { Op } = Sequelize;
import moment from 'moment';
import { Device, SprayingLog, Notification, Setting } from "../../models/tableModel.js";
import Sensor from "../../models/sensorModel.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Dashboard Summary
export const getDashboardSummary = async (req, res) => {
    try {
        // Get statistics
        const deviceStats = {
            total: await Device.count(),
            active: await Device.count({ where: { device_status: 'aktif' } }),
            inactive: await Device.count({ where: { device_status: 'nonaktif' } })
        };

        // Get recent spraying logs
        const recentSprayings = await SprayingLog.findAll({
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            limit: 5,
            order: [['start_time', 'DESC']]
        });

        // Get devices with high pest level (for alerts)
        const highPestDevices = await Sensor.findAll({
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            where: {
                pest_level: { [Op.gte]: 7 }, // Assuming 7+ is high pest level
                timestamp: { [Op.gte]: moment().subtract(24, 'hours').toDate() }
            },
            order: [['pest_level', 'DESC']],
            limit: 5
        });

        // Get unread notifications
        const unreadNotifications = await Notification.count({
            where: { status: 'belum terbaca' }
        });

        // Get system summary data
        const totalSprayings = await SprayingLog.count();
        const automaticSprayings = await SprayingLog.count({ where: { spraying_mode: 'otomatis' } });
        const manualSprayings = await SprayingLog.count({ where: { spraying_mode: 'manual' } });

        // Calculate average pest levels for the past week
        const lastWeek = await Sensor.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'date'],
                [Sequelize.fn('AVG', Sequelize.col('pest_level')), 'average_pest_level']
            ],
            where: {
                timestamp: { [Op.gte]: moment().subtract(7, 'days').toDate() }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('timestamp'))],
            order: [[Sequelize.literal('date'), 'ASC']]
        });

        const summaryData = {
            statistics: {
                devices: deviceStats,
                totalSprayings,
                automaticSprayings,
                manualSprayings,
                unreadNotifications
            },
            recentActivity: {
                sprayings: recentSprayings.map(log => ({
                    id: log.log_id,
                    deviceName: log?.Device?.device_name || 'Unknown',
                    location: log?.Device?.location || 'Unknown',
                    mode: log.spraying_mode,
                    startTime: moment(log.start_time).format('D MMMM, YYYY, h:mm A'),
                    endTime: log.end_time ? moment(log.end_time).format('D MMMM, YYYY, h:mm A') : null,
                    status: log.status
                }))
            },
            alerts: {
                highPestLevels: highPestDevices.map(sensor => ({
                    deviceId: sensor.device_id,
                    deviceName: sensor?.Device?.device_name || 'Unknown',
                    location: sensor?.Device?.location || 'Unknown',
                    pestLevel: sensor.pest_level,
                    timestamp: moment(sensor.timestamp).format('D MMMM, YYYY, h:mm A')
                }))
            },
            trends: {
                weeklyPestLevels: lastWeek.map(day => ({
                    date: day.getDataValue('date'),
                    averagePestLevel: parseFloat(day.getDataValue('average_pest_level')).toFixed(2)
                }))
            }
        };

        res.json({
            status: 'success',
            data: summaryData
        });
    } catch (error) {
        console.error('Get dashboard summary error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch dashboard summary'
        });
    }
};

// Device management
export const getAllDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({
            order: [['created_at', 'DESC']]
        });

        res.json({
            status: 'success',
            data: devices
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch devices'
        });
    }
};

export const getDeviceById = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: 'Device not found'
            });
        }

        res.json({
            status: 'success',
            data: device
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch device'
        });
    }
};

export const createDevice = async (req, res) => {
    try {
        const { device_name, location } = req.body;

        if (!device_name) {
            return res.status(400).json({
                status: 'error',
                message: 'Device name is required'
            });
        }

        const newDevice = await Device.create({
            device_name,
            location,
            device_status: 'aktif',
            last_online: new Date()
        });

        res.status(201).json({
            status: 'success',
            data: newDevice
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to create device'
        });
    }
};

export const updateDevice = async (req, res) => {
    try {
        const { device_name, location } = req.body;
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: 'Device not found'
            });
        }

        await device.update({
            device_name: device_name || device.device_name,
            location: location !== undefined ? location : device.location
        });

        res.json({
            status: 'success',
            data: device
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update device'
        });
    }
};

export const deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: 'Device not found'
            });
        }

        await device.destroy();

        res.json({
            status: 'success',
            message: 'Device deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to delete device'
        });
    }
};

export const updateDeviceStatus = async (req, res) => {
    try {
        const { device_status } = req.body;
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: 'Device not found'
            });
        }

        if (!['aktif', 'nonaktif'].includes(device_status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid device status. Use "aktif" or "nonaktif"'
            });
        }

        await device.update({
            device_status,
            last_online: device_status === 'aktif' ? new Date() : device.last_online
        });

        res.json({
            status: 'success',
            data: device
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update device status'
        });
    }
};

// Sensor data
export const getAllSensorData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let whereClause = {};

        if (startDate && endDate) {
            whereClause.timestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            whereClause.timestamp = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            whereClause.timestamp = {
                [Op.lte]: new Date(endDate)
            };
        }

        const sensorData = await Sensor.findAll({
            attributes: { exclude: ['temperature', 'humidity'] }, // Exclude temperature and humidity
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: req.query.limit ? parseInt(req.query.limit) : undefined
        });

        res.json({
            status: 'success',
            data: sensorData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch sensor data'
        });
    }
};

export const getSensorDataByDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { limit = 100 } = req.query;

        const sensorData = await Sensor.findAll({
            attributes: { exclude: ['temperature', 'humidity'] }, // Exclude temperature and humidity
            where: { device_id: deviceId },
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({
            status: 'success',
            data: sensorData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch sensor data'
        });
    }
};

export const getLatestSensorData = async (req, res) => {
    try {
        // Get latest reading from each device
        const devices = await Device.findAll();
        const latestReadings = [];

        for (const device of devices) {
            const latestReading = await Sensor.findOne({
                attributes: { exclude: ['temperature', 'humidity'] }, // Exclude temperature and humidity
                where: { device_id: device.device_id },
                order: [['timestamp', 'DESC']]
            });

            if (latestReading) {
                latestReadings.push({
                    device: {
                        id: device.device_id,
                        name: device.device_name,
                        status: device.device_status,
                        location: device.location
                    },
                    reading: latestReading
                });
            }
        }

        res.json({
            status: 'success',
            data: latestReadings
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch latest sensor data'
        });
    }
};

export const recordSensorData = async (req, res) => {
    try {
        const { device_id, pest_level } = req.body; // Removed temperature and humidity

        // Validate device exists
        const device = await Device.findByPk(device_id);
        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: 'Device not found'
            });
        }

        // Record sensor data
        const sensorData = await Sensor.create({
            device_id,
            // temperature, // Removed
            // humidity, // Removed
            pest_level,
            timestamp: new Date()
        });

        // Update device last online time
        await device.update({
            last_online: new Date()
        });

        // Check if pest level is high and create notification if needed
        if (pest_level >= 8) { // Assuming 8+ is critical
            await Notification.create({
                device_id,
                message: `High pest level detected (${pest_level}/10) at ${device.location}. Automatic spraying recommended.`,
                status: 'belum terbaca'
            });
        }

        // Check if automatic spraying should be triggered
        const autoSprayThreshold = await Setting.findOne({
            where: { parameter: 'auto_spray_threshold' }
        });

        if (autoSprayThreshold && pest_level >= parseInt(autoSprayThreshold.value)) {
            // Create spraying log for automatic spraying
            const sprayingLog = await SprayingLog.create({
                device_id,
                spraying_mode: 'otomatis',
                start_time: new Date(),
                status: 'berhasil'
            });

            // Create notification for automatic spraying
            await Notification.create({
                device_id,
                message: `Automatic spraying initiated at ${device.location} due to high pest level (${pest_level}/10).`,
                status: 'belum terbaca'
            });

            // Additional response data for automatic spraying
            return res.status(201).json({
                status: 'success',
                data: sensorData,
                automaticSpraying: {
                    triggered: true,
                    sprayingLog
                }
            });
        }

        res.status(201).json({
            status: 'success',
            data: sensorData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to record sensor data'
        });
    }
};

// Spraying management
export const getSprayingLogs = async (req, res) => {
    try {
        const { startDate, endDate, mode } = req.query;
        let whereClause = {};

        if (startDate && endDate) {
            whereClause.start_time = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        if (mode && ['otomatis', 'manual'].includes(mode)) {
            whereClause.spraying_mode = mode;
        }

        const sprayingLogs = await SprayingLog.findAll({
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            where: whereClause,
            order: [['start_time', 'DESC']]
        });

        res.json({
            status: 'success',
            data: sprayingLogs
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch spraying logs'
        });
    }
};

export const getSprayingLogsByDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const sprayingLogs = await SprayingLog.findAll({
            where: { device_id: deviceId },
            order: [['start_time', 'DESC']]
        });

        res.json({
            status: 'success',
            data: sprayingLogs
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch spraying logs'
        });
    }
};

export const initiateManualSpraying = async (req, res) => {
    try {
        const { deviceId } = req.params;

        // Validate device exists
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: 'Device not found'
            });
        }

        // Check if device is active
        if (device.device_status !== 'aktif') {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot initiate spraying on inactive device'
            });
        }

        // Create spraying log
        const sprayingLog = await SprayingLog.create({
            device_id: deviceId,
            spraying_mode: 'manual',
            start_time: new Date(),
            status: 'berhasil'
        });

        // Create notification
        await Notification.create({
            device_id: deviceId,
            message: `Manual spraying initiated at ${device.location}.`,
            status: 'belum terbaca'
        });

        res.status(201).json({
            status: 'success',
            data: sprayingLog
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to initiate manual spraying'
        });
    }
};

export const completeSprayingLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { end_time, pesticide_used, status } = req.body;

        const sprayingLog = await SprayingLog.findByPk(id);

        if (!sprayingLog) {
            return res.status(404).json({
                status: 'error',
                message: 'Spraying log not found'
            });
        }

        await sprayingLog.update({
            end_time: end_time || new Date(),
            pesticide_used,
            status: status || sprayingLog.status
        });

        res.json({
            status: 'success',
            data: sprayingLog
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update spraying log'
        });
    }
};

// Notification management
export const getNotifications = async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        let whereClause = {};

        if (status && ['terbaca', 'belum terbaca'].includes(status)) {
            whereClause.status = status;
        }

        const notifications = await Notification.findAll({
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({
            status: 'success',
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch notifications'
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        await notification.update({ status: 'terbaca' });

        res.json({
            status: 'success',
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to mark notification as read'
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        await notification.destroy();

        res.json({
            status: 'success',
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to delete notification'
        });
    }
};

// Settings management
export const getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();

        res.json({
            status: 'success',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch settings'
        });
    }
};

export const updateSetting = async (req, res) => {
    try {
        const { value, description } = req.body;
        const setting = await Setting.findByPk(req.params.id);

        if (!setting) {
            return res.status(404).json({
                status: 'error',
                message: 'Setting not found'
            });
        }

        await setting.update({
            value,
            description: description !== undefined ? description : setting.description
        });

        res.json({
            status: 'success',
            data: setting
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update setting'
        });
    }
};