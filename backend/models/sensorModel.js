import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import moment from "moment";

const { DataTypes } = Sequelize;

// Enhanced Sensor Model with electrical measurements and optimized indexes
const Sensor = db.define('sensors', {
    sensor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Using string reference to avoid circular dependencies
        references: {
            model: 'devices',
            key: 'device_id'
        }
    },
    voltage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    current: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    power: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    energy: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    pir_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    pump_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    auto_mode: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('timestamp');
            if (rawValue) {
                return moment(rawValue).format('YYYY-MM-DD HH:mm:ss');
            }
            return null;
        }
    },
    source: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'unknown',
        comment: 'Source of data: http_api, websocket, etc.'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        // Basic indexes for common queries
        {
            name: 'idx_device_id',
            fields: ['device_id']
        },
        {
            name: 'idx_timestamp',
            fields: ['timestamp']
        },
        // Specialized index for real-time queries with device ID and timestamp
        {
            name: 'idx_device_timestamp',
            fields: ['device_id', 'timestamp']
        },
        // Add specialized index for latest data queries
        {
            name: 'idx_timestamp_desc',
            fields: [{ attribute: 'timestamp', order: 'DESC' }]
        },
        // Add index for pump status queries
        {
            name: 'idx_pump_status',
            fields: ['pump_status']
        },
        // Add index for combined filtering
        {
            name: 'idx_device_pump',
            fields: ['device_id', 'pump_status']
        },
        // Add index for date range with device_id for efficient history queries
        {
            name: 'idx_device_date_range',
            fields: ['device_id', 'timestamp']
        }
    ],
    // Add table options for better performance with time-series data
    engine: 'InnoDB',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    comment: 'Stores ESP32 sensor readings with time-series optimization'
});

export default Sensor;
