import React, { useState, useEffect, useMemo } from 'react';
import { useEnergyTrends } from '../../hooks/useEnergyTrends';
import { errorOnce } from '../../utils/consoleLogger';
import ReactApexChart from 'react-apexcharts';

const EnergyTrendDisplay = ({ deviceId = 'ESP32-PUMP-01', refreshInterval = 5000 }) => {
    // Use our custom hook for energy trend data
    const {
        trendData,
        latestData,
        timeframe,
        loading,
        error,
        lastUpdate,
        changeTimeframe,
        refreshData
    } = useEnergyTrends(deviceId, refreshInterval);

    // Format timestamp nicely
    const formatTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString();
        } catch (error) {
            errorOnce('ENERGY_TREND_TIMESTAMP_ERROR', 'Error formatting timestamp:', error);
            return 'Invalid time';
        }
    };

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!trendData || trendData.length === 0) return null;

        // Extract series data
        const voltageSeries = [];
        const currentSeries = [];
        const powerSeries = [];
        const timestamps = [];

        trendData.forEach(item => {
            voltageSeries.push(parseFloat(item.avg_voltage) || 0);
            currentSeries.push(parseFloat(item.avg_current) || 0);
            powerSeries.push(parseFloat(item.avg_power) || 0);
            timestamps.push(formatTime(item.period_start));
        });

        return {
            options: {
                chart: {
                    type: 'line',
                    zoom: { enabled: false },
                    toolbar: { show: false },
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 500
                        }
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                xaxis: {
                    categories: timestamps,
                    labels: {
                        rotate: 0,
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                yaxis: [
                    {
                        title: {
                            text: 'Voltage (V)'
                        },
                        decimalsInFloat: 1
                    },
                    {
                        opposite: true,
                        title: {
                            text: 'Current (A)'
                        },
                        decimalsInFloat: 2
                    },
                    {
                        show: false,
                        seriesName: 'Power',
                        decimalsInFloat: 1
                    }
                ],
                legend: {
                    position: 'top'
                },
                tooltip: {
                    shared: true,
                    intersect: false
                },
                title: {
                    text: 'Real-Time Electrical Trends',
                    align: 'center',
                    style: {
                        fontSize: '14px'
                    }
                }
            },
            series: [
                {
                    name: 'Voltage (V)',
                    data: voltageSeries
                },
                {
                    name: 'Current (A)',
                    data: currentSeries
                },
                {
                    name: 'Power (W)',
                    data: powerSeries
                }
            ]
        };
    }, [trendData]);

    // Track if we have valid data
    const hasData = trendData && trendData.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Electrical Trends (5-Second Updates)</h3>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2 mr-4">
                        <button
                            onClick={() => changeTimeframe('1m')}
                            className={`px-2 py-1 text-xs font-medium rounded ${timeframe === '1m' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            1m
                        </button>
                        <button
                            onClick={() => changeTimeframe('5m')}
                            className={`px-2 py-1 text-xs font-medium rounded ${timeframe === '5m' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            5m
                        </button>
                        <button
                            onClick={() => changeTimeframe('15m')}
                            className={`px-2 py-1 text-xs font-medium rounded ${timeframe === '15m' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            15m
                        </button>
                        <button
                            onClick={() => changeTimeframe('30m')}
                            className={`px-2 py-1 text-xs font-medium rounded ${timeframe === '30m' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            30m
                        </button>
                    </div>
                    <span className="text-xs text-gray-500">
                        Last update: {lastUpdate ? formatTime(lastUpdate) : 'N/A'}
                    </span>
                </div>
            </div>

            {loading && !hasData && (
                <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading data...</span>
                </div>
            )}

            {error && !hasData && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">Error loading energy trend data: {error}</p>
                    <button
                        onClick={refreshData}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {hasData && chartData && (
                <div>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        height={300}
                    />

                    {/* Latest values display */}
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-md">
                            <div className="text-xs text-blue-600 mb-1">Latest Voltage</div>
                            <div className="text-lg font-bold text-blue-800">
                                {latestData ? parseFloat(latestData.avg_voltage).toFixed(1) : '0.0'} <span className="text-xs font-normal">V</span>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-md">
                            <div className="text-xs text-purple-600 mb-1">Latest Current</div>
                            <div className="text-lg font-bold text-purple-800">
                                {latestData ? parseFloat(latestData.avg_current).toFixed(2) : '0.00'} <span className="text-xs font-normal">A</span>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-md">
                            <div className="text-xs text-orange-600 mb-1">Latest Power</div>
                            <div className="text-lg font-bold text-orange-800">
                                {latestData ? parseFloat(latestData.avg_power).toFixed(1) : '0.0'} <span className="text-xs font-normal">W</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!hasData && !loading && !error && (
                <div className="p-8 text-center">
                    <p className="text-gray-500">No energy trend data available</p>
                    <button
                        onClick={refreshData}
                        className="mt-2 px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Load Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnergyTrendDisplay;
