import React, { useEffect, useState } from "react";

/**
 * Real-time device monitoring component
 * Shows the status of devices with accurate online/offline indicators
 */
const DeviceMonitor = ({ devices, onRefresh }) => {
    const [lastCheck, setLastCheck] = useState(new Date());

    // Update last check time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setLastCheck(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Generate status class based on device status and last seen time
    const getStatusClass = (device) => {
        if (!device) return "bg-gray-400";

        if (device.status === 'online') {
            return "bg-green-500 animate-pulse";
        }

        // Calculate time since last seen
        const lastSeen = device.last_seen ? new Date(device.last_seen) : null;
        if (!lastSeen) return "bg-red-500";

        const diffMinutes = (lastCheck - lastSeen) / (1000 * 60);

        if (diffMinutes < 1) return "bg-yellow-500"; // Just went offline (< 1 min)
        if (diffMinutes < 5) return "bg-orange-500"; // Offline for a bit (1-5 min)
        return "bg-red-500"; // Offline for a while (> 5 min)
    };

    // Format time since last seen without date-fns
    const formatTimeSince = (timestamp) => {
        if (!timestamp) return "Tidak pernah terhubung";

        const lastSeen = new Date(timestamp);
        const now = new Date();
        const diffMs = now - lastSeen;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} hari yang lalu`;
        } else if (diffHours > 0) {
            return `${diffHours} jam yang lalu`;
        } else if (diffMins > 0) {
            return `${diffMins} menit yang lalu`;
        } else {
            return "baru saja";
        }
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow">
            <div className="flex justify-between items-center bg-blue-600 p-3">
                <h3 className="text-white font-medium text-sm">Status Perangkat</h3>
                <button
                    onClick={onRefresh}
                    className="text-white text-xs bg-blue-700 hover:bg-blue-800 rounded px-2 py-1"
                >
                    Refresh
                </button>
            </div>

            <div className="p-4">
                <div className="text-xs text-gray-500 mb-2">
                    Pembaruan terakhir: {lastCheck.toLocaleTimeString('id-ID')}
                </div>

                {devices && devices.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {devices.map(device => (
                            <li key={device.device_id} className="py-2 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className={`h-3 w-3 rounded-full ${getStatusClass(device)} mr-2`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{device.device_id}</p>
                                        <p className="text-xs text-gray-500">{device.location || 'Lokasi tidak diketahui'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {device.status === 'online' ? 'Online' : 'Offline'}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{formatTimeSince(device.last_seen)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-4 text-center text-gray-500">
                        <p>Tidak ada perangkat yang terdeteksi</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceMonitor;
