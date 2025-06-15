/**
 * Utility for emitting WebSocket events for model data changes
 * This should be used in controllers when data is created/updated/deleted
 */

// Function to emit device update
export const emitDeviceUpdate = (device) => {
    if (global.io) {
        global.io.emit('device_update', device);
        console.log(`Emitted device update event for ${device.device_name}`);
    }
};

// Function to emit spraying log update
export const emitSprayingLogUpdate = (log) => {
    if (global.io) {
        global.io.emit('spraying_log_update', log);
        console.log(`Emitted spraying log update event for log ${log.log_id}`);
    }
};

// Function to emit notification update
export const emitNotificationUpdate = (notification) => {
    if (global.io) {
        global.io.emit('notification_update', notification);
        console.log(`Emitted notification update event for notification ${notification.notif_id}`);
    }
};

// Function to emit setting update
export const emitSettingUpdate = (setting) => {
    if (global.io) {
        global.io.emit('setting_update', setting);
        console.log(`Emitted setting update event for setting ${setting.setting_id}`);
    }
};
