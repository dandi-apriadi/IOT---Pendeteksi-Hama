import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errorOnce } from '../../utils/consoleLogger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DeviceStatusDisplay = ({ deviceId = 'ESP32-PUMP-01', refreshInterval = 5000 }) => {
    const [deviceStatus, setDeviceStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Format time nicely
    const formatTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString();
        } catch (error) {
            return 'Invalid time';
        }
    };

    // Calculate time since last activity
    const getTimeSince = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffSeconds = Math.floor((now - date) / 1000);

            if (diffSeconds < 60) return `${diffSeconds}s ago`;
            if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
            if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
            return `${Math.floor(diffSeconds / 86400)}d ago`;
        } catch (error) {
            return 'N/A';
        }
    };

    // Fetch device status
    const fetchDeviceStatus = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/esp32/devices`);
            if (response.data && response.data.status === 'success') {
                // Find our specific device
                const deviceData = response.data.data.find(d => d.device_id === deviceId);
                if (deviceData) {
                    setDeviceStatus(deviceData);
                    setError(null);
                } else {
                    setError(`Device ${deviceId} not found`);
                }
            } else {
                setError('Failed to fetch device status');
            }
            setLastUpdate(new Date());
        } catch (err) {
            errorOnce('DEVICE_STATUS_ERROR', 'Error fetching device status:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and set interval
    useEffect(() => {
        fetchDeviceStatus();

        const intervalId = setInterval(() => {
            fetchDeviceStatus();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [deviceId, refreshInterval]);

    const isOnline = deviceStatus?.status === 'online';

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Device Status</h3>
                <div className="text-xs text-gray-500">
                    Updated: {formatTime(lastUpdate)}
                </div>
            </div>

            {loading && !deviceStatus && (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
            )}

            {error && !deviceStatus && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    Error: {error}
                    <button
                        className="ml-2 underline text-blue-600"
                        onClick={fetchDeviceStatus}>
                        Retry
                    </button>
                </div>
            )}

            {deviceStatus && (
                <div className={`rounded-lg border p-4 ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                                {deviceId}
                            </span>
                        </div>
                        <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'} font-medium`}>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="ml-2 font-medium">{deviceStatus.location || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Last Seen:</span>
                            <span className="ml-2 font-medium">{getTimeSince(deviceStatus.last_seen)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Connection:</span>
                            <span className="ml-2 font-medium">{deviceStatus.connection_type || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">DB Status:</span>
                            <span className="ml-2 font-medium">{deviceStatus.database_status || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceStatusDisplay;
