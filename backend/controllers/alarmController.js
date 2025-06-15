import { Sequelize, Op } from 'sequelize';
import Alarm from '../models/alarmModel.js';
import { Device } from '../models/tableModel.js';
import Sensor from '../models/sensorModel.js';
import moment from 'moment';

// Define thresholds for alarm triggers
const ALARM_THRESHOLDS = {
    voltage_high: 240,
    voltage_low: 190,
    current_high: 8,
    power_high: 2000,
    connection_timeout: 60000, // 60 seconds
};

/**
 * Check sensor readings against alarm thresholds
 * @param {object} data - The sensor data to check
 * @returns {Promise<boolean>} - Whether any alarms were generated
 */
export const checkSensorAlarms = async (data) => {
    try {
        if (!data || !data.device_id) return false;

        let alarmsGenerated = false;
        const alarmsList = [];

        // Check electrical parameters
        if (data.voltage > ALARM_THRESHOLDS.voltage_high) {
            alarmsList.push({
                device_id: data.device_id,
                alarm_type: 'voltage_high',
                severity: 'warning',
                message: `High voltage detected: ${data.voltage.toFixed(1)} V`,
                timestamp: new Date(),
                status: 'active',
                additional_data: JSON.stringify({
                    voltage: data.voltage,
                    threshold: ALARM_THRESHOLDS.voltage_high
                })
            });
            alarmsGenerated = true;
        }

        if (data.voltage < ALARM_THRESHOLDS.voltage_low && data.voltage > 0) {
            alarmsList.push({
                device_id: data.device_id,
                alarm_type: 'voltage_low',
                severity: 'warning',
                message: `Low voltage detected: ${data.voltage.toFixed(1)} V`,
                timestamp: new Date(),
                status: 'active',
                additional_data: JSON.stringify({
                    voltage: data.voltage,
                    threshold: ALARM_THRESHOLDS.voltage_low
                })
            });
            alarmsGenerated = true;
        }

        if (data.current > ALARM_THRESHOLDS.current_high) {
            alarmsList.push({
                device_id: data.device_id,
                alarm_type: 'current_high',
                severity: 'critical',
                message: `High current detected: ${data.current.toFixed(2)} A`,
                timestamp: new Date(),
                status: 'active',
                additional_data: JSON.stringify({
                    current: data.current,
                    threshold: ALARM_THRESHOLDS.current_high
                })
            });
            alarmsGenerated = true;
        }

        if (data.power > ALARM_THRESHOLDS.power_high) {
            alarmsList.push({
                device_id: data.device_id,
                alarm_type: 'power_high',
                severity: 'warning',
                message: `High power usage detected: ${data.power.toFixed(0)} W`,
                timestamp: new Date(),
                status: 'active',
                additional_data: JSON.stringify({
                    power: data.power,
                    threshold: ALARM_THRESHOLDS.power_high
                })
            });
            alarmsGenerated = true;
        }

        // Create alarms in database
        if (alarmsList.length > 0) {
            await Alarm.bulkCreate(alarmsList);

            // Emit alarms via WebSocket if available
            if (global.io) {
                alarmsList.forEach(alarm => {
                    global.io.emit('alarm', {
                        ...alarm,
                        timestamp: alarm.timestamp.toISOString()
                    });
                });
            }

            console.log(`Generated ${alarmsList.length} alarms for device ${data.device_id}`);
        }

        return alarmsGenerated;
    } catch (error) {
        console.error('Error checking for alarms:', error);
        return false;
    }
};

/**
 * Check for connection loss alarms
 */
export const checkConnectionAlarms = async () => {
    try {
        // Get all active devices
        const devices = await Device.findAll({
            attributes: ['device_id', 'device_name', 'last_online']
        });

        let alarmsGenerated = 0;
        const now = new Date();

        for (const device of devices) {
            if (!device.last_online) continue;

            const lastOnline = new Date(device.last_online);
            const timeDiff = now - lastOnline;

            // Check if device hasn't been online for a while
            if (timeDiff > ALARM_THRESHOLDS.connection_timeout) {
                // Check if we already have an active connection alarm for this device
                const existingAlarm = await Alarm.findOne({
                    where: {
                        device_id: device.device_id,
                        alarm_type: 'connection_loss',
                        status: 'active'
                    }
                });

                // Only create new alarm if none exists
                if (!existingAlarm) {
                    await Alarm.create({
                        device_id: device.device_id,
                        alarm_type: 'connection_loss',
                        severity: 'warning',
                        message: `Device ${device.device_name} has been offline for ${Math.round(timeDiff / 1000)} seconds`,
                        timestamp: now,
                        status: 'active',
                        additional_data: JSON.stringify({
                            last_online: lastOnline.toISOString(),
                            offline_duration_seconds: Math.round(timeDiff / 1000)
                        })
                    });

                    alarmsGenerated++;
                }
            } else {
                // If device is back online, resolve any existing connection alarms
                const result = await Alarm.update(
                    {
                        status: 'resolved',
                        additional_data: JSON.stringify({
                            resolved_at: now.toISOString(),
                            resolution_type: 'automatic'
                        })
                    },
                    {
                        where: {
                            device_id: device.device_id,
                            alarm_type: 'connection_loss',
                            status: 'active'
                        }
                    }
                );

                if (result[0] > 0) {
                    console.log(`Resolved connection alarm for device ${device.device_name}`);
                }
            }
        }

        if (alarmsGenerated > 0) {
            console.log(`Generated ${alarmsGenerated} connection alarms`);
        }

        return alarmsGenerated;
    } catch (error) {
        console.error('Error checking for connection alarms:', error);
        return 0;
    }
};

