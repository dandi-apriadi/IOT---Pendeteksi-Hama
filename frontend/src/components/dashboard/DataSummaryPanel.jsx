import React, { useState } from 'react';

/**
 * Component for displaying a summary of both ESP32 sensor data and database model data
 */
const DataSummaryPanel = ({
    sensorData,
    devices,
    sprayingLogs,
    notifications,
    settings,
    lastUpdate,
    isConnected,
    onViewDetails
}) => {
    const [activeSection, setActiveSection] = useState('esp32');

    // Function to format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';

        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Time';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-base font-medium text-gray-800">System Data Summary</h3>
                <div className="mt-2 flex">
                    <button
                        onClick={() => setActiveSection('esp32')}
                        className={`mr-3 px-3 py-1.5 text-sm font-medium rounded-md ${activeSection === 'esp32'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        ESP32 Data
                    </button>
                    <button
                        onClick={() => setActiveSection('database')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeSection === 'database'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Database Models
                    </button>
                </div>
            </div>

            {activeSection === 'esp32' && (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">ESP32 Sensor Data</h4>
                        <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-500">
                                {isConnected ? 'Connected' : 'Disconnected'} • Last update: {formatTimestamp(lastUpdate)}
                            </span>
                        </div>
                    </div>

                    {sensorData ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-3 rounded-md">
                                <div className="text-xs text-blue-600 mb-1">Voltage</div>
                                <div className="text-xl font-bold text-blue-800">
                                    {sensorData.voltage?.toFixed(1) || 'N/A'} <span className="text-xs font-normal">V</span>
                                </div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-md">
                                <div className="text-xs text-purple-600 mb-1">Current</div>
                                <div className="text-xl font-bold text-purple-800">
                                    {sensorData.current?.toFixed(2) || 'N/A'} <span className="text-xs font-normal">A</span>
                                </div>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-md">
                                <div className="text-xs text-orange-600 mb-1">Power</div>
                                <div className="text-xl font-bold text-orange-800">
                                    {sensorData.power?.toFixed(0) || 'N/A'} <span className="text-xs font-normal">W</span>
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-md">
                                <div className="text-xs text-green-600 mb-1">Energy</div>
                                <div className="text-xl font-bold text-green-800">
                                    {sensorData.energy?.toFixed(3) || 'N/A'} <span className="text-xs font-normal">kWh</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-6 text-gray-500">
                            <p>No sensor data available</p>
                        </div>
                    )}

                    {sensorData && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className={`p-3 rounded-md ${sensorData.pir_status ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-600'}`}>
                                <div className="text-xs mb-1">PIR Sensor</div>
                                <div className="text-sm font-medium">{sensorData.pir_status ? 'Motion Detected' : 'No Motion'}</div>
                            </div>
                            <div className={`p-3 rounded-md ${sensorData.pump_status ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-600'}`}>
                                <div className="text-xs mb-1">Pump Status</div>
                                <div className="text-sm font-medium">{sensorData.pump_status ? 'ON' : 'OFF'}</div>
                            </div>
                            <div className={`p-3 rounded-md ${sensorData.auto_mode ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                                <div className="text-xs mb-1">Operation Mode</div>
                                <div className="text-sm font-medium">{sensorData.auto_mode ? 'Automatic' : 'Manual'}</div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => onViewDetails && onViewDetails('esp32')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View Details &rarr;
                        </button>
                    </div>
                </div>
            )}

            {activeSection === 'database' && (
                <div className="p-4">
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Database Models Summary</h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 rounded-md">
                                <div className="text-xs text-gray-500 mb-1">Devices</div>
                                <div className="text-xl font-bold text-gray-800">
                                    {devices?.length || 0}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <div className="text-xs text-gray-500 mb-1">Sensor Records</div>
                                <div className="text-xl font-bold text-gray-800">
                                    {Array.isArray(sensorData) ? sensorData.length : '--'}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <div className="text-xs text-gray-500 mb-1">Spraying Logs</div>
                                <div className="text-xl font-bold text-gray-800">
                                    {sprayingLogs?.length || 0}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <div className="text-xs text-gray-500 mb-1">Notifications</div>
                                <div className="text-xl font-bold text-gray-800">
                                    {notifications?.length || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5 className="text-xs text-gray-500 mb-2">Recent Database Activity</h5>
                        <ul className="space-y-2">
                            {sprayingLogs && sprayingLogs.length > 0 ? (
                                sprayingLogs.slice(0, 3).map((log, index) => (
                                    <li key={index} className="text-sm border-l-2 border-blue-400 pl-2">
                                        <span className="font-medium">{log.spraying_mode === 'otomatis' ? 'Auto' : 'Manual'} Spraying</span>
                                        <span className="text-gray-500 text-xs ml-2">
                                            {formatTimestamp(log.start_time)}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-500">No recent spraying logs</li>
                            )}
                        </ul>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => onViewDetails && onViewDetails('database')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View Tables &rarr;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataSummaryPanel;
