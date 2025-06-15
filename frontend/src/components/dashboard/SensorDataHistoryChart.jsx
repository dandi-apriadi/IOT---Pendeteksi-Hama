import React, { useState, useEffect } from 'react';

/**
 * A simplified chart component for showing sensor data history
 * This version doesn't require external chart libraries
 */
const SensorDataHistoryChart = ({ deviceId = 'ESP32-PUMP-01', timeframe = '24h' }) => {
    const [loading, setLoading] = useState(false);
    const [selectedDataType, setSelectedDataType] = useState('power');

    // Data types with appropriate colors and labels
    const dataTypes = {
        voltage: { color: 'rgb(59, 130, 246)', label: 'Voltage (V)' },
        current: { color: 'rgb(139, 92, 246)', label: 'Current (A)' },
        power: { color: 'rgb(249, 115, 22)', label: 'Power (W)' },
        energy: { color: 'rgb(16, 185, 129)', label: 'Energy (Wh)' }
    };

    // Simulate loading effect
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [deviceId, timeframe]);

    // Data type selector component
    const DataTypeSelector = () => (
        <div className="flex space-x-2 mb-4">
            {Object.entries(dataTypes).map(([type, config]) => (
                <button
                    key={type}
                    className={`px-3 py-1 text-xs font-medium rounded-md ${selectedDataType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    style={{
                        backgroundColor: selectedDataType === type ? config.color : '',
                        color: selectedDataType === type ? 'white' : ''
                    }}
                    onClick={() => setSelectedDataType(type)}
                >
                    {config.label.split(' ')[0]}
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Sensor History</h3>
            <DataTypeSelector />

            <div className="h-60 border border-gray-200 rounded-lg bg-gray-50 p-4">
                {/* Simple data visualization - placeholder until chart libraries are installed */}
                <div className="h-full flex flex-col justify-center items-center text-center">
                    <p className="text-gray-500 mb-2">
                        Data visualization for {selectedDataType} from {deviceId}
                    </p>
                    <p className="text-sm text-gray-400">Timeframe: {timeframe}</p>
                    <p className="mt-4 text-blue-500 text-sm">
                        Install chart.js, react-chartjs-2, and chartjs-adapter-date-fns to enable charts
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SensorDataHistoryChart;
