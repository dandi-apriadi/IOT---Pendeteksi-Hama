import React, { useEffect, useRef } from 'react';
import { logOnce, errorOnce } from '../../utils/consoleLogger';

/**
 * Static component that displays electrical readings
 * No automatic updates - only updates when props change
 */
const ElectricalReadingsPanel = ({
    data,
    isStale,
    lastUpdate,
    isConnected,
    isOffline,
    className = ''
}) => {
    // Keep a reference to the last valid data received
    const lastValidDataRef = useRef(null);

    // Format with proper units and precision
    const formatValue = (value, unit, precision = 1) => {
        if (value === undefined || value === null) return '-';
        return `${parseFloat(value).toFixed(precision)} ${unit}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };    // Log data and update last valid reference
    useEffect(() => {
        if (data &&
            (!data.isStale && !data.offline || !lastValidDataRef.current)) {
            logOnce('ELECTRICAL_PANEL_DATA', 'ElectricalReadingsPanel received data:', data);

            // Update last valid data reference
            lastValidDataRef.current = { ...data };

            // Also save to localStorage for offline access
            try {
                localStorage.setItem('last_valid_electrical_data', JSON.stringify({
                    data: { ...data },
                    timestamp: lastUpdate || new Date().toISOString()
                }));
            } catch (err) {
                errorOnce('ELECTRICAL_PANEL_SAVE_ERROR', 'Error saving data to localStorage:', err);
            }
        }
    }, [data, lastUpdate]);

    // Try to load data from localStorage on component mount if no data provided
    useEffect(() => {
        if (!data && !lastValidDataRef.current) {
            try {
                const savedData = localStorage.getItem('last_valid_electrical_data');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    logOnce('ELECTRICAL_PANEL_CACHED', 'Loaded cached electrical data from localStorage:', parsedData);
                    lastValidDataRef.current = parsedData.data;
                }
            } catch (err) {
                errorOnce('ELECTRICAL_PANEL_LOAD_ERROR', 'Error loading data from localStorage:', err);
            }
        }
    }, [data]);

    // Show different UI states based on connection
    if (!data && !lastValidDataRef.current) {
        // No data available, not even from cache
        return (
            <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
                <div className="text-center p-8">
                    <p className="text-gray-500">No electrical data available</p>
                </div>
            </div>
        );
    }

    // Use either current data or cached data from ref
    const displayData = data || lastValidDataRef.current;
    const isUsingCachedData = !data && lastValidDataRef.current;

    return (
        <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Electrical Readings</h3>
                <div className="flex items-center">
                    {(isStale || isUsingCachedData || isOffline) && (
                        <span className="mr-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">
                            {isOffline ? 'Offline Mode' : 'Stale Data'}
                        </span>
                    )}
                    <span className="text-xs text-gray-500">
                        Updated: {formatTimestamp(lastUpdate)}
                    </span>
                </div>
            </div>

            {/* Measurement cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Voltage</div>
                    <div className={`text-xl font-semibold ${isOffline ? 'text-gray-400' : 'text-blue-600'}`}>
                        {formatValue(displayData.voltage, 'V', 0)}
                    </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Current</div>
                    <div className={`text-xl font-semibold ${isOffline ? 'text-gray-400' : 'text-purple-600'}`}>
                        {formatValue(displayData.current, 'A', 1)}
                    </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Power</div>
                    <div className={`text-xl font-semibold ${isOffline ? 'text-gray-400' : 'text-orange-600'}`}>
                        {formatValue(displayData.power, 'W', 0)}
                    </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Energy</div>
                    <div className={`text-xl font-semibold ${isOffline ? 'text-gray-400' : 'text-green-600'}`}>
                        {formatValue(displayData.energy, 'Wh', 3)}
                    </div>
                </div>
            </div>

            {/* Status indicators */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">PIR Status</div>
                        <div className={`h-3 w-3 rounded-full ${displayData.pir_status ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="text-sm font-medium mt-1">
                        {displayData.pir_status ? 'Motion Detected' : 'No Motion'}
                    </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">Pump Status</div>
                        <div className={`h-3 w-3 rounded-full ${displayData.pump_status ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="text-sm font-medium mt-1">
                        {displayData.pump_status ? 'Active' : 'Inactive'}
                    </div>
                </div>
            </div>

            {/* Offline warning */}
            {isOffline && (
                <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-700">
                        <span className="font-medium">Offline Mode:</span> Showing last known values. Some data may be out of date.
                    </p>
                </div>
            )}

            {/* Device offline warning (different from browser being offline) */}
            {!isConnected && !isOffline && (
                <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-700">
                        Device is offline. Data may be outdated.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ElectricalReadingsPanel;
