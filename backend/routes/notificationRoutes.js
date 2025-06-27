// backend/routes/notificationRoutes.js
import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', notificationController.getAllNotifications);
router.post('/', notificationController.createNotification);
router.post('/mark-all-read', notificationController.markAllRead);
router.delete('/delete-all', notificationController.deleteAll);
router.post('/test', notificationController.testNotification);

export default router;
