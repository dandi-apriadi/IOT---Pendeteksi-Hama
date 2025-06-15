/**
 * Custom logger utility to control console output
 * This file helps manage which messages are shown in the console
 */

// Store original console methods
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
};

// Create ESP32 data-only logger
const ESP32Logger = {
    // Only log ESP32 sensor data, nothing else
    log: function (data) {
        // Check if this is ESP32 sensor data
        if (typeof data === 'object' &&
            data !== null &&
            (data.device_id || data.type === 'sensor_data') &&
            (data.voltage !== undefined || data.current !== undefined)) {
            // Format and display only ESP32 data
            originalConsole.log(JSON.stringify(data, null, 2));
        }
    },

    // Suppress all error logs
    error: function () { },

    // Suppress all warning logs
    warn: function () { },

    // Suppress all info logs
    info: function () { },

    // Suppress all debug logs
    debug: function () { }
};

// Export the customized logger
export { ESP32Logger };

// Function to override global console
export const enableESP32OnlyLogging = () => {
    console.log = ESP32Logger.log;
    console.error = ESP32Logger.error;
    console.warn = ESP32Logger.warn;
    console.info = ESP32Logger.info;
    console.debug = ESP32Logger.debug;
};

// Function to restore normal console behavior
export const restoreConsole = () => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
};
