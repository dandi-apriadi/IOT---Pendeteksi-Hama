import React, { useState } from 'react';
import useSensorData from '../../hooks/useSensorData';
import SensorDataLiveView from './SensorDataLiveView';
import SensorDataHistoryChart from './SensorDataHistoryChart';
import { errorOnce } from '../../utils/consoleLogger';

/**
 * Main dashboard component for ESP32 data visualization
 */
const ESP32Dashboard = () => {
    const [timeframe, setTimeframe] = useState('24h');

    const {
        deviceId,
        changeDevice,
        sensorData,
        lastUpdate,
        isConnected,
        historyData,
        dailyData,
        statsData,
        devices,
        loading,
        error,
        fetchAllData,
        togglePump
    } = useSensorData();

    // Handle device selection change
    const handleDeviceChange = (e) => {
        changeDevice(e.target.value);
    };

    // Handle timeframe selection
    const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
    };

    // Handle pump toggle
    const handlePumpToggle = async () => {
        if (!sensorData) return; try {
            const newStatus = !sensorData.pump_status;
            await togglePump(newStatus);
        } catch (err) {
            errorOnce('PUMP_TOGGLE_ERROR', 'Failed to toggle pump:', err);
            alert('Failed to control pump. Check device connection.');
        }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">ESP32 Monitoring</h2>

                    <div className="flex space-x-3 mt-2 sm:mt-0">
                        {/* Device selector */}
                        <select
                            value={deviceId}
                            onChange={handleDeviceChange}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-3 py-1.5"
                        >
                            {devices.length > 0 ? (
                                devices.map(device => (
                                    <option key={device.device_id} value={device.device_id}>
                                        {device.device_id} - {device.status}
                                    </option>
                                ))
                            ) : (
                                <option value={deviceId}>{deviceId}</option>
                            )}
                        </select>

                        {/* Timeframe selector */}
                        <select
                            value={timeframe}
                            onChange={handleTimeframeChange}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-3 py-1.5"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="6h">Last 6 Hours</option>
                            <option value="12h">Last 12 Hours</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>

                        {/* Refresh button */}
                        <button
                            onClick={fetchAllData}
                            disabled={loading.history || loading.daily || loading.stats}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium px-3 py-1.5 rounded flex items-center"
                        >
                            {(loading.history || loading.daily || loading.stats) ? (
                                <>
                                    <div className="animate-spin h-3 w-3 border-2 border-t-blue-600 border-blue-200 rounded-full mr-2"></div>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Connection status */}
                <div className={`mb-4 px-3 py-2 rounded-lg flex items-center ${isConnected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">
                        {isConnected ? 'Connected to ESP32 device' : 'Using cached data - WebSocket disconnected'}
                    </span>
                    <span className="ml-auto text-xs opacity-75">
                        {lastUpdate ? `Last update: ${new Date(lastUpdate).toLocaleTimeString()}` : 'No data'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live sensor data display */}
                <div>
                    <SensorDataLiveView
                        sensorData={sensorData}
                        lastUpdate={lastUpdate}
                        isConnected={isConnected}
                    />

                    {/* Device controls */}
                    {sensorData && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-5">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Device Controls</h3>

                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-sm text-gray-600">Pump Control</span>
                                </div>
                                <button
                                    onClick={handlePumpToggle}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${sensorData.pump_status ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                >
                                    <span className="sr-only">Toggle pump</span>
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${sensorData.pump_status ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <div>
                                    <span className="text-sm text-gray-600">Mode</span>
                                </div>
                                <div className="text-sm font-medium">
                                    {sensorData.auto_mode ? 'Automatic' : 'Manual'}
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-4">
                                <p>Device ID: {deviceId}</p>
                                <p>Firmware: ESP32 IoT Control v1.0</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Charts and history */}
                <div>
                    {/* Sensor history chart */}
                    <SensorDataHistoryChart
                        deviceId={deviceId}
                        timeframe={timeframe}
                    />

                    {/* Stats summary */}
                    {statsData && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mt-5">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Energy Summary</h3>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-green-50 rounded-md p-3">
                                    <div className="text-xs text-gray-500 mb-1">Total Energy</div>
                                    <div className="text-lg font-semibold text-green-700">
                                        {statsData.summary?.total_energy_kwh || 0} <span className="text-xs">kWh</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-md p-3">
                                    <div className="text-xs text-gray-500 mb-1">Avg. Daily</div>
                                    <div className="text-lg font-semibold text-blue-700">
                                        {statsData.summary?.avg_daily_energy_kwh || 0} <span className="text-xs">kWh</span>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-md p-3">
                                    <div className="text-xs text-gray-500 mb-1">Pump Usage</div>
                                    <div className="text-lg font-semibold text-purple-700">
                                        {statsData.summary?.avg_pump_usage_percent || 0}%
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 text-xs text-gray-500">
                                Period: {statsData.time_range?.start} to {statsData.time_range?.end}
                            </div>
                        </div>
                    )}

                    {/* Daily consumption if available */}
                    {dailyData && dailyData.hourly_data && dailyData.hourly_data.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mt-5">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Consumption</h3>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total today:</span>
                                <span className="font-medium">
                                    {dailyData.summary?.total_energy_kwh || 0} kWh
                                </span>
                            </div>

                            <div className="mt-2 h-16 flex items-end space-x-1">
                                {dailyData.hourly_data.map((hour, index) => {
                                    // Find max value for scaling
                                    const maxPower = Math.max(
                                        ...dailyData.hourly_data.map(h => parseFloat(h.avg_power || 0))
                                    ) || 1;

                                    // Calculate height percentage (max 100%)
                                    const heightPercent = Math.min(100,
                                        (parseFloat(hour.avg_power || 0) / maxPower) * 100
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="flex-1 bg-blue-200 rounded-t"
                                            style={{ height: `${heightPercent}%` }}
                                            title={`${hour.hour.split(' ')[1]}: ${hour.avg_power}W`}
                                        ></div>
                                    );
                                })}
                            </div>

                            <div className="mt-1 flex justify-between text-xs text-gray-500">
                                {dailyData.hourly_data.length > 0 && (
                                    <>
                                        <span>{dailyData.hourly_data[0].hour.split(' ')[1].split(':')[0]}h</span>
                                        <span>{dailyData.hourly_data[dailyData.hourly_data.length - 1].hour.split(' ')[1].split(':')[0]}h</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ESP32Dashboard;
