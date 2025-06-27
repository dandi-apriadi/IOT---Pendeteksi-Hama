// backend/models/notificationModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import moment from "moment";

const { DataTypes } = Sequelize;

const Notification = db.define('notifications', {
    notif_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('unread', 'read', 'belum terbaca', 'terbaca'),
        allowNull: false,
        defaultValue: 'unread'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('created_at');
            if (rawValue) {
                return moment(rawValue).format('D MMMM, YYYY, h:mm A');
            }
            return null;
        }
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: []
});

Notification.addHook('afterCreate', (notif, options) => {
    console.log('[NOTIFIKASI][DB][SUKSES]', notif.toJSON());
});

export default Notification;
