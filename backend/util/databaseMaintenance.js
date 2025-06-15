import { Sequelize, Op } from 'sequelize';
import moment from 'moment';
import db from '../config/Database.js';
import Sensor from '../models/sensorModel.js';
import EnergyTrend from '../models/energyTrendModel.js';
import Alarm from '../models/alarmModel.js';
import { generateEnergyTrends } from '../controllers/analyticsController.js';

// Configuration for data retention
const DATA_RETENTION_CONFIG = {
    // Raw sensor readings are kept for a shorter period
    raw_sensor_data: {
        days: 30, // Keep data for 30 days
    },
    // Trends are kept for longer periods
    trends: {
        hourly: 90, // 90 days
        daily: 365, // 1 year
        weekly: 520, // 10 years
        monthly: 1200 // 100 years
    },
    // Alarms are kept for audit
    alarms: {
        days: 180 // 6 months
    }
};

/**
 * Run a complete database maintenance cycle
 * - Purge old data based on retention policy
 * - Generate aggregated trends
 * - Optimize database tables
 */
export const runDatabaseMaintenance = async () => {
    console.log('Starting database maintenance...');
    try {
        // Start with data purge operations
        await purgeOldSensorData();
        await purgeOldTrends();
        await purgeOldAlarms();

        // Generate new aggregated trends
        await generateEnergyTrends();

        // Optimize database tables
        await optimizeTables();

        console.log('Database maintenance completed successfully');
        return true;
    } catch (error) {
        console.error('Database maintenance error:', error);
        return false;
    }
};

/**
 * Purge old raw sensor data based on retention policy
 */
export const purgeOldSensorData = async () => {
    try {
        const retentionDays = DATA_RETENTION_CONFIG.raw_sensor_data.days;
        const cutoffDate = moment().subtract(retentionDays, 'days').toDate();

        console.log(`Purging sensor data older than ${retentionDays} days (before ${cutoffDate.toISOString()})...`);

        // Count records to be deleted
        const countToDelete = await Sensor.count({
            where: {
                timestamp: {
                    [Op.lt]: cutoffDate
                }
            }
        });

        if (countToDelete > 0) {
            // Delete records in batches for better performance
            const BATCH_SIZE = 10000;
            let deleted = 0;
            let totalDeleted = 0;

            // Use more efficient bulk delete operations with batches
            do {
                const result = await Sensor.destroy({
                    where: {
                        timestamp: {
                            [Op.lt]: cutoffDate
                        }
                    },
                    limit: BATCH_SIZE
                });

                deleted = result;
                totalDeleted += deleted;

                console.log(`Deleted batch of ${deleted} old sensor records`);

                // Add a short delay to prevent locking the database
                if (deleted === BATCH_SIZE) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } while (deleted === BATCH_SIZE);

            console.log(`Purged ${totalDeleted} sensor records older than ${retentionDays} days`);
        } else {
            console.log('No old sensor data to purge');
        }

        return true;
    } catch (error) {
        console.error('Error purging old sensor data:', error);
        return false;
    }
};

/**
 * Purge old trends data based on retention policy
 */
export const purgeOldTrends = async () => {
    try {
        const trendTypes = Object.keys(DATA_RETENTION_CONFIG.trends);

        for (const trendType of trendTypes) {
            const retentionDays = DATA_RETENTION_CONFIG.trends[trendType];
            const cutoffDate = moment().subtract(retentionDays, 'days').toDate();

            console.log(`Purging ${trendType} trends older than ${retentionDays} days...`);

            const result = await EnergyTrend.destroy({
                where: {
                    period_type: trendType,
                    period_start: {
                        [Op.lt]: cutoffDate
                    }
                }
            });

            console.log(`Purged ${result} ${trendType} trend records`);
        }

        return true;
    } catch (error) {
        console.error('Error purging old trends data:', error);
        return false;
    }
};

/**
 * Purge old alarms based on retention policy
 */
export const purgeOldAlarms = async () => {
    try {
        const retentionDays = DATA_RETENTION_CONFIG.alarms.days;
        const cutoffDate = moment().subtract(retentionDays, 'days').toDate();

        console.log(`Purging alarms older than ${retentionDays} days...`);

        const result = await Alarm.destroy({
            where: {
                timestamp: {
                    [Op.lt]: cutoffDate
                }
            }
        });

        console.log(`Purged ${result} old alarm records`);

        return true;
    } catch (error) {
        console.error('Error purging old alarms:', error);
        return false;
    }
};

/**
 * Optimize database tables for better performance
 */
export const optimizeTables = async () => {
    try {
        // For MySQL, run OPTIMIZE TABLE operations
        const tables = ['sensors', 'devices', 'energy_trends', 'alarms'];

        console.log('Optimizing database tables...');

        for (const table of tables) {
            console.log(`Optimizing table: ${table}...`);

            try {
                // Execute raw SQL for optimization
                await db.query(`OPTIMIZE TABLE ${table}`, { raw: true });
                console.log(`Successfully optimized table: ${table}`);
            } catch (tableError) {
                // Some engines like InnoDB don't support OPTIMIZE TABLE
                try {
                    // Try ANALYZE TABLE instead for InnoDB tables
                    await db.query(`ANALYZE TABLE ${table}`, { raw: true });
                    console.log(`Analyzed table: ${table} (OPTIMIZE not supported)`);
                } catch (analyzeError) {
                    console.warn(`Could not optimize or analyze table ${table}: ${analyzeError.message}`);
                }
            }
        }

        return true;
    } catch (error) {
        console.error('Error optimizing database tables:', error);
        return false;
    }
};
