import React, { useState, useEffect } from 'react';
import { errorOnce } from '../../utils/consoleLogger';

/**
 * Component for displaying live real-time ESP32 sensor data
 */
const SensorDataLiveView = ({ sensorData, lastUpdate, isConnected }) => {
    // Add console log for data received from backend
    useEffect(() => {
        if (sensorData) {
            console.log('SensorDataLiveView - Data received from backend:', sensorData);
        }
    }, [sensorData]);

    // Format time nicely
    const formatTime = (timestamp) => {
        if (!timestamp) return 'No data';
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString();
        } catch (error) {
            errorOnce('LIVE_VIEW_TIMESTAMP_ERROR', 'Error formatting timestamp:', error);
            return 'Invalid time';
        }
    };

    // State for animated values to provide a smoother experience
    const [animatedValues, setAnimatedValues] = useState({
        voltage: 0,
        current: 0,
        power: 0,
        energy: 0
    });

    // Track data to show "changed" indicators
    const [previousValues, setPreviousValues] = useState({});
    const [changedFields, setChangedFields] = useState({});

    // Update animated values and track changes when data changes
    useEffect(() => {
        if (!sensorData) return;

        // Log data changes with color highlighting
        console.log('%cSensorDataLiveView - Processing data update:', 'background: #3498db; color: white; padding: 2px 5px; border-radius: 3px;');
        console.table({
            voltage: sensorData.voltage || 0,
            current: sensorData.current || 0,
            power: sensorData.power || 0,
            energy: sensorData.energy || 0,
            pir_status: !!sensorData.pir_status,
            pump_status: !!sensorData.pump_status,
            timestamp: sensorData.timestamp || new Date().toISOString()
        });

        // Track which fields changed
        const newChangedFields = {};
        Object.keys(animatedValues).forEach(key => {
            if (previousValues[key] !== sensorData[key]) {
                newChangedFields[key] = true;
            }
        });

        // Save current values as previous for next comparison
        setPreviousValues({
            voltage: sensorData.voltage,
            current: sensorData.current,
            power: sensorData.power,
            energy: sensorData.energy
        });

        // Set changed indicators (will clear after 2 seconds)
        setChangedFields(newChangedFields);

        // Clear changed indicators after 2 seconds
        const timer = setTimeout(() => {
            setChangedFields({});
        }, 2000);

        // Set animated values to the actual data
        setAnimatedValues({
            voltage: parseFloat(sensorData.voltage) || 0,
            current: parseFloat(sensorData.current) || 0,
            power: parseFloat(sensorData.power) || 0,
            energy: parseFloat(sensorData.energy) || 0
        });

        return () => clearTimeout(timer);
    }, [sensorData]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Live Sensor Data</h3>
                <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className="text-xs text-gray-500">
                        {isConnected ? 'Connected' : 'Disconnected'} • Last update: {formatTime(lastUpdate)}
                    </span>
                </div>
            </div>

            {sensorData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`bg-blue-50 p-3 rounded-md ${changedFields.voltage ? 'border border-blue-400' : ''}`}>
                        <div className="text-xs text-blue-600 mb-1">Voltage</div>
                        <div className="text-xl font-bold text-blue-800">
                            {animatedValues.voltage.toFixed(1)} <span className="text-xs font-normal">V</span>
                            {changedFields.voltage && <span className="ml-2 text-xs text-blue-600">●</span>}
                        </div>
                    </div>
                    <div className={`bg-purple-50 p-3 rounded-md ${changedFields.current ? 'border border-purple-400' : ''}`}>
                        <div className="text-xs text-purple-600 mb-1">Current</div>
                        <div className="text-xl font-bold text-purple-800">
                            {animatedValues.current.toFixed(2)} <span className="text-xs font-normal">A</span>
                            {changedFields.current && <span className="ml-2 text-xs text-purple-600">●</span>}
                        </div>
                    </div>
                    <div className={`bg-orange-50 p-3 rounded-md ${changedFields.power ? 'border border-orange-400' : ''}`}>
                        <div className="text-xs text-orange-600 mb-1">Power</div>
                        <div className="text-xl font-bold text-orange-800">
                            {animatedValues.power.toFixed(1)} <span className="text-xs font-normal">W</span>
                            {changedFields.power && <span className="ml-2 text-xs text-orange-600">●</span>}
                        </div>
                    </div>
                    <div className={`bg-green-50 p-3 rounded-md ${changedFields.energy ? 'border border-green-400' : ''}`}>
                        <div className="text-xs text-green-600 mb-1">Energy</div>
                        <div className="text-xl font-bold text-green-800">
                            {animatedValues.energy.toFixed(4)} <span className="text-xs font-normal">kWh</span>
                            {changedFields.energy && <span className="ml-2 text-xs text-green-600">●</span>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-6 text-gray-500">
                    <p>No sensor data available</p>
                    {!isConnected && (
                        <button
                            className="mt-2 px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                            onClick={() => window.location.reload()}
                        >
                            Reconnect
                        </button>
                    )}
                </div>
            )}

            {/* Pump Status */}
            {sensorData && (
                <div className={`mt-4 p-3 rounded-md ${sensorData.pump_status ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-600'}`}>
                    <div className="text-xs mb-1">Pump Status</div>
                    <div className="text-base font-medium flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${sensorData.pump_status ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                        {sensorData.pump_status ? 'ON' : 'OFF'}
                    </div>
                </div>
            )}

            {/* PIR Status */}
            {sensorData && (
                <div className={`mt-2 p-3 rounded-md ${sensorData.pir_status ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-600'}`}>
                    <div className="text-xs mb-1">Motion Detector</div>
                    <div className="text-base font-medium flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${sensorData.pir_status ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                        {sensorData.pir_status ? 'Motion Detected' : 'No Motion'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorDataLiveView;
