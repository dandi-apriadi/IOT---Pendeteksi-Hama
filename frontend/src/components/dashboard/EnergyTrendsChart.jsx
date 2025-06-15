import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EnergyTrendsChart = ({ deviceId, timeframe = '24h', height = 300 }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!deviceId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/esp32/energy-trends/${deviceId}?timeframe=${timeframe}`
                );

                if (response.data && response.data.status === 'success') {
                    setData(response.data.data || []);
                } else {
                    setError('Failed to load energy trends data');
                }
            } catch (error) {
                setError(error.message || 'Error loading energy trends');
                console.error('Error fetching energy trends:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deviceId, timeframe]);

    // Format time for display
    const formatTime = (time) => {
        if (!time) return '';

        try {
            const date = new Date(time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return time.toString();
        }
    };

    // Format tooltip values
    const formatTooltipValue = (value, name) => {
        if (name === 'avg_power') return [`${value.toFixed(2)} W`, 'Power'];
        if (name === 'avg_voltage') return [`${value.toFixed(1)} V`, 'Voltage'];
        if (name === 'avg_current') return [`${value.toFixed(3)} A`, 'Current'];
        if (name === 'total_energy') return [`${value.toFixed(2)} Wh`, 'Energy'];
        return [value, name];
    };

    // Format tooltip label
    const formatTooltipLabel = (label) => {
        try {
            return new Date(label).toLocaleString();
        } catch (e) {
            return label;
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center" style={{ height }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ height }}>
                <div className="text-red-500 mb-2">{error}</div>
                <button
                    onClick={() => setLoading(true)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Empty state
    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center text-gray-500" style={{ height }}>
                No energy data available
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                        dataKey="period_start"
                        tickFormatter={formatTime}
                        stroke="#9CA3AF"
                        fontSize={12}
                    />
                    <YAxis yAxisId="left" stroke="#6366F1" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '6px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #E5E7EB'
                        }}
                        formatter={formatTooltipValue}
                        labelFormatter={formatTooltipLabel}
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
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avg_current"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        name="Current (A)"
                        dot={false}
                        activeDot={{ r: 4, stroke: '#D97706', strokeWidth: 1, fill: '#F59E0B' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EnergyTrendsChart;
