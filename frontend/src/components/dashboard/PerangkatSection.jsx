import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PerangkatSection = ({ devices, deviceStatus, isConnected, loading, error, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [filteredDevices, setFilteredDevices] = useState([]);

    // Add state for real-time sensor data
    const [sensorData, setSensorData] = useState({});
    const [dataUpdated, setDataUpdated] = useState(false);

    // Refs for animation tracking
    const updatingDevices = useRef(new Set());

    // Process devices with real-time status
    useEffect(() => {
        let result = [...(devices || [])];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(device =>
                device.device_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(device => device.status === statusFilter);
        }

        // Apply location filter
        if (locationFilter !== 'all') {
            result = result.filter(device =>
                (device.location || '').toLowerCase() === locationFilter.toLowerCase()
            );
        }

        setFilteredDevices(result);
    }, [devices, searchTerm, statusFilter, locationFilter]);

    // Extract unique locations for filtering
    const locations = Array.from(
        new Set(devices?.map(device => device.location || 'Unknown') || [])
    );

    // Calculate battery levels from power readings (simulated)
    const getBatteryLevel = (device) => {
        // Here you would use real data from your ESP32, or other devices
        // For now, we're simulating based on device_id
        if (!device) return 0;

        const deviceIdSum = device.device_id
            .split('')
            .reduce((sum, char) => sum + char.charCodeAt(0), 0);

        return Math.min(100, Math.max(5, deviceIdSum % 100));
    };

    // New function to fetch latest sensor data for a device
    const fetchLatestSensorData = async (deviceId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/esp32/data/latest?device_id=${deviceId}`);
            if (response.data && response.data.status === 'success' && response.data.data) {
                setSensorData(prevData => ({
                    ...prevData,
                    [deviceId]: response.data.data
                }));

                // Track updated devices for animation
                updatingDevices.current.add(deviceId);
                setDataUpdated(true);

                // Reset animation after delay
                setTimeout(() => {
                    updatingDevices.current.delete(deviceId);
                    if (updatingDevices.current.size === 0) {
                        setDataUpdated(false);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error(`Error fetching sensor data for ${deviceId}:`, error);
        }
    };

    // Fetch sensor data for all devices on initial load and when devices change
    useEffect(() => {
        if (devices && devices.length > 0 && isConnected) {
            devices.forEach(device => {
                fetchLatestSensorData(device.device_id);
            });
        }
    }, [devices, isConnected]);

    // Set up sensor data polling
    useEffect(() => {
        if (!isConnected) return;

        const pollingInterval = setInterval(() => {
            if (devices && devices.length > 0) {
                // Only poll for online devices to avoid unnecessary requests
                const onlineDevices = devices.filter(device => device.status === 'online');
                if (onlineDevices.length > 0) {
                    // Choose one random device to update to avoid too many requests
                    const randomIndex = Math.floor(Math.random() * onlineDevices.length);
                    fetchLatestSensorData(onlineDevices[randomIndex].device_id);
                }
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollingInterval);
    }, [devices, isConnected]);

    // Listen for Socket.IO events if available
    useEffect(() => {
        const socketIo = window.socketIo;
        if (!socketIo) return;

        // Listen for real-time sensor updates
        socketIo.on('sensor_data', (data) => {
            if (data && data.device_id) {
                setSensorData(prevData => ({
                    ...prevData,
                    [data.device_id]: data
                }));

                // Track updated devices for animation
                updatingDevices.current.add(data.device_id);
                setDataUpdated(true);

                // Reset animation after delay
                setTimeout(() => {
                    updatingDevices.current.delete(data.device_id);
                    if (updatingDevices.current.size === 0) {
                        setDataUpdated(false);
                    }
                }, 1000);
            }
        });

        return () => {
            socketIo.off('sensor_data');
        };
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 mb-4">
                <h6 className="text-white font-medium text-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10" />
                        </svg>
                        Daftar Perangkat
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`text-sm bg-white/20 rounded-full px-3 py-1 flex items-center ${isConnected ? 'text-green-100' : 'text-red-100'}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                            {isConnected ? 'Real-time Data' : 'Offline Mode'}
                        </div>
                        <button
                            onClick={onRefresh}
                            className="text-white p-2 rounded-full hover:bg-white/20 transition-all"
                            title="Refresh devices"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${dataUpdated ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </h6>
            </div>
            <div className="p-4">
                <div className="mb-4 flex flex-col md:flex-row justify-between space-y-3 md:space-y-0">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Cari perangkat..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors">
                            Cari
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="all">Semua Lokasi</option>
                            {locations.map((location, idx) => (
                                <option key={idx} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error loading devices</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!isConnected && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Tidak Terhubung ke Server</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>Status perangkat mungkin tidak akurat. Data akan diperbarui secara otomatis ketika koneksi dipulihkan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-8">
                            <svg className="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">Loading devices...</p>
                        </div>
                    ) : (
                        filteredDevices.length > 0 ? (
                            <table className="w-full min-w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Perangkat</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIR Sensor</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pump Status</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Baterai</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredDevices.map((device, index) => {
                                        const batteryLevel = getBatteryLevel(device);
                                        let batteryColorClass = 'bg-green-500';
                                        if (batteryLevel < 30) batteryColorClass = 'bg-red-500';
                                        else if (batteryLevel < 70) batteryColorClass = 'bg-amber-500';

                                        const deviceData = sensorData[device.device_id] || {};
                                        const isUpdating = updatingDevices.current.has(device.device_id);
                                        const deviceConnected = device.status === 'online';

                                        return (
                                            <tr key={index} className={`${isUpdating ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <p className="text-xs font-semibold text-gray-600">{device.device_id}</p>
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <p className="text-xs font-semibold text-gray-600">
                                                        {device.device_id.includes('ESP32') ? 'ESP32 Controller' : 'Sensor Node'}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <p className="text-xs font-semibold text-gray-600">{device.location || 'Unknown'}</p>
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <div className={`flex items-center rounded-full py-1 px-3 text-center ${deviceConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${deviceConnected ? 'bg-green-500' : 'bg-red-500'} ${deviceConnected && dataUpdated ? 'animate-pulse' : ''}`}></div>
                                                        <p className="text-xs font-semibold">
                                                            {deviceConnected ? 'Online' : 'Offline'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    {deviceConnected ? (
                                                        <div className={`flex items-center rounded-full py-1 px-3 ${deviceData.pir_status ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-600'}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${deviceData.pir_status ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                            <span className="text-xs font-medium">{deviceData.pir_status ? 'DETECTED' : 'No Motion'}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Unavailable</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    {deviceConnected ? (
                                                        <div className={`flex items-center rounded-full py-1 px-3 ${deviceData.pump_status ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-600'}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${deviceData.pump_status ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                            <span className="text-xs font-medium">{deviceData.pump_status ? 'ON' : 'OFF'}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Unavailable</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className={`h-full ${batteryColorClass} rounded-full`} style={{ width: `${batteryLevel}%` }}></div>
                                                        </div>
                                                        <span className="ml-2 text-xs font-medium text-gray-600">{batteryLevel}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <p className="text-xs text-gray-500">
                                                        {device.last_seen ? new Date(device.last_seen).toLocaleString('id-ID') : 'Unknown'}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-5 border-b border-gray-200">
                                                    <button
                                                        className={`px-3 py-1 text-xs rounded-full ${deviceConnected ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                        disabled={!deviceConnected}
                                                    >
                                                        Kontrol
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No devices found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm || statusFilter !== 'all' || locationFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Connect ESP32 devices to see them here.'}
                                </p>
                            </div>
                        )
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button className="px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all">
                        Tambah Perangkat
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Halaman 1 dari 1</span>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                            <button className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed border-r border-gray-300">
                                &lt;
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerangkatSection;
