import express from 'express';
import * as alarmController from "../controllers/alarmController.js";

const router = express.Router();

/**
 * Alarm API Routes
 * For handling system alerts and notifications
 */

// Get alarm list with filtering and pagination
router.get('/api/alarms', alarmController.getAlarms);

// Get alarm statistics
router.get('/api/alarms/stats', alarmController.getAlarmStats);

// Acknowledge an alarm
router.post('/api/alarms/:id/acknowledge', alarmController.acknowledgeAlarm);

export default router;
