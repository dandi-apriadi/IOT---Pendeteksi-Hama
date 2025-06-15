import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import moment from "moment";
import { Device } from "./tableModel.js";
import { User } from "./userModel.js"; // Import User model

const { DataTypes } = Sequelize;

// Alarm Model for system alerts and notifications
const Alarm = db.define('alarms', {
    alarm_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'devices',
            key: 'device_id'
        }
    },
    alarm_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Type of alarm: voltage_high, current_high, connection_loss, etc.'
    },
    severity: {
        type: DataTypes.ENUM('info', 'warning', 'critical'),
        allowNull: false,
        defaultValue: 'info'
    },
    message: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    acknowledged: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    acknowledged_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    acknowledged_by: {
        type: DataTypes.STRING, // Changed from INTEGER to STRING to match user_id type
        allowNull: true,
        references: {
            model: 'users',
            key: 'user_id' // Changed from 'id' to 'user_id' to match the actual primary key
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'resolved', 'acknowledged'),
        allowNull: false,
        defaultValue: 'active'
    },
    additional_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON string with additional alarm data'
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
        {
            name: 'idx_alarm_device',
            fields: ['device_id']
        },
        {
            name: 'idx_alarm_timestamp',
            fields: ['timestamp']
        },
        {
            name: 'idx_alarm_status',
            fields: ['status']
        },
        {
            name: 'idx_alarm_severity',
            fields: ['severity']
        }
    ]
});

// Define relationships
Device.hasMany(Alarm, { foreignKey: 'device_id' });
Alarm.belongsTo(Device, { foreignKey: 'device_id' });
Alarm.belongsTo(User, { foreignKey: 'acknowledged_by', targetKey: 'user_id' }); // Add explicit relationship

export default Alarm;
