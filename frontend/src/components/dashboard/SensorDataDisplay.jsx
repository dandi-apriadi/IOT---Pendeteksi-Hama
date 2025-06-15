import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errorOnce } from '../../utils/consoleLogger';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SensorDataDisplay = ({ deviceId = 'ESP32-PUMP-01' }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('24h');
    const [activeDevice, setActiveDevice] = useState(deviceId);
    const [devices, setDevices] = useState([]);
    const [tab, setTab] = useState('latest');

    useEffect(() => {
        // Load devices first
        fetchDevices();

        // Load initial data
        fetchSensorData(activeDevice, timeframe);

        // Set up auto-refresh
        const refreshInterval = setInterval(() => {
            if (tab === 'latest') {
                fetchLatestReadings(activeDevice);
            }
        }, 5000);

        return () => clearInterval(refreshInterval);
    }, [activeDevice, timeframe, tab]);

    const fetchDevices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/esp32/devices`);
            if (response.data && response.data.status === 'success') {
                setDevices(response.data.data || []);
            }
        } catch (err) {
            errorOnce('SENSOR_DISPLAY_DEVICES_ERROR', 'Error fetching devices:', err);
        }
    };

    const fetchSensorData = async (device, tf) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/esp32/data/history/${device}?timeframe=${tf}`);
            if (response.data && response.data.status === 'success') {
                setData(response.data);
            } else {
                setError(response.data?.message || 'Failed to fetch data');
            }
        } catch (err) {
            errorOnce('SENSOR_DISPLAY_DATA_ERROR', 'Error fetching sensor data:', err);
            setError(err.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const fetchLatestReadings = async (device) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/esp32/data/latest?device_id=${device}`);
            if (response.data && response.data.status === 'success' && response.data.data) {
                // Update just the latest reading without full reload
                setData(prev => {
                    if (!prev) return { data: [response.data.data] };
                    return {
                        ...prev,
                        latestReading: response.data.data
                    };
                });
            }
        } catch (err) {
            errorOnce('SENSOR_DISPLAY_LATEST_ERROR', 'Error fetching latest reading:', err);
        }
    };

    const handleDeviceChange = (e) => {
        const newDevice = e.target.value;
        setActiveDevice(newDevice);
        fetchSensorData(newDevice, timeframe);
    };

    const handleTimeframeChange = (e) => {
        const newTimeframe = e.target.value;
        setTimeframe(newTimeframe);
        fetchSensorData(activeDevice, newTimeframe);
    };

    // Format timestamp using native Date methods instead of moment
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (loading && !data) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-red-800 font-medium mb-2">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => fetchSensorData(activeDevice, timeframe)}
                    className="mt-4 px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    ESP32 Sensor Data
                </h2>
                <div className="flex space-x-3">
                    <select
                        value={activeDevice}
                        onChange={handleDeviceChange}
                        className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm"
                    >
                        {devices.map(device => (
                            <option key={device.device_id} value={device.device_id}>
                                {device.device_name || device.device_id}
                            </option>
                        ))}
                    </select>

                    <select
                        value={timeframe}
                        onChange={handleTimeframeChange}
                        className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="6h">Last 6 Hours</option>
                        <option value="12h">Last 12 Hours</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>

                    <button
                        onClick={() => fetchSensorData(activeDevice, timeframe)}
                        className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <div>Device ID: <span className="font-medium">{activeDevice}</span></div>
                    {data?.latestReading?.timestamp && (
                        <div>Last update: <span className="font-medium">{formatTimestamp(data.latestReading.timestamp)}</span></div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-blue-800 text-sm font-medium mb-3">Latest Reading</h3>
                {data?.latestReading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="text-xs text-gray-500">Voltage</div>
                            <div className="text-xl font-bold text-blue-600">
                                {data.latestReading.voltage?.toFixed(1) || 'N/A'} <span className="text-sm font-normal">V</span>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="text-xs text-gray-500">Current</div>
                            <div className="text-xl font-bold text-purple-600">
                                {data.latestReading.current?.toFixed(2) || 'N/A'} <span className="text-sm font-normal">A</span>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="text-xs text-gray-500">Power</div>
                            <div className="text-xl font-bold text-orange-600">
                                {data.latestReading.power?.toFixed(0) || 'N/A'} <span className="text-sm font-normal">W</span>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="text-xs text-gray-500">Energy</div>
                            <div className="text-xl font-bold text-green-600">
                                {data.latestReading.energy?.toFixed(3) || 'N/A'} <span className="text-sm font-normal">kWh</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No latest reading available</p>
                )}
            </div>

            <div className="mb-4">
                <ul className="flex border-b">
                    <li className="-mb-px">
                        <button
                            onClick={() => setTab('latest')}
                            className={`py-2 px-4 text-sm font-medium ${tab === 'latest'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-blue-600'
                                }`}
                        >
                            Latest Data
                        </button>
                    </li>
                    <li className="-mb-px">
                        <button
                            onClick={() => setTab('history')}
                            className={`py-2 px-4 text-sm font-medium ${tab === 'history'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-blue-600'
                                }`}
                        >
                            Historical Data
                        </button>
                    </li>
                </ul>
            </div>

            {tab === 'latest' && data?.latestReading && (
                <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Complete Sensor Reading</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        {Object.entries(data.latestReading).map(([key, value]) => {
                            if (key !== 'device_id' && key !== 'sensor_id') {
                                return (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{key.replace(/_/g, ' ')}:</span>
                                        <span className="text-sm font-medium">
                                            {typeof value === 'boolean'
                                                ? value ? 'Yes' : 'No'
                                                : typeof value === 'number'
                                                    ? key.includes('voltage') ? value.toFixed(1)
                                                        : key.includes('current') ? value.toFixed(2)
                                                            : key.includes('power') ? value.toFixed(0)
                                                                : key.includes('energy') ? value.toFixed(3)
                                                                    : value
                                                    : value}
                                        </span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}

            {tab === 'history' && data?.data && data.data.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voltage (V)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current (A)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Power (W)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy (kWh)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pump</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.data.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                        {formatTimestamp(item.timestamp)}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{item.voltage?.toFixed(1) || 'N/A'}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{item.current?.toFixed(2) || 'N/A'}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{item.power?.toFixed(0) || 'N/A'}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{item.energy?.toFixed(3) || 'N/A'}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.pump_status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.pump_status ? 'ON' : 'OFF'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SensorDataDisplay;
