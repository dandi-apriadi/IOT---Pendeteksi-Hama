import React from 'react';
import { useEnergyMonitoring } from '../../hooks/useEnergyMonitoring';

/**
 * Energy Summary Card Component
 * Displays summary of energy usage and costs
 */
const EnergySummaryCard = ({ deviceId = 'ESP32-PUMP-01' }) => {
    const { stats, lastUpdated, loading } = useEnergyMonitoring({
        deviceId,
        refreshInterval: 60000,
        defaultTimeframe: '24h'
    });

    // Format currency (IDR)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Format date/time
    const formatTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6">
                <h3 className="text-white text-lg font-semibold">Energy Usage Summary</h3>
                <p className="text-blue-100 text-sm">
                    Last updated: {loading ? 'Updating...' : formatTime(lastUpdated)}
                </p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Today's Usage */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="text-xs text-blue-500 font-medium uppercase mb-1">Today's Usage</h4>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-blue-700">
                                {(stats.daily?.usage || 0).toFixed(2)}
                            </span>
                            <span className="ml-1 text-blue-500 text-sm">Wh</span>
                        </div>
                        <div className="mt-1 text-xs text-blue-600">
                            {loading ? 'Calculating...' : `≈ ${(stats.daily?.usage / 1000).toFixed(4)} kWh`}
                        </div>
                    </div>

                    {/* Estimated Cost */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="text-xs text-green-500 font-medium uppercase mb-1">Today's Cost</h4>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-green-700">
                                {formatCurrency(stats.daily?.cost || 0)}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-green-600">
                            Based on Rp. 1,500/kWh
                        </div>
                    </div>

                    {/* Monthly Estimate */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <h4 className="text-xs text-purple-500 font-medium uppercase mb-1">Monthly Estimate</h4>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-purple-700">
                                {formatCurrency(stats.daily?.estimated_monthly || 0)}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-purple-600">
                            Based on current usage pattern
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-xs text-gray-500 font-medium uppercase mb-2">Average Readings</h4>
                    <div className="grid grid-cols-4 gap-6">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Avg. Voltage</div>
                            <div className="text-sm font-medium text-gray-700">
                                {stats.voltage?.avg.toFixed(1)} <span className="text-xs">V</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Avg. Current</div>
                            <div className="text-sm font-medium text-gray-700">
                                {stats.current?.avg.toFixed(2)} <span className="text-xs">A</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Avg. Power</div>
                            <div className="text-sm font-medium text-gray-700">
                                {stats.power?.avg.toFixed(1)} <span className="text-xs">W</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Peak Power</div>
                            <div className="text-sm font-medium text-gray-700">
                                {stats.power?.max.toFixed(1)} <span className="text-xs">W</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergySummaryCard;
