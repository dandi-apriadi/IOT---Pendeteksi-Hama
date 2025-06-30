import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import JadwalSection from "../../../components/dashboard/JadwalSection";

const DEVICE_ID = "ESP32-PUMP-01";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const SprayingControl = () => {
    const [pumpStatus, setPumpStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [statusTransition, setStatusTransition] = useState(false);
    
    // Schedule management states (aligned with JadwalSection)
    const [schedules, setSchedules] = useState([]);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [scheduleError, setScheduleError] = useState(null);
    const [devices, setDevices] = useState([]);
    const [devicesLoading, setDevicesLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Refs untuk prevent multiple calls
    const intervalRef = useRef(null);
    const isMountedRef = useRef(true);
    const previousPumpStatusRef = useRef(null);
    const hasInitialLoadRef = useRef(false);
    const devicesRef = useRef([]);
    const devicesLoadingRef = useRef(false);
    const scheduleLoadingRef = useRef(false);

    // Memoized functions untuk prevent re-render loops
    const fetchPumpStatus = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        try {
            // ✅ Hanya pump status yang di-poll setiap 2 detik - ini NORMAL
            const res = await axios.get(`${API_BASE}/api/esp32/data`, {
                params: { 
                    device_id: DEVICE_ID,
                    _t: Date.now()
                }
            });
            
            if (!isMountedRef.current) return;
            
            // console.log("Pump status response:", res.data); // Reduced logging
            
            const newPumpStatus = res.data?.data?.pump_status;
            const previousStatus = previousPumpStatusRef.current;
            
            // Check for status change using ref
            if (previousStatus !== null && previousStatus !== newPumpStatus) {
                console.log(`⚡ Pump status changed from ${previousStatus} to ${newPumpStatus}`);
                setStatusTransition(true);
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setStatusTransition(false);
                    }
                }, 1000);
            }
            
            // Update refs and state
            if (res.data?.data?.pump_status !== undefined) {
                previousPumpStatusRef.current = newPumpStatus;
                setPumpStatus(newPumpStatus);
            }
        } catch (err) {
            if (isMountedRef.current) {
                console.error("Error fetching pump status:", err);
            }
        }
    }, []); // Empty dependency - we use refs for current values

    const fetchSchedules = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        // Use ref to prevent concurrent calls
        if (scheduleLoadingRef.current) return;
        
        // Only fetch if not already loaded
        if (hasInitialLoadRef.current) {
            console.log("📅 Schedules already loaded, skipping fetch");
            return;
        }
        
        scheduleLoadingRef.current = true;
        setScheduleLoading(true);
        setScheduleError(null);
        
        try {
            console.log("📅 Fetching schedules - INITIAL LOAD ONLY");
            const res = await axios.get(`${API_BASE}/api/schedules`);
            
            if (isMountedRef.current) {
                const scheduleData = Array.isArray(res.data?.data) ? res.data.data : [];
                console.log(`✅ Fetched ${scheduleData.length} schedules - INITIAL LOAD COMPLETE`);
                setSchedules(scheduleData);
                hasInitialLoadRef.current = true;
            }
        } catch (err) {
            if (isMountedRef.current) {
                console.error("Error fetching schedules:", err);
                setScheduleError("Gagal memuat jadwal");
                setSchedules([]);
            }
        } finally {
            scheduleLoadingRef.current = false;
            if (isMountedRef.current) {
                setScheduleLoading(false);
            }
        }
    }, []); // ✅ EMPTY dependency array

    const fetchDevices = useCallback(async (force = false) => {
        if (!isMountedRef.current) return;

        // Use ref instead of state to prevent concurrent calls
        if (devicesLoadingRef.current) return;
        
        // Only fetch if forced or not yet loaded
        if (!force && devicesRef.current.length > 0) {
            console.log("Devices already loaded, skipping fetch");
            return;
        }
        
        devicesLoadingRef.current = true;
        setDevicesLoading(true);
        try {
            console.log("🔧 Fetching devices - INITIAL LOAD ONLY");
            const res = await axios.get(`${API_BASE}/api/dashboard/devices`);
            if (isMountedRef.current) {
                const deviceData = res.data?.data || [];
                console.log(`✅ Fetched ${deviceData.length} devices - INITIAL LOAD COMPLETE`);
                setDevices(deviceData);
                devicesRef.current = deviceData;
            }
        } catch (err) {
            if (isMountedRef.current) {
                console.error("Error fetching devices:", err);
                setDevices([]);
                devicesRef.current = [];
            }
        } finally {
            devicesLoadingRef.current = false;
            if (isMountedRef.current) {
                setDevicesLoading(false);
            }
        }
    }, []); // ✅ EMPTY dependency array to prevent re-creation

    // Component lifecycle effects
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        isMountedRef.current = true;
        devicesRef.current = [];
        devicesLoadingRef.current = false;
        scheduleLoadingRef.current = false;
        
        // Initial fetch - hanya sekali saat mount
        console.log("🚀 Component mounted - Initial data fetch");
        fetchPumpStatus();
        fetchSchedules();
        fetchDevices();
        
        // Set up polling interval HANYA untuk pump status
        intervalRef.current = setInterval(() => {
            if (isMountedRef.current) {
                fetchPumpStatus(); // Hanya pump status yang di-poll
            }
        }, 2000);
        
        // Cleanup on unmount
        return () => {
            console.log("🔄 Component unmounting - cleaning up");
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []); // Intentionally empty - we want this to run only once

    // Schedule management functions (aligned with JadwalSection)
    const handleAddSchedule = async (scheduleData) => {
        try {
            const response = await axios.post(`${API_BASE}/api/schedules`, scheduleData);
            
            // ✅ HANYA optimistic update - TIDAK ADA refetch
            if (response.data?.data) {
                setSchedules(prev => [...prev, response.data.data]);
                console.log("✅ Schedule added successfully with optimistic update");
            } else {
                // ❌ HAPUS fallback refetch yang menyebabkan request berlebihan
                console.warn("⚠️ No data returned from add schedule API");
            }
            
            return { success: true };
        } catch (err) {
            console.error("Error adding schedule:", err);
            throw new Error(err.response?.data?.message || "Gagal menambah jadwal");
        }
    };

    const handleUpdateSchedule = async (scheduleId, updateData) => {
        try {
            const response = await axios.put(`${API_BASE}/api/schedules/${scheduleId}`, updateData);
            
            // ✅ HANYA optimistic update - TIDAK ADA refetch
            if (response.data?.data) {
                setSchedules(prev => prev.map(schedule => 
                    schedule.schedule_id === scheduleId ? response.data.data : schedule
                ));
                console.log("✅ Schedule updated successfully with optimistic update");
            } else {
                // ❌ HAPUS fallback refetch yang menyebabkan request berlebihan
                console.warn("⚠️ No data returned from update schedule API");
            }
            
            return { success: true };
        } catch (err) {
            console.error("Error updating schedule:", err);
            throw new Error(err.response?.data?.message || "Gagal mengupdate jadwal");
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            await axios.delete(`${API_BASE}/api/schedules/${scheduleId}`);
            
            // Optimistically update local state
            setSchedules(prev => prev.filter(schedule => schedule.schedule_id !== scheduleId));
            
            return { success: true };
        } catch (err) {
            console.error("Error deleting schedule:", err);
            throw new Error(err.response?.data?.message || "Gagal menghapus jadwal");
        }
    };

    const handleToggleScheduleStatus = async (scheduleId) => {
        try {
            const schedule = schedules.find(s => s.schedule_id === scheduleId);
            if (!schedule) throw new Error("Jadwal tidak ditemukan");

            const response = await axios.put(`${API_BASE}/api/schedules/${scheduleId}`, {
                ...schedule,
                is_active: !schedule.is_active
            });
            
            // Optimistically update local state
            if (response.data?.data) {
                setSchedules(prev => prev.map(s => 
                    s.schedule_id === scheduleId ? response.data.data : s
                ));
            } else {
                // Fallback: update just the is_active field
                setSchedules(prev => prev.map(s => 
                    s.schedule_id === scheduleId ? { ...s, is_active: !s.is_active } : s
                ));
            }
            
            return { success: true };
        } catch (err) {
            console.error("Error toggling schedule status:", err);
            throw new Error(err.response?.data?.message || "Gagal mengubah status jadwal");
        }
    };
    
    // Check if device is online
    const checkDeviceStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/esp32/device-status/${DEVICE_ID}`);
            const isOnline = res.data?.online === true;
            
            // Store last seen info if available
            const lastSeen = res.data?.last_seen;
            
            // If device is offline but we have recent data, consider the device "semi-connected"
            if (!isOnline && lastSeen && typeof lastSeen === 'string' && lastSeen.includes('minute')) {
                // Device was seen recently, might just be a temporary WebSocket disconnection
                // Return true to allow commands to flow through - they might still work
                console.log(`Device appears offline but was seen ${lastSeen}. Will attempt to send commands anyway.`);
                return true;
            }
            
            return isOnline;
        } catch (err) {
            console.error("Error checking device status:", err);
            return false;
        }
    };

    const handlePumpControl = async (command) => { // command can be 'on' or 'off'
        setLoading(true);
        setError("");
        try {
            // Check if device is online first
            const isOnline = await checkDeviceStatus();
            
            if (!isOnline) {
                throw new Error("Perangkat ESP32 mungkin tidak terhubung. Mencoba mengirim perintah...");
            }
            
            // Use the unified command endpoint
            const endpoint = `${API_BASE}/api/pump/command/${DEVICE_ID}`;
            const payload = { command: command }; // 'on' or 'off'
                
            const response = await axios.post(endpoint, payload);
            
            if (response.data?.status === "success") {
                // Immediately update UI with the expected state
                const newStatus = command === 'on';
                previousPumpStatusRef.current = newStatus;
                setPumpStatus(newStatus);
                
                // Brief pulse animation on status dot only
                setStatusTransition(true);
                setTimeout(() => setStatusTransition(false), 1000);
                
                // ✅ TIDAK ADA additional fetch - polling interval akan handle update
                console.log(`✅ Pump command ${command} sent successfully`);
            } else {
                setError("Gagal mengirim perintah ke pompa.");
            }
        } catch (err) {
            // Special handling for displayed errors
            if (err.message.includes("Perangkat ESP32 mungkin tidak terhubung")) {
                // Try sending the command directly anyway - might work if WebSocket reconnects
                try {
                    const endpoint = `${API_BASE}/api/pump/command/${DEVICE_ID}`;
                    const payload = { command: command };
                    const response = await axios.post(endpoint, payload);
                
                    if (response.data?.status === "success") {
                        // It worked despite the device status check failing!
                        const newStatus = command === 'on';
                        previousPumpStatusRef.current = newStatus;
                        setPumpStatus(newStatus);
                        setStatusTransition(true);
                        setTimeout(() => setStatusTransition(false), 1000);
                        
                        // ✅ TIDAK ADA additional fetch - polling akan handle
                        console.log(`✅ Pump command ${command} succeeded despite initial check`);
                        
                        // Clear the error since command succeeded
                        setError("");
                    } else {
                        setError("Perangkat tampak offline. Perintah mungkin tidak berhasil.");
                    }
                } catch (secondErr) {
                    setError("Perangkat ESP32 tidak terhubung. Silakan periksa koneksi perangkat.");
                }
            } else if (err.response?.data?.message) {
                setError(`Error: ${err.response.data.message}`);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Gagal mengirim perintah ke pompa. Periksa koneksi perangkat.");
            }
            
            if (err.response) {
                console.error("Error response:", err.response.data);
            } else {
                console.error("Error message:", err.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 mb-8">
                    <h6 className="text-white font-bold text-2xl tracking-wide">
                        Kontrol Penyemprotan
                    </h6>
                </div>
                <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                            {/* Kolom Status & Kontrol Manual */}
                            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kontrol Manual Pompa</h3>
                                <div className="p-6 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-start">
                                            <p className="text-gray-500 text-sm">Status Pompa</p>
                                            <div className="flex items-center mt-2">
                                                <div className={`w-3 h-3 rounded-full mr-2 ${pumpStatus ? 'bg-green-500' : 'bg-red-500'} ${statusTransition ? 'animate-pulse' : ''}`}></div>
                                                <span className={`font-semibold ${pumpStatus ? 'text-green-600' : 'text-red-600'}`}>
                                                    {pumpStatus ? "AKTIF" : "NONAKTIF"}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {pumpStatus ? "Pompa sedang beroperasi (kontrol manual)" : "Pompa tidak aktif"}
                                            </p>
                                        </div>
                                        
                                        <div className={`flex items-center justify-center w-20 h-20 rounded-full 
                                            ${pumpStatus ? 'bg-green-100' : 'bg-red-100'} 
                                            transition-all duration-300 ease-in-out`}>
                                            {pumpStatus ? (
                                                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Animation removed as requested */}
                                    
                                    {/* Notification area */}
                                    <div className="mt-4 min-h-[40px]">
                                        {error && (
                                            <div className="bg-red-50 text-red-600 text-sm p-2 rounded-md flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <button
                                        className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                        onClick={() => handlePumpControl("on")}
                                        disabled={loading || pumpStatus === true}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z"></path></svg>
                                        Nyalakan Pompa
                                    </button>
                                    <button
                                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                        onClick={() => handlePumpControl("off")}
                                        disabled={loading || pumpStatus === false}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5 6a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H5z"></path></svg>
                                        Matikan Pompa
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Spraying Schedule Section using JadwalSection Component */}
                        <div className="mt-6">
                            <JadwalSection
                                schedules={schedules}
                                scheduleLoading={scheduleLoading}
                                scheduleError={scheduleError}
                                devices={devices}
                                devicesLoading={devicesLoading}
                                onAddSchedule={handleAddSchedule}
                                onUpdateSchedule={handleUpdateSchedule}
                                onDeleteSchedule={handleDeleteSchedule}
                                onToggleScheduleStatus={handleToggleScheduleStatus}
                                showAddModal={showAddModal}
                                setShowAddModal={setShowAddModal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprayingControl;
