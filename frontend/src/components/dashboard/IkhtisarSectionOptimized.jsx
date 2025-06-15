import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import axios from "axios";
import SensorChart from "./SensorChart";
import SensorDataTable from './SensorDataTable';
import EnergyTrendsChart from './EnergyTrendsChart'; // New component for energy trends
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Optimized Ikhtisar Section with enhanced design and energy trends
const IkhtisarSection = ({
    error,
    loading,
    sensorHistory,
    handleTimeframeChange,
    lastUpdate,
    isConnected,
    sensorData,
    sendCommand,
    devices,
    forceRefresh,
    clearCache,
    cacheStatus,
    CACHE_DURATION,
    isOffline,
    onRetryConnection
}) => {
    const [timeframe, setTimeframe] = useState('24h');
    const [energyTrends, setEnergyTrends] = useState([]);
    const [energyLoading, setEnergyLoading] = useState(false);
    const [energyError, setEnergyError] = useState(null);
    const [energyTimeframe, setEnergyTimeframe] = useState('24h');
    const [activeDevice, setActiveDevice] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState(null);

    // Fetch energy trends data
    const fetchEnergyTrends = async (deviceId, timeframe) => {
        if (!deviceId) return;

        setEnergyLoading(true);
        setEnergyError(null);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/esp32/energy-trends/${deviceId}?timeframe=${timeframe}`
            );

            if (response.data && response.data.status === 'success') {
                const data = response.data.data || [];
                setEnergyTrends(data);

                // Process data for chart display
                const formattedData = data.map(item => ({
                    time: new Date(item.period_start).toLocaleTimeString(),
                    voltage: item.avg_voltage,
                    current: item.avg_current,
                    power: item.avg_power,
                    energy: item.total_energy
                }));

                setChartData(formattedData);
                console.log("Chart data loaded:", formattedData.length, "points");
            } else {
                setEnergyError('Failed to load energy trends data');
            }
        } catch (error) {
            setEnergyError(error.message || 'Error loading energy trends');
            console.error('Error fetching energy trends:', error);
        } finally {
            setEnergyLoading(false);
        }
    };

    // Fetch chart data separately for more granular control
    const fetchChartData = async (deviceId, timeframe) => {
        if (!deviceId) return;

        setChartLoading(true);
        setChartError(null);

        try {
            // Different endpoint optimized for chart display
            const response = await axios.get(
                `${API_BASE_URL}/esp32/data/history/${deviceId}?timeframe=${timeframe}&format=aggregated`
            );

            if (response.data && response.data.status === 'success') {
                const data = response.data.data || [];

                // Format data for charting
                const formattedData = data.map(item => ({
                    time: new Date(item.timestamp || item.time_interval).toLocaleTimeString(),
                    voltage: parseFloat(item.voltage || 0).toFixed(1),
                    current: parseFloat(item.current || 0).toFixed(2),
                    power: parseFloat(item.power || 0).toFixed(1),
                    // Add additional metrics as needed
                    pir_status: item.pir_status ? 1 : 0  // Convert boolean to number for charting
                }));

                setChartData(formattedData);
            } else {
                setChartError('Failed to load chart data');
            }
        } catch (error) {
            setChartError(error.message || 'Error loading chart data');
            console.error('Error fetching chart data:', error);
        } finally {
            setChartLoading(false);
        }
    };

    // Set active device when devices list changes
    useEffect(() => {
        if (devices && devices.length > 0 && !activeDevice) {
            const esp32Device = devices.find(d => d.device_id?.includes('ESP32'));
            if (esp32Device) {
                setActiveDevice(esp32Device.device_id);
                fetchEnergyTrends(esp32Device.device_id, energyTimeframe);
                fetchChartData(esp32Device.device_id, timeframe);
            }
        }
    }, [devices]);

    // Handle timeframe change
    const handleTimeframeSelect = (tf) => {
        setTimeframe(tf);
        handleTimeframeChange(tf);

        // Also update chart data when timeframe changes
        if (activeDevice) {
            fetchChartData(activeDevice, tf);
        }
    };

    // Handle energy timeframe change
    const handleEnergyTimeframeSelect = (tf) => {
        setEnergyTimeframe(tf);
        fetchEnergyTrends(activeDevice, tf);
    };

    // Handle device change
    const handleDeviceChange = (e) => {
        const deviceId = e.target.value;
        setActiveDevice(deviceId);
        fetchEnergyTrends(deviceId, energyTimeframe);
        fetchChartData(deviceId, timeframe);
    };

    // Sample aggregated energy data for today (will be replaced with real data)
    const todayEnergyData = useMemo(() => {
        if (!energyTrends || energyTrends.length === 0) {
            return { voltage: 0, current: 0, power: 0, energy: 0 };
        }

        // Calculate averages from the energy trends data
        const latest = energyTrends[energyTrends.length - 1];
        const voltage = latest?.avg_voltage || 0;
        const current = latest?.avg_current || 0;
        const power = latest?.avg_power || 0;
        const energy = latest?.total_energy || 0;

        return { voltage, current, power, energy };
    }, [energyTrends]);

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Status cards - New section with better design */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-5">
                    <div className="text-xs text-blue-100 mb-1 font-medium uppercase">Voltage</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl text-white font-bold">{todayEnergyData.voltage.toFixed(1)}</span>
                        <span className="ml-1 text-blue-100">V</span>
                    </div>
                    <div className="mt-3 text-xs text-blue-100">Average voltage reading</div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-5">
                    <div className="text-xs text-green-100 mb-1 font-medium uppercase">Current</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl text-white font-bold">{todayEnergyData.current.toFixed(2)}</span>
                        <span className="ml-1 text-green-100">A</span>
                    </div>
                    <div className="mt-3 text-xs text-green-100">Average current reading</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-5">
                    <div className="text-xs text-purple-100 mb-1 font-medium uppercase">Power</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl text-white font-bold">{todayEnergyData.power.toFixed(1)}</span>
                        <span className="ml-1 text-purple-100">W</span>
                    </div>
                    <div className="mt-3 text-xs text-purple-100">Average power consumption</div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-5">
                    <div className="text-xs text-amber-100 mb-1 font-medium uppercase">Energy</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl text-white font-bold">{todayEnergyData.energy.toFixed(2)}</span>
                        <span className="ml-1 text-amber-100">Wh</span>
                    </div>
                    <div className="mt-3 text-xs text-amber-100">Total energy consumption</div>
                </div>
            </div>

            {/* Error and offline notifications - REMOVING CONNECTION ERROR MESSAGE */}


            {isOffline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938-9H18a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h3.5z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Offline Mode</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>You are currently viewing cached data. Some features may be limited.</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={onRetryConnection}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Energy Trends Chart - NEW SECTION */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Energy Consumption Trends</h3>
                        <p className="text-sm text-gray-500 mt-1">Monitor power usage over time</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
                        {/* Device selector */}
                        <select
                            value={activeDevice || ''}
                            onChange={handleDeviceChange}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select Device</option>
                            {devices && devices.map(device => (
                                <option key={device.device_id} value={device.device_id}>
                                    {device.device_id}
                                </option>
                            ))}
                        </select>

                        {/* Timeframe selector with better design */}
                        <div className="flex rounded-md overflow-hidden shadow-sm border border-gray-200">
                            {['6h', '24h', '7d', '30d'].map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => handleEnergyTimeframeSelect(tf)}
                                    className={`px-3 py-1.5 text-xs font-medium ${energyTimeframe === tf
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-r border-gray-200'}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    {energyLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : energyError ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <p className="text-red-500 mb-2">{energyError}</p>
                                <button
                                    onClick={() => fetchEnergyTrends(activeDevice, energyTimeframe)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : energyTrends.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No energy data available
                        </div>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={energyTrends}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis
                                        dataKey="period_start"
                                        tickFormatter={(time) => {
                                            const date = new Date(time);
                                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        }}
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                    />
                                    <YAxis yAxisId="left" stroke="#6366F1" fontSize={12} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '6px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value, name) => {
                                            if (name === 'avg_power') return [`${value.toFixed(2)} W`, 'Power'];
                                            if (name === 'avg_voltage') return [`${value.toFixed(1)} V`, 'Voltage'];
                                            if (name === 'avg_current') return [`${value.toFixed(3)} A`, 'Current'];
                                            return [value, name];
                                        }}
                                        labelFormatter={(label) => {
                                            return new Date(label).toLocaleString();
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="avg_power"
                                        stroke="#6366F1"
                                        strokeWidth={2}
                                        name="Power (W)"
                                        dot={false}
                                        activeDot={{ r: 4, stroke: '#4F46E5', strokeWidth: 1, fill: '#6366F1' }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="avg_voltage"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Voltage (V)"
                                        dot={false}
                                        activeDot={{ r: 4, stroke: '#059669', strokeWidth: 1, fill: '#10B981' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Chart Section with Sensor Data */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Sensor Data Chart</h3>
                        <p className="text-sm text-gray-500 mt-1">Visualization of sensor readings</p>
                    </div>
                    <div className="flex rounded-md overflow-hidden shadow-sm border border-gray-200">
                        {['1h', '6h', '12h', '24h', '7d'].map(tf => (
                            <button
                                key={tf}
                                onClick={() => handleTimeframeSelect(tf)}
                                className={`px-3 py-1.5 text-xs font-medium ${timeframe === tf
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-r border-gray-200'}`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5">
                    {chartLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : chartError ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <p className="text-red-500 mb-2">{chartError}</p>
                                <button
                                    onClick={() => fetchChartData(activeDevice, timeframe)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No chart data available
                        </div>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis yAxisId="left" stroke="#6366F1" fontSize={12} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#EF4444" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '6px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value, name) => {
                                            if (name === 'voltage') return [`${value} V`, 'Voltage'];
                                            if (name === 'power') return [`${value} W`, 'Power'];
                                            if (name === 'pir_status') return [`${value === 1 ? 'Active' : 'Inactive'}`, 'Motion'];
                                            return [value, name];
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="voltage"
                                        stroke="#6366F1"
                                        strokeWidth={2}
                                        name="Voltage (V)"
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="power"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Power (W)"
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="step"
                                        dataKey="pir_status"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        name="Motion"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Sensor Data History with improved design */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Sensor Data History</h3>
                        <p className="text-sm text-gray-500 mt-1">Historical sensor readings over time</p>
                    </div>
                </div>
                <div className="p-5">
                    <SensorChart
                        sensorHistory={sensorHistory}
                        isLoading={loading}
                        timeframe={timeframe}
                    />
                </div>
            </div>

            {/* Recent data section with improved design */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Sensor Readings</h3>
                    <p className="text-sm text-gray-500 mt-1">Latest data points received from sensors</p>
                </div>
                <div>
                    <SensorDataTable
                        data={sensorHistory}
                        isLoading={loading}
                        maxRows={10}
                    />
                </div>
            </div>

            {/* Device control with improved design */}
            {isConnected && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-lg font-semibold text-gray-800">Device Controls</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage your connected devices</p>
                    </div>
                    <div className="p-5">
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => sendCommand('pump_on')}
                                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-sm flex items-center"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Turn Pump ON
                            </button>
                            <button
                                onClick={() => sendCommand('pump_off')}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm flex items-center"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Turn Pump OFF
                            </button>
                            <button
                                onClick={() => sendCommand('auto_mode')}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Auto Mode
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cache Status Info with improved design */}
            {cacheStatus && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-lg font-semibold text-gray-800">Cache Status</h3>
                        <p className="text-sm text-gray-500 mt-1">System performance metrics</p>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                <div className="text-xs text-blue-600 font-medium uppercase mb-1">Total Requests</div>
                                <div className="text-2xl font-bold text-blue-800">{cacheStatus.totalRequests || 0}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                                <div className="text-xs text-green-600 font-medium uppercase mb-1">Cached Requests</div>
                                <div className="text-2xl font-bold text-green-800">{cacheStatus.cachedRequests || 0}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                <div className="text-xs text-red-600 font-medium uppercase mb-1">Rate Limited</div>
                                <div className="text-2xl font-bold text-red-800">{cacheStatus.rateLimitedRequests || 0}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                <div className="text-xs text-purple-600 font-medium uppercase mb-1">Cache Duration</div>
                                <div className="text-2xl font-bold text-purple-800">{CACHE_DURATION / 1000}s</div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => clearCache()}
                                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                Clear Cache
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IkhtisarSection;
