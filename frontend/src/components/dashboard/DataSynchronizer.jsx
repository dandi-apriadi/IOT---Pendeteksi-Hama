import React, { useEffect, useState, useRef } from 'react';

/**
 * Component for monitoring and debugging data synchronization between ESP32 and frontend
 */
const DataSynchronizer = ({ sensorData, lastUpdate, isConnected }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dataLog, setDataLog] = useState([]);
    const maxLogEntries = 20;
    const lastDataRef = useRef(null);

    // Log data changes
    useEffect(() => {
        if (sensorData && (!lastDataRef.current ||
            JSON.stringify(lastDataRef.current) !== JSON.stringify(sensorData))) {

            // Add to log
            setDataLog(prev => [
                {
                    timestamp: new Date(),
                    data: { ...sensorData },
                    changes: calculateChanges(lastDataRef.current, sensorData)
                },
                ...prev.slice(0, maxLogEntries - 1)
            ]);

            // Update reference
            lastDataRef.current = { ...sensorData };
        }
    }, [sensorData]);

    // Calculate what changed between data updates
    const calculateChanges = (oldData, newData) => {
        if (!oldData) return { type: 'initial' };

        const changes = {};
        for (const key in newData) {
            if (oldData[key] !== newData[key]) {
                changes[key] = {
                    from: oldData[key],
                    to: newData[key]
                };
            }
        }
        return Object.keys(changes).length > 0 ? changes : { type: 'no-change' };
    };

    if (!isVisible) {
        return (
            <button
                className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm"
                onClick={() => setIsVisible(true)}
            >
                Show Data Sync
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 right-0 z-50 bg-white shadow-lg border border-gray-200 rounded-tl-lg w-full md:w-1/2 lg:w-1/3 max-h-96 overflow-auto">
            <div className="bg-blue-500 text-white p-2 flex justify-between items-center sticky top-0">
                <h3 className="text-sm font-semibold">ESP32 Data Synchronization Monitor</h3>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <button className="text-white" onClick={() => setIsVisible(false)}>✕</button>
                </div>
            </div>

            <div className="p-3 text-xs border-b border-gray-200">
                <div className="flex justify-between">
                    <span>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
                    <span>Last Update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}</span>
                </div>
                <div className="mt-1">
                    <span className="font-semibold">Current Values:</span>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                        <div className="bg-gray-100 p-1 rounded">V: {sensorData?.voltage?.toFixed(1) || '?'}V</div>
                        <div className="bg-gray-100 p-1 rounded">I: {sensorData?.current?.toFixed(2) || '?'}A</div>
                        <div className="bg-gray-100 p-1 rounded">P: {sensorData?.power?.toFixed(1) || '?'}W</div>
                        <div className="bg-gray-100 p-1 rounded">E: {sensorData?.energy?.toFixed(2) || '?'}Wh</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className={`p-1 rounded ${sensorData?.pir_status ? 'bg-red-100' : 'bg-green-100'}`}>
                            PIR: {sensorData?.pir_status ? 'ACTIVE ⚠️' : 'Inactive'}
                        </div>
                        <div className={`p-1 rounded ${sensorData?.pump_status ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            Pump: {sensorData?.pump_status ? 'ON' : 'OFF'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3">
                <h4 className="text-xs font-semibold mb-2">Data Update Log</h4>
                <div className="divide-y divide-gray-100">
                    {dataLog.length === 0 ? (
                        <div className="text-xs text-gray-500 py-2">No data updates yet</div>
                    ) : (
                        dataLog.map((entry, index) => (
                            <div key={index} className="py-2">
                                <div className="flex justify-between text-xs">
                                    <span className="font-mono">{entry.timestamp.toLocaleTimeString()}</span>
                                    <span className="text-gray-500">
                                        {Object.keys(entry.changes).length} change(s)
                                    </span>
                                </div>
                                {Object.keys(entry.changes).length > 0 && entry.changes.type !== 'initial' && (
                                    <div className="mt-1 text-xs">
                                        {Object.entries(entry.changes).map(([key, values]) => (
                                            <div key={key} className="grid grid-cols-3 gap-1">
                                                <span className="font-semibold">{key}:</span>
                                                <span className="text-red-500">{values.from}</span>
                                                <span className="text-green-500">→ {values.to}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={() => setDataLog([])}
                    className="w-full text-xs bg-gray-200 hover:bg-gray-300 py-1 rounded text-gray-700"
                >
                    Clear Log
                </button>
            </div>
        </div>
    );
};

export default DataSynchronizer;
