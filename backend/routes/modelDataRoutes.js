import express from 'express';
import { Device, SprayingLog, Notification, Setting } from "../models/tableModel.js";
import { Op } from "sequelize";

const router = express.Router();

/**
 * Routes for retrieving all model data from database
 */

// Get all devices
router.get('/api/devices', async (req, res) => {
    try {
        const devices = await Device.findAll({
            order: [['device_id', 'ASC']]
        });

        return res.json({
            status: 'success',
            message: 'Devices retrieved successfully',
            data: devices
        });
    } catch (error) {
        console.error('Error fetching devices:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve devices',
            error: error.message
        });
    }
});

// Get all spraying logs
router.get('/api/spraying/logs', async (req, res) => {
    try {
        const logs = await SprayingLog.findAll({
            order: [['start_time', 'DESC']],
            include: [{ model: Device, attributes: ['device_name'] }]
        });

        return res.json({
            status: 'success',
            message: 'Spraying logs retrieved successfully',
            data: logs
        });
    } catch (error) {
        console.error('Error fetching spraying logs:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve spraying logs',
            error: error.message
        });
    }
});

// Get all notifications
router.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [['created_at', 'DESC']],
            include: [{ model: Device, attributes: ['device_name'] }]
        });

        return res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve notifications',
            error: error.message
        });
    }
});

// Get all settings
router.get('/api/settings', async (req, res) => {
    try {
        const settings = await Setting.findAll({
            order: [['setting_id', 'ASC']]
        });

        return res.json({
            status: 'success',
            message: 'Settings retrieved successfully',
            data: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve settings',
            error: error.message
        });
    }
});

export default router;
