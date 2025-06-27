import React, { useState, useEffect } from 'react';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL;

const JadwalSection = ({
    schedules = [],
    scheduleLoading = false,
    scheduleError = null,
    devices = [],
    devicesLoading = false,
    onAddSchedule,
    onUpdateSchedule,
    onDeleteSchedule,
    onToggleScheduleStatus,
    onRefreshSchedules,
    onRefreshDevices,
    showAddModal = false,
    setShowAddModal
}) => {    // Form state for adding new schedule
    const [newSchedule, setNewSchedule] = useState({
        device_id: '',
        title: '',
        schedule_type: 'one-time',
        start_time: '',
        end_time: '',
        action_type: 'turn_on',
        is_active: true
    });

    // Edit schedule state
    const [editSchedule, setEditSchedule] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // Debug logging for devices
    useEffect(() => {
        console.log('JadwalSection - Devices received:', devices);
        console.log('JadwalSection - Devices length:', devices?.length);
        console.log('JadwalSection - Devices type:', typeof devices);
    }, [devices]);    // Debug logging for schedules
    useEffect(() => {
        console.log('JadwalSection - Schedules received:', schedules);
        console.log('JadwalSection - Schedules length:', schedules?.length);
        console.log('JadwalSection - Schedule loading:', scheduleLoading);
        console.log('JadwalSection - Schedule error:', scheduleError);

        // Check if schedules is an array and has data
        if (Array.isArray(schedules)) {
            console.log('JadwalSection - Schedules is array with', schedules.length, 'items');
            schedules.forEach((schedule, index) => {
                console.log(`Schedule ${index}:`, {
                    id: schedule.schedule_id,
                    title: schedule.title,
                    device_id: schedule.device_id,
                    schedule_type: schedule.schedule_type,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    action_type: schedule.action_type,
                    is_active: schedule.is_active
                });
            });
        } else {
            console.log('JadwalSection - Schedules is not an array:', typeof schedules);
        }

        // If no schedules and no loading/error, log debugging info
        if (!scheduleLoading && !scheduleError && (!schedules || schedules.length === 0)) {
            console.log('No schedules found - this could be due to:');
            console.log('1. Database is empty');
            console.log('2. Backend server is not running');
            console.log('3. API endpoint error');
            console.log('4. fetchSchedules not being called');
        }
    }, [schedules, scheduleLoading, scheduleError]);// Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle device_id specially to ensure correct data type
        let processedValue = value;
        if (name === 'device_id' && value) {
            // Convert to number if it's a valid number, otherwise keep as string
            const numValue = parseInt(value);
            processedValue = isNaN(numValue) ? value : numValue;
            console.log('Device ID selected:', processedValue, 'Type:', typeof processedValue);
        }

        setNewSchedule(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };// Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setFormError(null);

            // Validate that devices are available
            if (!devices || devices.length === 0) {
                throw new Error('Tidak ada device yang tersedia. Pastikan perangkat ESP32 sudah terhubung.');
            }            // Validate that a device is selected
            if (!newSchedule.device_id) {
                throw new Error('Silakan pilih device terlebih dahulu.');
            }

            // Debug logging untuk melihat tipe data
            console.log('Selected device_id from form:', newSchedule.device_id, 'Type:', typeof newSchedule.device_id);
            console.log('Available devices:', devices.map(d => ({ id: d.device_id, type: typeof d.device_id, name: d.device_name })));

            // Validate that the selected device exists - handle both string and number types
            const selectedDeviceId = newSchedule.device_id;
            const selectedDevice = devices.find(device => {
                // Compare as both string and number to handle type mismatches
                return device.device_id == selectedDeviceId ||
                    device.device_id === parseInt(selectedDeviceId) ||
                    device.device_id === selectedDeviceId.toString();
            });

            if (!selectedDevice) {
                console.error('Device validation failed:');
                console.error('- Selected ID:', selectedDeviceId, typeof selectedDeviceId);
                console.error('- Available devices:', devices);
                throw new Error('Device yang dipilih tidak valid. Silakan pilih device yang tersedia.');
            } console.log('Selected device found:', selectedDevice);

            // Debug: Log the complete schedule data being sent
            console.log('Schedule data being sent:', {
                ...newSchedule,
                device_id: selectedDeviceId
            }); await onAddSchedule(newSchedule);

            // Reset form
            setNewSchedule({
                device_id: '',
                title: '',
                schedule_type: 'one-time',
                start_time: '',
                end_time: '',
                action_type: 'turn_on',
                is_active: true
            });

            // Close modal
            setShowAddModal(false);

            // Refresh schedules data after add
            if (onRefreshSchedules && typeof onRefreshSchedules === 'function') {
                console.log('Refreshing schedules after add...');
                await onRefreshSchedules();
            }

        } catch (error) {
            setFormError(error.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Handle edit schedule
    const handleEdit = (schedule) => {
        setEditSchedule({
            schedule_id: schedule.schedule_id,
            device_id: schedule.device_id,
            title: schedule.title,
            schedule_type: schedule.schedule_type,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            action_type: schedule.action_type,
            is_active: schedule.is_active
        });
        setShowEditModal(true);
    };

    // Handle edit form input changes
    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle device_id specially to ensure correct data type
        let processedValue = value;
        if (name === 'device_id' && value) {
            const numValue = parseInt(value);
            processedValue = isNaN(numValue) ? value : numValue;
        }

        setEditSchedule(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    // Handle edit form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setFormError(null);

            // Validate that devices are available
            if (!devices || devices.length === 0) {
                throw new Error('Tidak ada device yang tersedia.');
            }

            // Validate that a device is selected
            if (!editSchedule.device_id) {
                throw new Error('Silakan pilih device terlebih dahulu.');
            }

            // Validate that the selected device exists
            const selectedDeviceId = editSchedule.device_id;
            const selectedDevice = devices.find(device => {
                return device.device_id == selectedDeviceId ||
                    device.device_id === parseInt(selectedDeviceId) ||
                    device.device_id === selectedDeviceId.toString();
            });

            if (!selectedDevice) {
                throw new Error('Device yang dipilih tidak valid.');
            }

            // Extract the ID for the update call
            const scheduleId = editSchedule.schedule_id;
            const updateData = { ...editSchedule };
            delete updateData.schedule_id; // Remove ID from update data            await onUpdateSchedule(scheduleId, updateData);

            // Close modal
            setShowEditModal(false);
            setEditSchedule(null);

            // Refresh schedules data after update
            if (onRefreshSchedules && typeof onRefreshSchedules === 'function') {
                console.log('Refreshing schedules after update...');
                await onRefreshSchedules();
            }

        } catch (error) {
            setFormError(error.message);
        } finally {
            setFormLoading(false);
        }
    };    // Handle delete schedule
    const handleDelete = async (scheduleId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            try {
                console.log('Deleting schedule ID:', scheduleId);
                await onDeleteSchedule(scheduleId);

                // Refresh schedules data after delete
                if (onRefreshSchedules && typeof onRefreshSchedules === 'function') {
                    console.log('Refreshing schedules after delete...');
                    await onRefreshSchedules();
                }
            } catch (error) {
                console.error('Error deleting schedule:', error);
                alert('Gagal menghapus jadwal: ' + error.message);
            }
        }
    };    // Handle toggle schedule status
    const handleToggleStatus = async (scheduleId) => {
        try {
            console.log('Toggling schedule status for ID:', scheduleId);
            await onToggleScheduleStatus(scheduleId);

            // Refresh schedules data after toggle
            if (onRefreshSchedules && typeof onRefreshSchedules === 'function') {
                console.log('Refreshing schedules after toggle...');
                await onRefreshSchedules();
            }
        } catch (error) {
            console.error('Error toggling schedule status:', error);
            alert('Gagal mengubah status jadwal: ' + error.message);
        }
    };// Use only real schedules from database - no filtering
    const displaySchedules = Array.isArray(schedules) ? schedules : [];

    // Debug logging for display schedules
    useEffect(() => {
        console.log('JadwalSection - displaySchedules:', displaySchedules);
        console.log('JadwalSection - displaySchedules length:', displaySchedules.length);
    }, [displaySchedules]);

    // Auto-refresh schedules when component mounts or when devices change
    useEffect(() => {
        if (onRefreshSchedules && typeof onRefreshSchedules === 'function') {
            console.log('JadwalSection - Auto-refreshing schedules...');
            onRefreshSchedules();
        }
    }, [onRefreshSchedules]);

    // Auto-refresh devices when component mounts
    useEffect(() => {
        if (onRefreshDevices && typeof onRefreshDevices === 'function') {
            console.log('JadwalSection - Auto-refreshing devices...');
            onRefreshDevices();
        }
    }, [onRefreshDevices]);

    // Get status badge styling
    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        if (status) {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else {
            return `${baseClasses} bg-red-100 text-red-800`;
        }
    };    // Format time display
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Manajemen Jadwal</h3>                    <p className="text-sm text-gray-500 mt-1">
                        Total: {displaySchedules.length} jadwal
                    </p>
                </div>
                <div className="flex space-x-2">                    <button
                    onClick={() => onRefreshSchedules?.()}
                    disabled={scheduleLoading}
                    className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {scheduleLoading ? 'Memuat...' : 'Refresh'}                    </button>

                    <button
                        onClick={() => {
                            if (devicesLoading) {
                                alert('Sedang memuat daftar devices. Mohon tunggu sebentar...');
                                return;
                            }
                            if (!devices || devices.length === 0) {
                                alert('Tidak ada device yang tersedia. Pastikan perangkat ESP32 sudah terhubung sebelum menambahkan jadwal.');
                                return;
                            }
                            setShowAddModal(true);
                        }}
                        disabled={devicesLoading || !devices || devices.length === 0}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                        title={
                            devicesLoading
                                ? "Sedang memuat devices..."
                                : (!devices || devices.length === 0)
                                    ? "Tidak ada device tersedia"
                                    : "Tambah jadwal baru"
                        }
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {devicesLoading ? 'Memuat...' : 'Tambah Jadwal'}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {scheduleError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{scheduleError}</p>
                        </div>
                    </div>
                </div>
            )}            {/* Schedule Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {scheduleLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Memuat jadwal...</p>
                    </div>) : displaySchedules.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>Tidak ada jadwal ditemukan</p>{(!devices || devices.length === 0) ? (
                                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                                    <p className="text-amber-700 text-sm">
                                        ⚠️ Tidak ada device yang tersedia. Hubungkan perangkat ESP32 terlebih dahulu sebelum membuat jadwal.
                                    </p>
                                    {onRefreshDevices && (
                                        <button
                                            onClick={() => {
                                                console.log('Refreshing devices from empty state...');
                                                onRefreshDevices();
                                            }}
                                            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Refresh Devices
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="mt-2 text-blue-600 hover:text-blue-800"
                                >
                                    Tambah jadwal pertama
                                </button>
                            )}
                        </div>
                    ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Judul & Device
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe & Waktu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kontrol
                                    </th>
                                </tr>
                            </thead>                            <tbody className="bg-white divide-y divide-gray-200">
                                {displaySchedules.map((schedule) => {
                                    console.log('Rendering schedule:', schedule); // Debug log for each schedule

                                    const device = devices.find(d => d.device_id == schedule.device_id);
                                    console.log('Found device for schedule:', device); // Debug log for device

                                    return (
                                        <tr key={schedule.schedule_id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {schedule.title || 'Tidak ada judul'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {device?.device_name || device?.Device?.device_name || `Device ${schedule.device_id || 'Unknown'}`}
                                                </div>
                                            </div>
                                        </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm text-gray-900">
                                                        {schedule.schedule_type === 'one-time' ? 'Sekali' :
                                                            schedule.schedule_type === 'daily' ? 'Harian' :
                                                                schedule.schedule_type === 'weekly' ? 'Mingguan' :
                                                                    schedule.schedule_type === 'monthly' ? 'Bulanan' :
                                                                        schedule.schedule_type || 'Custom'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {schedule.start_time ? formatTime(schedule.start_time) : 'Tidak ada waktu mulai'}
                                                        {schedule.end_time && ` - ${formatTime(schedule.end_time)}`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {schedule.action_type === 'turn_on' ? 'Nyalakan' :
                                                        schedule.action_type === 'turn_off' ? 'Matikan' :
                                                            schedule.action_type === 'toggle' ? 'Toggle' :
                                                                schedule.action_type || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(schedule.is_active)}>
                                                    {schedule.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(schedule)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleStatus(schedule.schedule_id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title={schedule.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d={schedule.is_active ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10 5h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(schedule.schedule_id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Hapus"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Schedule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Tambah Jadwal Baru</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                                    <p className="text-sm text-red-700">{formError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                                <select
                                    name="device_id"
                                    value={newSchedule.device_id}
                                    onChange={handleInputChange}
                                    required
                                    disabled={devicesLoading || !devices || devices.length === 0}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {devicesLoading
                                            ? "Memuat devices..."
                                            : (!devices || devices.length === 0)
                                                ? "Tidak ada device tersedia"
                                                : "Pilih Device"
                                        }
                                    </option>
                                    {devices && devices.length > 0 && devices.map((device) => (
                                        <option key={device.device_id} value={device.device_id}>
                                            {device.device_name || `Device ${device.device_id}`}
                                        </option>
                                    ))}
                                </select>
                                {devicesLoading ? (
                                    <p className="mt-1 text-sm text-blue-600">
                                        🔄 Sedang memuat daftar devices...
                                    </p>
                                ) : (!devices || devices.length === 0) && (
                                    <div className="mt-1 text-sm text-amber-600">
                                        <p>⚠️ Tidak ada device yang tersedia. Pastikan perangkat ESP32 sudah terhubung.</p>
                                        {onRefreshDevices && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    console.log('Refreshing devices...');
                                                    onRefreshDevices();
                                                }}
                                                className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Refresh Devices
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Jadwal</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newSchedule.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Contoh: Penyiraman Pagi"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Jadwal</label>
                                    <select
                                        name="schedule_type"
                                        value={newSchedule.schedule_type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="one-time">Sekali</option>
                                        <option value="daily">Harian</option>
                                        <option value="weekly">Mingguan</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={newSchedule.start_time}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={newSchedule.end_time}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aksi</label>
                                    <select
                                        name="action_type"
                                        value={newSchedule.action_type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="turn_on">Nyalakan</option>
                                        <option value="turn_off">Matikan</option>
                                        <option value="toggle">Toggle</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={newSchedule.is_active}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Aktifkan jadwal
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {formLoading ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>)}

            {/* Edit Schedule Modal */}
            {showEditModal && editSchedule && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Edit Jadwal</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditSchedule(null);
                                        setFormError(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                                    <p className="text-sm text-red-700">{formError}</p>
                                </div>
                            )}

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                                    <select
                                        name="device_id"
                                        value={editSchedule.device_id}
                                        onChange={handleEditInputChange}
                                        required
                                        disabled={devicesLoading || !devices || devices.length === 0}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {devicesLoading
                                                ? "Memuat devices..."
                                                : (!devices || devices.length === 0)
                                                    ? "Tidak ada device tersedia"
                                                    : "Pilih Device"
                                            }
                                        </option>
                                        {devices && devices.length > 0 && devices.map((device) => (
                                            <option key={device.device_id} value={device.device_id}>
                                                {device.device_name || `Device ${device.device_id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Jadwal</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editSchedule.title}
                                        onChange={handleEditInputChange}
                                        required
                                        placeholder="Contoh: Penyiraman Pagi"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Jadwal</label>
                                    <select
                                        name="schedule_type"
                                        value={editSchedule.schedule_type}
                                        onChange={handleEditInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="one-time">Sekali</option>
                                        <option value="daily">Harian</option>
                                        <option value="weekly">Mingguan</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={editSchedule.start_time}
                                            onChange={handleEditInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={editSchedule.end_time || ''}
                                            onChange={handleEditInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aksi</label>
                                    <select
                                        name="action_type"
                                        value={editSchedule.action_type}
                                        onChange={handleEditInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="turn_on">Nyalakan</option>
                                        <option value="turn_off">Matikan</option>
                                        <option value="toggle">Toggle</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={editSchedule.is_active}
                                        onChange={handleEditInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Aktifkan jadwal
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditSchedule(null);
                                            setFormError(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {formLoading ? 'Menyimpan...' : 'Perbarui'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JadwalSection;
