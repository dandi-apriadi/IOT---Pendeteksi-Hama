import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import SensorChart from "./SensorChart";
import RealtimeClock from "./RealtimeClock";
import SensorDataTable from './SensorDataTable';
import './realtime.css'; // Import real-time CSS animations

// Create a memoized version of the status indicator
const StatusIndicator = memo(({ isConnected }) => (
    <div className={`w-3 h-3 rounded-full mr-3 status-indicator ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
));
StatusIndicator.displayName = 'StatusIndicator';

// Create a memoized card value component
const SensorValue = memo(({ value, unit = '', className = '' }) => (
    <p className={`text-3xl font-bold text-gray-800 changing-value ${className}`}>
        {value} {unit}
    </p>
));
SensorValue.displayName = 'SensorValue';

// Memoized card component
const SensorCard = memo(({ title, value, unit, percentage, color, icon, isConnected, loading, maxValue, offset = 0, isHighlighted = false }) => {
    // Local ref to track previous value for color transitions
    const prevValueRef = useRef(value);
    const [highlight, setHighlight] = useState(false);

    // Calculate percentage for bar
    const calculatedPercentage = Math.min(100, Math.max(0, ((value || 0) - offset) / (maxValue - offset) * 100));

    // Update highlight when value changes significantly
    useEffect(() => {
        if (Math.abs((value - prevValueRef.current) / Math.max(0.1, prevValueRef.current)) > 0.05 || isHighlighted) {
            setHighlight(true);
            const timer = setTimeout(() => {
                setHighlight(false);
                prevValueRef.current = value;
            }, 1000);
            return () => clearTimeout(timer);
        }
        prevValueRef.current = value;
    }, [value, isHighlighted]);

    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden relative sensor-card ${highlight ? 'highlight-update updated' : ''} transition-all duration-300`}>
            {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-${color}-500`}></div>
                </div>
            )}
            <div className={`bg-${color}-500 p-4 flex justify-between items-center`}>
                <h6 className="text-white font-medium text-lg flex items-center">
                    {icon}
                    {title}
                </h6>
                {isConnected && (
                    <span className="text-xs bg-white text-purple-700 px-2 py-0.5 rounded-full flex items-center">
                        Live
                        {highlight && <span className="ml-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>}
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <SensorValue
                            value={loading ? "..." : value.toFixed(unit === 'V' || unit === 'A' ? 2 : 0)}
                            unit={unit}
                            className={highlight ? 'text-green-600' : ''}
                        />
                        <p className="text-sm text-gray-500">{title} saat ini</p>
                    </div>
                    <div className={`h-16 w-16 bg-${color}-100 rounded-full flex items-center justify-center ${highlight ? 'animate-pulse' : ''}`}>
                        <span className={`text-${color}-600 text-xs font-medium`}>
                            {percentage}
                        </span>
                    </div>
                </div>
                <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                    <div
                        className={`h-2 bg-${color}-500 rounded-full`}
                        style={{
                            width: `${calculatedPercentage}%`,
                            transition: 'width 0.5s ease-in-out'
                        }}
                    ></div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{title === 'Tegangan' ? 'Optimal: 220-240V' : `Maksimum: ${maxValue} ${unit}`}</span>
                    <span>{Math.round(calculatedPercentage)}%</span>
                </div>
            </div>
        </div>
    );
});
SensorCard.displayName = 'SensorCard';

const IkhtisarSection = ({
    error,
    cacheStatus,
    CACHE_DURATION,
    forceRefresh,
    clearCache,
    electricalData,
    loading,
    sensorHistory,
    handleTimeframeChange,
    lastUpdate,
    isConnected,
    sensorData,
    sendCommand,
    devices
}) => {
    const lastElectricalDataRef = useRef(electricalData);
    const [dataUpdateVisible, setDataUpdateVisible] = useState(false);
    const updateIndicatorTimerRef = useRef(null);
    const [dataUpdateAnimation, setDataUpdateAnimation] = useState(false);
    const [highlightedData, setHighlightedData] = useState({
        voltage: false,
        current: false,
        power: false,
        energy: false
    });

    // Show update indicator when data changes significantly
    useEffect(() => {
        // Only trigger for significant changes to avoid constant animations
        const hasSignificantChange =
            Math.abs((electricalData.voltage - lastElectricalDataRef.current.voltage) / lastElectricalDataRef.current.voltage) > 0.02 ||
            Math.abs((electricalData.current - lastElectricalDataRef.current.current) / Math.max(0.1, lastElectricalDataRef.current.current)) > 0.05 ||
            Math.abs((electricalData.power - lastElectricalDataRef.current.power) / Math.max(10, lastElectricalDataRef.current.power)) > 0.05;

        if (hasSignificantChange && !loading) {
            lastElectricalDataRef.current = { ...electricalData };

            // Clear existing timer
            if (updateIndicatorTimerRef.current) {
                clearTimeout(updateIndicatorTimerRef.current);
            }

            // Show indicator
            setDataUpdateVisible(true);
            setDataUpdateAnimation(true);

            // Hide after 2 seconds
            updateIndicatorTimerRef.current = setTimeout(() => {
                setDataUpdateVisible(false);
                setDataUpdateAnimation(false);
            }, 2000);
        }

        return () => {
            if (updateIndicatorTimerRef.current) {
                clearTimeout(updateIndicatorTimerRef.current);
            }
        };
    }, [electricalData, loading]);

    // Refresh data without causing UI blink
    const handleRefresh = () => {
        if (!loading) {
            setDataUpdateAnimation(true);
            forceRefresh();
            setTimeout(() => {
                setDataUpdateAnimation(false);
            }, 2000);
        }
    };

    // Format percentage values for display
    const formatPercentageDiff = (value, baseline) => {
        const diff = (((value || baseline) - baseline) / baseline * 100).toFixed(1);
        return `${value > baseline ? '+' : '-'}${Math.abs(diff)}%`;
    };

    // Add a proper initial data check with fallbacks
    const electricalDataWithFallbacks = useMemo(() => {
        if (!electricalData) {
            return {
                voltage: 0,
                current: 0,
                power: 0,
                energy: 0,
                isStale: true
            };
        }
        return electricalData;
    }, [electricalData]);

    // Track changes in electrical data to highlight changes
    useEffect(() => {
        if (!electricalData || !lastElectricalValues.current) return;

        const newHighlights = {
            voltage: Math.abs((electricalData.voltage || 0) - (lastElectricalValues.current.voltage || 0)) > 1,
            current: Math.abs((electricalData.current || 0) - (lastElectricalValues.current.current || 0)) > 0.1,
            power: Math.abs((electricalData.power || 0) - (lastElectricalValues.current.power || 0)) > 5,
            energy: Math.abs((electricalData.energy || 0) - (lastElectricalValues.current.energy || 0)) > 1
        };

        setHighlightedData(newHighlights);

        lastElectricalValues.current = {
            voltage: electricalData.voltage || 0,
            current: electricalData.current || 0,
            power: electricalData.power || 0,
            energy: electricalData.energy || 0
        };

        const timer = setTimeout(() => {
            setHighlightedData({
                voltage: false,
                current: false,
                power: false,
                energy: false
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [electricalData]);

    // Connection health monitoring
    const [connectionHealthy, setConnectionHealthy] = useState(true);
    const [lastDataCheck, setLastDataCheck] = useState(new Date());
    const lastDataAgeMsRef = useRef(0);
    const lastElectricalValues = useRef({
        voltage: 0,
        current: 0,
        power: 0,
        energy: 0
    });

    // Monitor data freshness
    useEffect(() => {
        if (lastUpdate) {
            const now = new Date();
            const lastUpdateTime = new Date(lastUpdate);
            const dataAge = now - lastUpdateTime;
            lastDataAgeMsRef.current = dataAge;

            setLastDataCheck(now);
            setConnectionHealthy(dataAge < 30000);
        }

        const healthCheckInterval = setInterval(() => {
            const now = new Date();
            const lastUpdateTime = lastUpdate ? new Date(lastUpdate) : null;

            if (lastUpdateTime) {
                const dataAge = now - lastUpdateTime;
                lastDataAgeMsRef.current = dataAge;
                setConnectionHealthy(dataAge < 30000);
            } else {
                setConnectionHealthy(false);
            }

            setLastDataCheck(now);
        }, 2000);

        return () => clearInterval(healthCheckInterval);
    }, [lastUpdate]);

    return (
        <>
            {/* Error/Warning Notifications */}
            {error && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Status Koneksi ESP32
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>{error}</p>
                                <p className="mt-1">
                                    Sistem menggunakan data simulasi untuk demonstrasi.
                                    Data akan diperbarui otomatis ketika koneksi dipulihkan.
                                </p>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    onClick={forceRefresh}
                                    className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md hover:bg-yellow-200 transition-colors"
                                >
                                    Coba Lagi
                                </button>
                                <button
                                    onClick={clearCache}
                                    className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md hover:bg-yellow-200 transition-colors"
                                >
                                    Reset Cache
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Real-time Data Status Indicator */}
            <div className="mb-6 bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 status-indicator 
                                ${isConnected && connectionHealthy ? 'bg-green-500 animate-pulse' :
                                    isConnected ? 'bg-yellow-500' : 'bg-red-500'}`}
                            ></div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-800 flex items-center">
                                    Real-time Dashboard
                                    <RealtimeClock className="ml-3 text-blue-600 text-xs" />
                                    {connectionHealthy && isConnected && (
                                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                            Live Data {lastDataAgeMsRef.current < 5000 && <span className="animate-pulse">●</span>}
                                        </span>
                                    )}
                                    {!connectionHealthy && isConnected && (
                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                                            Stale Data
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    {isConnected && connectionHealthy
                                        ? `Data sensor diperbarui secara real-time. Pembaruan terakhir: ${lastUpdate ? new Date(lastUpdate).toLocaleTimeString('id-ID') : '-'}`
                                        : isConnected
                                            ? `Terhubung ke server tapi data tidak diperbarui selama ${Math.floor(lastDataAgeMsRef.current / 1000)} detik. Coba refresh data.`
                                            : 'Koneksi terputus. Menggunakan data cache.'}
                                </p>
                            </div>
                        </div>

                        {/* Update indicator */}
                        <div className={`data-update-indicator ${dataUpdateVisible ? 'visible' : ''} mr-4 px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full flex items-center`}>
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
                            Data diperbarui
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    } transition-colors`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin h-3 w-3 border-2 border-blue-700 rounded-full border-t-transparent mr-2"></div>
                                        Memuat...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh Data
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => sendCommand('ESP32-PUMP-01', 'check_status', null)}
                                disabled={!isConnected || loading}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center 
                                    ${!isConnected || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-green-100 text-green-700 hover:bg-green-200'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Check Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data freshness indicator */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                            <span>
                                Server: {isConnected ? (
                                    <span className="text-green-600 font-medium">Terhubung</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Terputus</span>
                                )}
                            </span>
                            <span className="mx-2">|</span>
                            <span>
                                ESP32: {connectionHealthy ? (
                                    <span className="text-green-600 font-medium flex items-center">
                                        Data Real-time
                                        <span className="ml-1 inline-block h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    </span>
                                ) : sensorData ? (
                                    <span className="text-yellow-600 font-medium">
                                        Data {Math.floor(lastDataAgeMsRef.current / 1000)}s lalu
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-medium">Tidak Ada Data</span>
                                )}
                            </span>
                        </div>

                        <span className="text-xs text-gray-500">
                            Last check: {lastDataCheck.toLocaleTimeString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Device Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Voltage Card */}
                <SensorCard
                    title="Tegangan"
                    value={electricalData?.voltage || 0}
                    unit="V"
                    percentage={formatPercentageDiff(electricalData?.voltage, 220)}
                    color="purple"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    }
                    isConnected={isConnected && connectionHealthy}
                    loading={loading}
                    maxValue={250}
                    offset={200}
                    isHighlighted={highlightedData.voltage}
                />

                {/* Current Card */}
                <SensorCard
                    title="Arus"
                    value={electricalData?.current || 0}
                    unit="A"
                    percentage={formatPercentageDiff(electricalData?.current, 5.0)}
                    color="blue"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    }
                    isConnected={isConnected && connectionHealthy}
                    loading={loading}
                    maxValue={8.5}
                    isHighlighted={highlightedData.current}
                />

                {/* Energy Card */}
                <SensorCard
                    title="Energi/Perjam"
                    value={electricalData?.energy || 0}
                    unit="Wh"
                    percentage={formatPercentageDiff(electricalData?.energy, 1080)}
                    color="green"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    }
                    isConnected={isConnected && connectionHealthy}
                    loading={loading}
                    maxValue={2400}
                    isHighlighted={highlightedData.energy}
                />

                {/* Power Card */}
                <SensorCard
                    title="Daya"
                    value={electricalData?.power || 0}
                    unit="W"
                    percentage={formatPercentageDiff(electricalData?.power, 1144)}
                    color="orange"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    }
                    isConnected={isConnected && connectionHealthy}
                    loading={loading}
                    maxValue={1500}
                    isHighlighted={highlightedData.power}
                />
            </div>

            {/* Charts Row and Control Panel */}
            <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                {/* Power Monitoring Chart */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-blue-500 p-4 mb-4">
                        <h6 className="text-white font-medium text-lg flex items-center justify-between">
                            <span className="flex items-center">
                                Monitoring Listrik
                                {/* Connection Status Indicator */}
                                <div className="ml-3 flex items-center">
                                    <div className={`h-2 w-2 rounded-full mr-1 ${error ? 'bg-red-400' : loading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                    <span className="text-xs text-white/80">
                                        {error ? 'Terputus' : loading ? 'Menghubungkan...' : 'Terhubung'}
                                    </span>
                                </div>
                            </span>
                            <div className="flex items-center space-x-2">
                                <select
                                    className="text-xs bg-white/20 text-white rounded-md border-0 px-2 py-1 outline-none focus:ring-1 focus:ring-white"
                                    onChange={(e) => handleTimeframeChange(e.target.value)}
                                >
                                    <option value="24h" className="text-gray-800">24 Jam</option>
                                    <option value="7d" className="text-gray-800">7 Hari</option>
                                    <option value="30d" className="text-gray-800">30 Hari</option>
                                </select>
                            </div>
                        </h6>
                    </div>
                    <div className="p-4">
                        <div className="mb-3 flex space-x-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-200">
                                Semua Data
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200">
                                Tegangan
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200">
                                Arus
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200">
                                Daya
                            </button>
                        </div>
                        <div className="h-[300px]">
                            {error ? (
                                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-gray-500 text-sm">Gagal memuat data monitoring</p>
                                        <p className="text-gray-400 text-xs mt-1">Periksa koneksi server atau coba lagi</p>
                                    </div>
                                </div>
                            ) : (
                                <SensorChart
                                    electricalData={electricalData}
                                    loading={loading}
                                    sensorHistory={sensorHistory || []}
                                    onTimeframeChange={handleTimeframeChange}
                                    stableRendering={true}
                                />
                            )}
                        </div>
                        <div className="mt-3 flex justify-between text-xs text-gray-500">
                            <div className="flex space-x-4">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
                                    <span>Tegangan: {loading ? "..." : `${electricalData?.voltage?.toFixed(1) || 0}V`}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                                    <span>Arus: {loading ? "..." : `${electricalData?.current?.toFixed(2) || 0}A`}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                                    <span>Daya: {loading ? "..." : `${electricalData?.power?.toFixed(0) || 0}W`}</span>
                                </div>
                            </div>
                            <span>
                                {loading ? "Memuat..." :
                                    lastUpdate ? `Update: ${new Date(lastUpdate).toLocaleTimeString('id-ID')}` :
                                        "Terakhir update: -"
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pump Status and Control - Combined with PIR sensor status */}
                <div className={`bg-white rounded-xl shadow-md overflow-hidden ${dataUpdateAnimation ? 'animate-pulse-once' : ''}`}>
                    <div className="bg-green-500 p-4 mb-4 flex justify-between items-center">
                        <h6 className="text-white font-medium text-lg">Status & Kendali</h6>
                        {isConnected && (
                            <div className="flex items-center text-white text-xs">
                                <div className={`h-2 w-2 rounded-full ${connectionHealthy ? 'bg-white animate-pulse' : 'bg-yellow-200'} mr-2`}></div>
                                <span className="bg-white/20 rounded px-2 py-0.5">
                                    {connectionHealthy ? 'Live' : 'Stale'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="flex flex-col space-y-4">
                            {/* Pump status indicator with real-time visual */}
                            <div className={`flex items-center justify-between p-4 border ${sensorData?.pump_status ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} rounded-lg`}>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Status Pompa</p>
                                    <p className="text-xs text-gray-500">
                                        {sensorData?.pump_status
                                            ? 'Pompa sedang bekerja'
                                            : 'Pompa tidak aktif'}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-full flex items-center ${sensorData?.pump_status
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'}`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${sensorData?.pump_status ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {sensorData?.pump_status ? 'AKTIF' : 'NONAKTIF'}
                                    </p>
                                </div>
                            </div>

                            {/* Auto mode status with improved indicator */}
                            <div className={`flex items-center justify-between p-4 border ${sensorData?.auto_mode ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} rounded-lg`}>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Mode</p>
                                    <p className="text-xs text-gray-500">
                                        {sensorData?.auto_mode
                                            ? 'Pompa beroperasi secara otomatis'
                                            : 'Pompa memerlukan kontrol manual'}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-full ${sensorData?.auto_mode
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-amber-100 text-amber-800'}`}>
                                    <p className="text-sm font-medium">{sensorData?.auto_mode ? 'OTOMATIS' : 'MANUAL'}</p>
                                </div>
                            </div>

                            {/* PIR sensor status with visual indicators */}
                            <div className={`flex items-center justify-between p-4 border ${sensorData?.pir_status ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'} rounded-lg`}>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Deteksi Gerakan</p>
                                    <p className="text-xs text-gray-500">
                                        {sensorData?.pir_status
                                            ? 'Sensor PIR mendeteksi gerakan'
                                            : 'Tidak ada gerakan terdeteksi'}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-full flex items-center ${sensorData?.pir_status
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'}`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${sensorData?.pir_status ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {sensorData?.pir_status ? 'TERDETEKSI' : 'TIDAK ADA'}
                                    </p>
                                </div>
                            </div>

                            {/* Control buttons */}
                            {isConnected && (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button
                                        onClick={() => sendCommand('ESP32-PUMP-01', 'activate_pump', null)}
                                        className={`px-4 py-2 ${sensorData?.pump_status
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'} rounded-md text-sm flex justify-center items-center`}
                                        disabled={loading || sensorData?.pump_status}
                                    >
                                        {sensorData?.pump_status ? (
                                            <>
                                                <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-2"></span>
                                                Pompa Aktif
                                            </>
                                        ) : (
                                            'Aktifkan Pompa'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => sendCommand('ESP32-PUMP-01', 'deactivate_pump', null)}
                                        className={`px-4 py-2 ${!sensorData?.pump_status
                                            ? 'bg-gray-300 text-gray-600'
                                            : 'bg-red-500 text-white hover:bg-red-600'} rounded-md text-sm`}
                                        disabled={loading || !sensorData?.pump_status}
                                    >
                                        {!sensorData?.pump_status ? 'Pompa Nonaktif' : 'Matikan Pompa'}
                                    </button>
                                    <button
                                        onClick={() => sendCommand('ESP32-PUMP-01', 'toggle_mode', null)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm col-span-2"
                                        disabled={loading}
                                    >
                                        Ubah Mode: {sensorData?.auto_mode ? 'Auto → Manual' : 'Manual → Auto'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Data timestamp footer */}
                    {lastUpdate && (
                        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Last data update:</span>
                                <span className="text-xs font-medium">{new Date(lastUpdate).toLocaleTimeString('id-ID')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent data table */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                        Riwayat Data Sensor
                    </h3>
                    <div className="space-x-2">
                        {['1h', '6h', '12h', '24h'].map(timeframe => (
                            <button
                                key={timeframe}
                                onClick={() => handleTimeframeChange(timeframe)}
                                className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded hover:bg-blue-500 hover:text-white transition-colors"
                            >
                                {timeframe}
                            </button>
                        ))}
                    </div>
                </div>

                <SensorDataTable
                    data={sensorHistory}
                    isLoading={loading}
                    maxRows={10}
                />
            </div>
        </>
    );
};

export default IkhtisarSection;
