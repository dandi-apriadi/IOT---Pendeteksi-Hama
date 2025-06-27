import express from 'express';
import * as scheduleController from "../controllers/scheduleController.js";

const router = express.Router();

// Schedule Routes
router.get('/', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.post('/', scheduleController.createSchedule);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);
router.patch('/:id/toggle', scheduleController.toggleScheduleStatus);

// Special routes for dashboard
router.get('/active/all', scheduleController.getActiveSchedules);
router.get('/today', scheduleController.getTodaySchedules);

export default router;