/**
 * Get all alarms with pagination and filtering
 */
export const getAlarms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const offset = page * limit;

        // Build where clause with filters
        const where = {};

        if (req.query.device_id) {
            where.device_id = req.query.device_id;
        }

        if (req.query.status) {
            where.status = req.query.status;
        }

        if (req.query.severity) {
            where.severity = req.query.severity;
        }

        if (req.query.alarm_type) {
            where.alarm_type = req.query.alarm_type;
        }

        // Date range filtering
        if (req.query.start_date || req.query.end_date) {
            where.timestamp = {};

            if (req.query.start_date) {
                where.timestamp[Op.gte] = new Date(req.query.start_date);
            }

            if (req.query.end_date) {
                where.timestamp[Op.lte] = new Date(req.query.end_date);
            }
        }

        // Fetch alarms with device info
        const { count, rows: alarms } = await Alarm.findAndCountAll({
            where,
            include: [
                {
                    model: Device,
                    attributes: ['device_name', 'location'],
                    as: 'Device'
                }
            ],
            order: [['timestamp', 'DESC']],
            offset,
            limit
        });

        return res.json({
            status: 'success',
            message: 'Alarms retrieved successfully',
            data: alarms,
            count,
            total_pages: Math.ceil(count / limit),
            current_page: page
        });
    } catch (error) {
        console.error('Error retrieving alarms:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve alarms',
            error: error.message
        });
    }
};

/**
 * Acknowledge an alarm
 */
export const acknowledgeAlarm = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;

        const alarm = await Alarm.findByPk(id);

        if (!alarm) {
            return res.status(404).json({
                status: 'error',
                message: 'Alarm not found'
            });
        }

        if (alarm.status === 'acknowledged' || alarm.status === 'resolved') {
            return res.status(400).json({
                status: 'error',
                message: `Alarm already ${alarm.status}`
            });
        }

        // Update alarm status
        await alarm.update({
            status: 'acknowledged',
            acknowledged: true,
            acknowledged_at: new Date(),
            acknowledged_by: user_id || null
        });

        return res.json({
            status: 'success',
            message: 'Alarm acknowledged',
            data: alarm
        });
    } catch (error) {
        console.error('Error acknowledging alarm:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to acknowledge alarm',
            error: error.message
        });
    }
};

/**
 * Get alarm statistics
 */
export const getAlarmStats = async (req, res) => {
    try {
        const startDate = req.query.start_date ? new Date(req.query.start_date) : moment().subtract(30, 'days').toDate();
        const endDate = req.query.end_date ? new Date(req.query.end_date) : new Date();

        // Get count by severity
        const severityCounts = await Alarm.findAll({
            attributes: [
                'severity',
                [Sequelize.fn('COUNT', Sequelize.col('alarm_id')), 'count']
            ],
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['severity']
        });

        // Get count by status
        const statusCounts = await Alarm.findAll({
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('alarm_id')), 'count']
            ],
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['status']
        });

        // Get count by type
        const typeCounts = await Alarm.findAll({
            attributes: [
                'alarm_type',
                [Sequelize.fn('COUNT', Sequelize.col('alarm_id')), 'count']
            ],
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['alarm_type']
        });

        // Get daily alarm counts
        const dailyCounts = await Alarm.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'date'],
                [Sequelize.fn('COUNT', Sequelize.col('alarm_id')), 'count']
            ],
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('timestamp'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('timestamp')), 'ASC']]
        });

        return res.json({
            status: 'success',
            message: 'Alarm statistics retrieved',
            data: {
                period: {
                    start: startDate,
                    end: endDate
                },
                by_severity: severityCounts,
                by_status: statusCounts,
                by_type: typeCounts,
                daily_counts: dailyCounts
            }
        });
    } catch (error) {
        console.error('Error getting alarm statistics:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve alarm statistics',
            error: error.message
        });
    }
};
