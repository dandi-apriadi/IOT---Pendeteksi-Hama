import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PerangkatSection from './PerangkatSection';
import ESP32Section from './ESP32Section'; // Import ESP32Section
import SensorChart from './SensorChart';
import SensorDataTable from './SensorDataTable';
import { errorOnce } from '../../utils/consoleLogger';
import './value-transitions.css'; // Import the CSS for transitions

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const DISCONNECTION_THRESHOLD = 30000; // 30 seconds threshold for disconnection detection

/**
 * Dashboard - Main component for the monitoring dashboard
 */
const Dashboard = () => {
    // State variables
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
    const [timeframe, setTimeframe] = useState('24h');
    const [dataUpdated, setDataUpdated] = useState(false);
    const [devices, setDevices] = useState([]);
    const [deviceStatus, setDeviceStatus] = useState({});
    const [devicesLoading, setDevicesLoading] = useState(true);
    const [devicesError, setDevicesError] = useState(null);
    const [sensorData, setSensorData] = useState([]);
    const [sensorHistory, setSensorHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [electricalData, setElectricalData] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    // API base URL
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Fetch device data
    const fetchDevices = async () => {
        setDevicesLoading(true);
        try {
            console.log('Fetching device data from API...');
            const response = await axios.get(`${API_BASE_URL}/esp32/devices`);

            if (response.data && response.data.status === 'success') {
                console.log('Device data received:', response.data.data);
                setDevices(response.data.data || []);

                // Create device status map
                const statusMap = {};
                response.data.data.forEach(device => {
                    statusMap[device.device_id] = device.status;
                });
                setDeviceStatus(statusMap);
                setDevicesError(null);
            } else {
                console.error('Invalid device data format:', response.data);
                setDevicesError('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching device data:', error);
            setDevicesError(error.message || 'Failed to fetch device data');
        } finally {
            setDevicesLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchDevices();

        // Set up periodic refresh for device data
        const deviceRefreshInterval = setInterval(fetchDevices, 30000); // Every 30 seconds

        return () => {
            clearInterval(deviceRefreshInterval);
        };
    }, []);

    // Listen for real-time device status updates via Socket.IO
    useEffect(() => {
        if (!socket) return;

        socket.on('device_status', (data) => {
            if (data && data.device_id) {
                // Update the specific device status
                setDeviceStatus(prevStatus => ({
                    ...prevStatus,
                    [data.device_id]: data.status
                }));

                // Also update the full devices list if needed
                setDevices(prevDevices =>
                    prevDevices.map(device =>
                        device.device_id === data.device_id
                            ? { ...device, status: data.status, last_seen: data.timestamp }
                            : device
                    )
                );
            }
        });

        return () => {
            socket.off('device_status');
        };
    }, [socket]);

    // Check connection status of devices
    useEffect(() => {
        const checkConnections = () => {
            setIsConnected(devices.every(device => device.status === 'online'));
        };

        checkConnections();
        const connectionCheckInterval = setInterval(checkConnections, 5000); // Check every 5 seconds

        return () => {
            clearInterval(connectionCheckInterval);
        };
    }, [devices]);

    // Format last update time
    useEffect(() => {
        const formatLastUpdate = (timestamp) => {
            if (!timestamp) return 'Never';

            const now = new Date();
            const updateTime = new Date(timestamp);
            const diffMs = now - updateTime;

            if (diffMs < 10) return 'Just now';
            if (diffMs < 60) return `${Math.floor(diffMs / 1000)} seconds ago`;
            if (diffMs < 3600) return `${Math.floor(diffMs / 60000)} minutes ago`;

            return updateTime.toLocaleTimeString();
        };

        if (lastUpdate) {
            const formattedTime = formatLastUpdate(lastUpdate);
            setLastUpdateText(`Last update: ${formattedTime}`);
        }
    }, [lastUpdate]);

    // Direct AJAX fetch for real-time data without page refresh
    const fetchLatestSensorData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/esp32/data/latest`);

            if (response.data && response.data.status === 'success' && response.data.data) {
                // Data validation - ensure we never have empty electrical values
                const newData = response.data.data;

                // Create a complete data object combining new data with previous values for any missing fields
                const completeData = {
                    ...prevSensorDataRef.current, // Use previous data as base
                    ...newData, // Overlay with new data
                    // Ensure electrical values are never empty by falling back to previous values
                    voltage: parseFloat(newData.voltage) || prevSensorDataRef.current?.voltage || lastKnownReadings.voltage || 0,
                    current: parseFloat(newData.current) || prevSensorDataRef.current?.current || lastKnownReadings.current || 0,
                    power: parseFloat(newData.power) || prevSensorDataRef.current?.power || lastKnownReadings.power || 0,
                    energy: parseFloat(newData.energy) || prevSensorDataRef.current?.energy || lastKnownReadings.energy || 0
                };

                // Update DOM elements directly with the fresh data
                updateDomElementsWithNewData(completeData);
                prevSensorDataRef.current = completeData;

                console.log('AJAX fetched latest sensor data:', completeData);
            }
        } catch (error) {
            console.error('Error fetching latest sensor data:', error);
        }
    };

    // Setup real-time data updates using AJAX
    useEffect(() => {
        // Only set up polling if autoRefresh is enabled
        if (!autoRefresh) return;

        // Immediate first fetch
        fetchLatestSensorData();

        // Set up interval for regular data updates
        const intervalId = setInterval(() => {
            if (autoRefresh) {
                fetchLatestSensorData();
            }
        }, 5000); // Update every 5 seconds

        // Cleanup
        return () => {
            clearInterval(intervalId);
        };
    }, [autoRefresh]);

    // Add a separate, less frequent interval for history data
    useEffect(() => {
        if (!autoRefresh) return;

        const historyInterval = setInterval(() => {
            // Only fetch history occasionally to avoid overloading
            fetchSensorHistory('ESP32-PUMP-01', timeframe);
            console.log('Refreshed sensor history data');
        }, 30000); // Every 30 seconds

        return () => clearInterval(historyInterval);
    }, [autoRefresh, timeframe, fetchSensorHistory]);

    // Update timeframe and fetch data
    const onTimeframeChange = (newTimeframe) => {
        setTimeframe(newTimeframe);
        handleTimeframeChange(newTimeframe);
    };

    // Handle pump control command
    const handlePumpControl = async (action) => {
        if (!isConnected) return;
        try {
            await sendCommand('ESP32-PUMP-01', 'pump_control', { action });
            console.log(`Sent pump control command: ${action}`);

            // Optimistic UI update - immediately update the UI
            if (pumpStatusRef.current) {
                const newStatus = action === 'on';
                pumpStatusRef.current.textContent = newStatus ? 'ON' : 'OFF';
                pumpStatusRef.current.parentElement.classList.toggle('bg-blue-100', newStatus);
                pumpStatusRef.current.parentElement.classList.toggle('text-blue-800', newStatus);
                pumpStatusRef.current.parentElement.classList.toggle('bg-gray-100', !newStatus);
                pumpStatusRef.current.parentElement.classList.toggle('text-gray-600', !newStatus);
            }

            // Force a data refresh after a short delay to confirm the change
            setTimeout(() => fetchLatestSensorData(), 500);
        } catch (error) {
            errorOnce('ESP32_COMMAND_ERROR', 'Error sending command:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    ESP32 Sensor Monitoring
                </h2>
                <div className="flex space-x-2">
                    {/* Real-time toggle button removed, always on now */}
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${viewMode === 'table'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Table View
                    </button>
                    <button
                        onClick={() => setViewMode('chart')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${viewMode === 'chart'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Chart View
                    </button>
                </div>
            </div>

            {/* Connection status banner with real-time indicators */}
            <div className={`p-3 rounded-lg ${effectiveConnectionStatus ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${effectiveConnectionStatus ? 'bg-green-500' : 'bg-red-500'} ${effectiveConnectionStatus && dataUpdated ? 'animate-ping' : ''}`}></div>
                        <span className={`text-sm font-medium ${effectiveConnectionStatus ? 'text-green-700' : 'text-red-700'}`}>
                            {effectiveConnectionStatus ? 'Connected to ESP32' : 'Disconnected from ESP32'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2" ref={lastUpdateRef}>
                            Last update: {formatLastUpdate(lastUpdate)}
                        </span>
                    </div>

                    {/* Real-time PIR & Pump Status indicators with refs - UPDATED PIR TEXT */}
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center px-3 py-1 rounded-full ${sensorData?.pir_status
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-gray-100 text-gray-600'
                            }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${sensorData?.pir_status ? 'bg-red-500' : 'bg-gray-400'
                                } ${sensorData?.pir_status ? 'animate-pulse' : ''}`}></div>
                            <span className="text-xs font-medium">PIR: <span ref={pirStatusRef}>{sensorData?.pir_status ? 'MOTION DETECTED' : 'No Motion'}</span></span>
                        </div>

                        <div className={`flex items-center px-3 py-1 rounded-full ${sensorData?.pump_status
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-100 text-gray-600'
                            }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${sensorData?.pump_status ? 'bg-blue-500' : 'bg-gray-400'
                                } ${sensorData?.pump_status ? 'animate-pulse' : ''}`}></div>
                            <span className="text-xs font-medium">Pump: <span ref={pumpStatusRef}>{sensorData?.pump_status ? 'ON' : 'OFF'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time device control panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Control Panel</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Pump Control:</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handlePumpControl('on')}
                                    className={`px-3 py-1 text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50 ${sensorData?.pump_status
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white'
                                        }`}
                                    disabled={!isConnected}
                                >
                                    ON
                                </button>
                                <button
                                    onClick={() => handlePumpControl('off')}
                                    className={`px-3 py-1 text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50 ${!sensorData?.pump_status
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white'
                                        }`}
                                    disabled={!isConnected}
                                >
                                    OFF
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Mode:</span>
                            <button
                                onClick={() => sendCommand('ESP32-PUMP-01', 'mode_toggle')}
                                className={`px-3 py-1 text-xs font-medium rounded disabled:opacity-50 ${sensorData?.auto_mode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-yellow-500 text-white'
                                    }`}
                                disabled={!isConnected}
                            >
                                {sensorData?.auto_mode ? 'AUTO MODE' : 'MANUAL MODE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Current readings summary panel with animation on value change */}
                <div className="bg-white p-4 rounded-lg shadow lg:col-span-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Current Readings</h3>
                        <div className="flex items-center">
                            <span className={`text-xs mr-3 ${!effectiveConnectionStatus ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                                {!effectiveConnectionStatus && lastKnownReadings.timestamp ?
                                    `Last known data (${formatLastUpdate(lastKnownReadings.timestamp)})` :
                                    (dataUpdated ? '● Data updating...' : '○ Awaiting updates')}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`bg-blue-50 p-3 rounded-lg ${!effectiveConnectionStatus ? 'border border-orange-300' : ''}`}>
                            <div className="text-xs text-blue-600 font-medium">Voltage</div>
                            <div className="text-xl font-bold text-blue-900">
                                <span ref={voltageRef}>{electricalData?.voltage?.toFixed(2) || lastKnownReadings.voltage?.toFixed(2) || '0.00'}</span> V
                            </div>
                        </div>
                        <div className={`bg-green-50 p-3 rounded-lg ${!effectiveConnectionStatus ? 'border border-orange-300' : ''}`}>
                            <div className="text-xs text-green-600 font-medium">Current</div>
                            <div className="text-xl font-bold text-green-900">
                                <span ref={currentRef}>{electricalData?.current?.toFixed(3) || lastKnownReadings.current?.toFixed(3) || '0.000'}</span> A
                            </div>
                        </div>
                        <div className={`bg-purple-50 p-3 rounded-lg ${!effectiveConnectionStatus ? 'border border-orange-300' : ''}`}>
                            <div className="text-xs text-purple-600 font-medium">Power</div>
                            <div className="text-xl font-bold text-purple-900">
                                <span ref={powerRef}>{electricalData?.power?.toFixed(2) || lastKnownReadings.power?.toFixed(2) || '0.00'}</span> W
                            </div>
                        </div>
                        <div className={`bg-orange-50 p-3 rounded-lg ${!effectiveConnectionStatus ? 'border border-orange-300' : ''}`}>
                            <div className="text-xs text-orange-600 font-medium">Energy</div>
                            <div className="text-xl font-bold text-orange-900">
                                <span ref={energyRef}>{electricalData?.energy?.toFixed(3) || lastKnownReadings.energy?.toFixed(3) || '0.000'}</span> Wh
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeframe selector with refresh button */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => fetchLatestSensorData()}
                    className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Now
                </button>
                <div className="flex space-x-2">
                    {['1h', '6h', '12h', '24h', '7d', '30d'].map(option => (
                        <button
                            key={option}
                            onClick={() => onTimeframeChange(option)}
                            className={`px-2.5 py-1 text-xs font-medium rounded ${timeframe === option
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main data display - Toggle between Table and Chart */}
            <div className="bg-white rounded-lg shadow p-4">
                {viewMode === 'table' ? (
                    <SensorDataTable
                        data={sensorHistory}
                        isLoading={loading}
                        maxRows={15}
                    />
                ) : (
                    <SensorChart
                        data={sensorHistory}
                        loading={loading}
                        onTimeframeChange={handleTimeframeChange}
                        realTimeUpdates={autoRefresh}
                    />
                )}
            </div>

            {/* Device Section - pass all required props */}
            <PerangkatSection
                devices={devices}
                isConnected={isConnected} // assuming isConnected is defined elsewhere in the component
                loading={devicesLoading}
                error={devicesError}
                onRefresh={fetchDevices}
            />
        </div>
    );
};

export default Dashboard;