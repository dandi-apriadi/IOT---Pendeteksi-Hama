import express from 'express';
import * as dashboardController from "../../controllers/administrator/dashboardController.js";
const router = express.Router();

/**
 * API ROUTES
 * IoT Rice Pest Spraying Automation System
 */

// Dashboard routes
router.get('/api/dashboard/summary', dashboardController.getDashboardSummary);

// Device management routes
router.get('/api/devices', dashboardController.getAllDevices);
router.get('/api/devices/:id', dashboardController.getDeviceById);
router.post('/api/devices', dashboardController.createDevice);
router.put('/api/devices/:id', dashboardController.updateDevice);
router.delete('/api/devices/:id', dashboardController.deleteDevice);
router.put('/api/devices/:id/status', dashboardController.updateDeviceStatus);

// Sensor data routes
router.get('/api/sensors', dashboardController.getAllSensorData);
router.get('/api/sensors/device/:deviceId', dashboardController.getSensorDataByDevice);
router.get('/api/sensors/latest', dashboardController.getLatestSensorData);
router.post('/api/sensors', dashboardController.recordSensorData);

// Spraying management routes
router.get('/api/spraying-logs', dashboardController.getSprayingLogs);
router.get('/api/spraying-logs/device/:deviceId', dashboardController.getSprayingLogsByDevice);
router.post('/api/spraying/manual/:deviceId', dashboardController.initiateManualSpraying);
router.put('/api/spraying-logs/:id/complete', dashboardController.completeSprayingLog);

// Notification routes
router.get('/api/notifications', dashboardController.getNotifications);
router.put('/api/notifications/:id/read', dashboardController.markNotificationAsRead);
router.delete('/api/notifications/:id', dashboardController.deleteNotification);

// Settings routes
router.get('/api/settings', dashboardController.getAllSettings);
router.put('/api/settings/:id', dashboardController.updateSetting);

export default router;