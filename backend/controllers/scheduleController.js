import Schedule from "../models/scheduleModel.js";
import { Device } from "../models/tableModel.js";
import { Op } from "sequelize";
import { notifyScheduleResult } from './sensorDataController.js';

// Get all schedules
export const getAllSchedules = async (req, res) => {
    try {
        const { device_id, is_active } = req.query;
        let whereClause = {};

        // Apply filters if provided
        if (device_id) {
            whereClause.device_id = device_id;
        }

        if (is_active !== undefined) {
            whereClause.is_active = is_active === 'true';
        }

        console.log('GetAllSchedules - Fetching schedules with filters:', whereClause);

        const schedules = await Schedule.findAll({
            where: whereClause,
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            order: [['updated_at', 'DESC']]
        });

        console.log('GetAllSchedules - Found schedules:', schedules.length);
        console.log('GetAllSchedules - Schedule data:', schedules.map(s => ({
            id: s.schedule_id,
            title: s.title,
            device_id: s.device_id,
            schedule_type: s.schedule_type
        })));

        return res.json({
            status: 'success',
            message: 'Schedules retrieved successfully',
            data: schedules,
            count: schedules.length
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve schedules',
            error: error.message
        });
    }
};

// Get schedule by ID
export const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await Schedule.findByPk(id, {
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }]
        });

        if (!schedule) {
            return res.status(404).json({
                status: 'error',
                message: `Schedule with ID ${id} not found`
            });
        }

        return res.json({
            status: 'success',
            message: 'Schedule retrieved successfully',
            data: schedule
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve schedule',
            error: error.message
        });
    }
};

// Create new schedule
export const createSchedule = async (req, res) => {
    try {
        const {
            device_id,
            title,
            schedule_type,
            start_time,
            end_time,
            action_type,
            is_active
        } = req.body;

        // Validate required fields
        if (!device_id || !title || !schedule_type || !start_time) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: device_id, title, schedule_type, and start_time are required'
            });
        }

        // Validate device exists
        const device = await Device.findByPk(device_id);
        if (!device) {
            return res.status(404).json({
                status: 'error',
                message: `Device with ID ${device_id} not found`
            });
        }

        // Validate schedule_type
        if (!['one-time', 'daily', 'weekly', 'custom'].includes(schedule_type)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid schedule_type. Must be one of: one-time, daily, weekly, custom'
            });
        }

        // Validate action_type if provided
        if (action_type && !['turn_on', 'turn_off', 'toggle'].includes(action_type)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid action_type. Must be one of: turn_on, turn_off, toggle'
            });
        }        // Create the schedule
        const newSchedule = await Schedule.create({
            device_id,
            title,
            schedule_type,
            start_time,
            end_time,
            action_type: action_type || 'turn_on',
            is_active: is_active !== undefined ? is_active : true
        });

        // Notifikasi schedule berhasil dibuat/berhasil dijalankan (simulasi eksekusi)
        await notifyScheduleResult({
            device,
            device_id,
            timestamp: new Date(),
            success: true
        });

        return res.status(201).json({
            status: 'success',
            message: 'Schedule created successfully',
            data: newSchedule
        });
    } catch (error) {
        // Notifikasi schedule gagal dibuat/eksekusi gagal
        await notifyScheduleResult({
            device: null,
            device_id: req.body.device_id,
            timestamp: new Date(),
            success: false,
            reason: error.message
        });
        console.error('Error creating schedule:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create schedule',
            error: error.message
        });
    }
};

// Update schedule
export const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params; const {
            title,
            schedule_type,
            start_time,
            end_time,
            action_type,
            is_active
        } = req.body;

        // Find the schedule
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({
                status: 'error',
                message: `Schedule with ID ${id} not found`
            });
        }

        // Prepare update data
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (schedule_type !== undefined) {
            // Validate schedule_type
            if (!['one-time', 'daily', 'weekly', 'custom'].includes(schedule_type)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid schedule_type. Must be one of: one-time, daily, weekly, custom'
                });
            }
            updateData.schedule_type = schedule_type;
        } if (start_time !== undefined) updateData.start_time = start_time;
        if (end_time !== undefined) updateData.end_time = end_time;

        if (action_type !== undefined) {
            // Validate action_type
            if (!['turn_on', 'turn_off', 'toggle'].includes(action_type)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid action_type. Must be one of: turn_on, turn_off, toggle'
                });
            }
            updateData.action_type = action_type;
        }

        if (is_active !== undefined) updateData.is_active = is_active;

        // Update the schedule
        await schedule.update(updateData);

        // Get the updated schedule with device information
        const updatedSchedule = await Schedule.findByPk(id, {
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }]
        });

        return res.json({
            status: 'success',
            message: 'Schedule updated successfully',
            data: updatedSchedule
        });
    } catch (error) {
        console.error('Error updating schedule:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update schedule',
            error: error.message
        });
    }
};

// Delete schedule
export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the schedule
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({
                status: 'error',
                message: `Schedule with ID ${id} not found`
            });
        }

        // Delete the schedule
        await schedule.destroy();

        return res.json({
            status: 'success',
            message: 'Schedule deleted successfully',
            data: { id }
        });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to delete schedule',
            error: error.message
        });
    }
};

// Toggle schedule active status
export const toggleScheduleStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the schedule
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({
                status: 'error',
                message: `Schedule with ID ${id} not found`
            });
        }

        // Toggle the status
        await schedule.update({
            is_active: !schedule.is_active
        });

        return res.json({
            status: 'success',
            message: `Schedule ${schedule.is_active ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: schedule.schedule_id,
                is_active: schedule.is_active
            }
        });
    } catch (error) {
        console.error('Error toggling schedule status:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to toggle schedule status',
            error: error.message
        });
    }
};

// Get schedules for dashboard (active schedules only)
export const getActiveSchedules = async (req, res) => {
    try {
        const activeSchedules = await Schedule.findAll({
            where: { is_active: true },
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            order: [['start_time', 'ASC']]
        });

        return res.json({
            status: 'success',
            message: 'Active schedules retrieved successfully',
            data: activeSchedules,
            count: activeSchedules.length
        });
    } catch (error) {
        console.error('Error fetching active schedules:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve active schedules',
            error: error.message
        });
    }
};

// Get today's schedules
export const getTodaySchedules = async (req, res) => {
    try {
        // Get current day of week (0=Sunday, 1=Monday, ..., 6=Saturday)        const today = new Date().getDay();
        // Convert to our format (1=Monday, ..., 7=Sunday)
        const dayOfWeek = today === 0 ? 7 : today;

        // Find schedules that are active (no longer filtering by days_of_week since field is removed)
        const todaySchedules = await Schedule.findAll({
            where: {
                is_active: true,
                [Op.or]: [
                    { schedule_type: 'daily' },
                    { schedule_type: 'weekly' },
                    { schedule_type: 'custom' },
                    { schedule_type: 'one-time', start_time: { [Op.gte]: new Date() } }
                ]
            },
            include: [{
                model: Device,
                attributes: ['device_name', 'location']
            }],
            order: [['start_time', 'ASC']]
        });

        return res.json({
            status: 'success',
            message: "Today's schedules retrieved successfully",
            data: todaySchedules,
            count: todaySchedules.length
        });
    } catch (error) {
        console.error("Error fetching today's schedules:", error);
        return res.status(500).json({
            status: 'error',
            message: "Failed to retrieve today's schedules",
            error: error.message
        });
    }
};
