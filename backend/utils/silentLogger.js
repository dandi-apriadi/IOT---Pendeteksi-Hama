/**
 * Silent logger utility to suppress specific log types
 * Designed to keep the console clean by only showing ESP32 data
 */

// Store original console methods
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
};

// Function to check if a message is from energy trend aggregation
const isEnergyTrendLog = (message) => {
    if (typeof message !== 'string') return false;

    const energyTrendKeywords = [
        'energy trend',
        'trend aggregation',
        'generating trends',
        'hourly trends',
        'daily trends',
        'weekly trends',
        'monthly trends',
        '[History]'
    ];

    return energyTrendKeywords.some(keyword =>
        message.toLowerCase().includes(keyword.toLowerCase())
    );
};

// Function to check if a message is ESP32 sensor data
const isESP32SensorData = (message) => {
    if (typeof message !== 'object' || message === null) return false;

    return (
        message.device_id &&
        (message.voltage !== undefined ||
            message.current !== undefined ||
            message.power !== undefined)
    );
};

// Enhanced console that filters out unwanted messages
const filteredConsole = {
    log: function (message, ...args) {
        // Allow ESP32 data
        if (isESP32SensorData(message)) {
            originalConsole.log(JSON.stringify(message, null, 2));
            return;
        }

        // Suppress energy trend and history logs
        if (typeof message === 'string' && isEnergyTrendLog(message)) {
            return;
        }

        // Allow critical system messages
        if (typeof message === 'string' && (
            message.includes('Server running on port') ||
            message.includes('WebSocket endpoint:') ||
            message.includes('ESP32 HTTP endpoint:')
        )) {
            originalConsole.log(message, ...args);
        }
    },

    // Suppress most errors too
    error: function (message, ...args) {
        // Allow critical errors
        if (message && typeof message === 'string' && (
            message.includes('Server initialization failed:') ||
            message.includes('Error in generating energy trends:')
        )) {
            originalConsole.error(message, ...args);
        }
    },

    // Suppress all warnings
    warn: function () { },

    // Suppress info messages
    info: function () { },

    // Suppress debug messages
    debug: function () { }
};

// Functions to enable/disable silent mode
export const enableSilentMode = () => {
    console.log = filteredConsole.log;
    console.error = filteredConsole.error;
    console.warn = filteredConsole.warn;
    console.info = filteredConsole.info;
    console.debug = filteredConsole.debug;
};

export const disableSilentMode = () => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
};

// Export the logger
export default { enableSilentMode, disableSilentMode };
