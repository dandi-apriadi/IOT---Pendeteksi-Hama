// backend/controllers/notificationController.js
import Notification from '../models/notificationModel.js';
import { Op } from 'sequelize';

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAll();
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { type, title, message } = req.body;
    const notification = await Notification.create({ type, title, message });
    console.log('[NOTIFIKASI][SUKSES]', notification);
    res.json({ success: true, data: notification });
  } catch (err) {
    console.error('[NOTIFIKASI][ERROR]', err.message);
    res.status(500).json({ success: false, message: 'Failed to create notification', error: err.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.markAllRead();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark as read', error: err.message });
  }
};

export const deleteAll = async (req, res) => {
  try {
    await Notification.deleteAll();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete notifications', error: err.message });
  }
};

export const testNotification = async (req, res) => {
  try {
    const now = new Date();
    const notification = await Notification.create({
      type: 'test',
      title: 'Notifikasi Test',
      message: `Notifikasi test dibuat pada ${now.toISOString()}`
    });
    console.log('[NOTIFIKASI][SUKSES]', notification);
    res.json({ success: true, data: notification });
  } catch (err) {
    console.error('[NOTIFIKASI][ERROR]', err.message);
    res.status(500).json({ success: false, message: 'Failed to create test notification', error: err.message });
  }
};
