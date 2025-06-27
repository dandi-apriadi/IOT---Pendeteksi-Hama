import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const { DataTypes } = Sequelize;

// Devices Model - Fixing index issue
const Device = db.define('devices', {
    device_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }, device_name: {
        type: DataTypes.STRING(100),
        allowNull: false
        // Removed unique constraint to avoid extra index
    },
    device_status: {
        type: DataTypes.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    last_online: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('created_at');
            if (rawValue) {
                return moment(this.getDataValue('created_at')).format('D MMMM, YYYY, h:mm A');
            }
            return null;
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('updated_at');
            if (rawValue) {
                return moment(this.getDataValue('updated_at')).format('D MMMM, YYYY, h:mm A');
            }
            return null;
        }
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // Remove custom indexes declaration since unique already creates one
    // and primary key also creates one automatically
    indexes: []
});

// Spraying Logs Model - Reduce indexes
const SprayingLog = db.define('spraying_logs', {
    log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Device,
            key: 'device_id'
        }
    },
    spraying_mode: {
        type: DataTypes.ENUM('otomatis', 'manual'),
        allowNull: false
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    pesticide_used: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('berhasil', 'gagal'),
        allowNull: false,
        defaultValue: 'berhasil'
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [] // Remove unnecessary indexes
});

// Notifications Model - Reduce indexes
const Notification = db.define('notifications', {
    notif_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Device,
            key: 'device_id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('terbaca', 'belum terbaca'),
        allowNull: false,
        defaultValue: 'belum terbaca'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('created_at')).format('D MMMM, YYYY, h:mm A');
        }
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [] // Remove unnecessary indexes
});

// Settings Model
const Setting = db.define('settings', {
    setting_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    parameter: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('updated_at')).format('D MMMM, YYYY, h:mm A');
        }
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: []
});

// Define relationships
Device.hasMany(SprayingLog, { foreignKey: 'device_id' });
Device.hasMany(Notification, { foreignKey: 'device_id' });

// Relationships with Sensor are defined in sensorModel.js
SprayingLog.belongsTo(Device, { foreignKey: 'device_id' });
Notification.belongsTo(Device, { foreignKey: 'device_id' });

// Export all models
export { Device, SprayingLog, Notification, Setting };
