import React, { useState, useEffect } from 'react';
import { dummySensorData } from '../../utils/dummyData';

/**
 * Real-time data monitor component that displays electrical values and PIR sensor status
 * DUMMY VERSION - using static data
 */
const RealtimeDataMonitor = () => {
    const sensorData = dummySensorData;
    const isConnected = true;
    const lastUpdate = new Date().toISOString();

    const [changedValues, setChangedValues] = useState({});
    const [prevData, setPrevData] = useState(null);

    // Simulate value changes for UI demonstration
    useEffect(() => {
        // Set initial previous data
        setPrevData({ ...sensorData });

        // Simulate a change after 2 seconds
        const timer = setTimeout(() => {
            setChangedValues({
                voltage: true,
                power: true
            });

            // Remove highlight after animation
            const resetTimer = setTimeout(() => {
                setChangedValues({});
            }, 2000);

            return () => clearTimeout(resetTimer);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // If no data yet, show loading
    if (!sensorData) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <div className="text-center text-gray-500 py-4">
                    <p>Menunggu data dari ESP32...</p>
                </div>
            </div>
        );
    }

    // Safe access to numeric values with fallbacks to prevent errors
    const voltage = typeof sensorData.voltage === 'number' ? sensorData.voltage : 0;
    const current = typeof sensorData.current === 'number' ? sensorData.current : 0;
    const power = typeof sensorData.power === 'number' ? sensorData.power : 0;
    const energy = typeof sensorData.energy === 'number' ? sensorData.energy : 0;
    const pirStatus = sensorData.pir_status === true;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-white flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <h3 className="text-sm font-medium">Monitoring ESP32 Real-time</h3>
                </div>
                <div className="text-xs opacity-75">
                    {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Tidak ada data'}
                </div>
            </div>

            <div className="p-4">
                {/* Electrical readings section */}
                <div className="mb-4">
                    <h4 className="text-xs text-gray-500 uppercase mb-2 font-medium">Kelistrikan</h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className={`p-3 rounded-md border transition-all duration-300 ${changedValues.voltage ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                            <div className="text-xs text-gray-500 mb-1">Tegangan</div>
                            <div className="text-xl font-bold text-blue-600">{voltage.toFixed(1)} <span className="text-sm font-normal">V</span></div>
                        </div>

                        <div className={`p-3 rounded-md border transition-all duration-300 ${changedValues.current ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}>
                            <div className="text-xs text-gray-500 mb-1">Arus</div>
                            <div className="text-xl font-bold text-purple-600">{current.toFixed(2)} <span className="text-sm font-normal">A</span></div>
                        </div>

                        <div className={`p-3 rounded-md border transition-all duration-300 ${changedValues.power ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                            <div className="text-xs text-gray-500 mb-1">Daya</div>
                            <div className="text-xl font-bold text-orange-600">{power.toFixed(0)} <span className="text-sm font-normal">W</span></div>
                        </div>

                        <div className={`p-3 rounded-md border transition-all duration-300 ${changedValues.energy ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                            <div className="text-xs text-gray-500 mb-1">Energi</div>
                            <div className="text-xl font-bold text-green-600">{energy.toFixed(3)} <span className="text-sm font-normal">kWh</span></div>
                        </div>
                    </div>
                </div>

                {/* PIR sensor status */}
                <div className="mt-4">
                    <h4 className="text-xs text-gray-500 uppercase mb-2 font-medium">Sensor PIR</h4>
                    <div className={`p-4 rounded-md border flex items-center transition-all duration-300
                        ${changedValues.pir_status ? 'animate-pulse' : ''}
                        ${pirStatus ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                        <div className={`w-4 h-4 rounded-full mr-3 ${pirStatus ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <div>
                            <div className="text-sm font-medium">
                                {pirStatus ? 'Gerakan Terdeteksi!' : 'Tidak Ada Gerakan'}
                            </div>
                            <div className="text-xs text-gray-500">
                                Status: {pirStatus ? 'Aktif' : 'Non-aktif'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealtimeDataMonitor;
