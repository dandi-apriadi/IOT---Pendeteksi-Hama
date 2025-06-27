import React, { useState, useEffect } from "react";
import axios from "axios";

const DEVICE_ID = "ESP32-PUMP-01";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const SprayingControl = () => {
    const [pumpStatus, setPumpStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [schedules, setSchedules] = useState([]); // Jadwal dari backend
    const [devices, setDevices] = useState([]);
    const [showAddSchedule, setShowAddSchedule] = useState(false);
    const [addScheduleLoading, setAddScheduleLoading] = useState(false);
    const [addScheduleError, setAddScheduleError] = useState("");
    const [newSchedule, setNewSchedule] = useState({
        device_id: DEVICE_ID,
        title: "",
        schedule_type: "one-time",
        start_time: "",
        end_time: "",
        action_type: "turn_on",
        is_active: true,
    });

    // Fetch pump status periodically
    useEffect(() => {
        let interval = setInterval(fetchPumpStatus, 3000);
        fetchPumpStatus();
        return () => clearInterval(interval);
    }, []);

    // Fetch spraying schedules from backend
    useEffect(() => {
        fetchSchedules();
        fetchDevices();
    }, []);

    const fetchPumpStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/esp32/data`, {
                params: { device_id: DEVICE_ID }
            });
            setPumpStatus(res.data?.data?.pump_status);
        } catch (err) {
            setError("Gagal mengambil status pompa");
        }
    };

    const fetchSchedules = async () => {
        try {
            // Samakan endpoint dan parameter dengan JadwalSection/dashboard
            const res = await axios.get(`${API_BASE}/api/schedules`, {
                // Tidak perlu param device_id jika ingin semua jadwal, atau sesuaikan dengan kebutuhan backend
            });
            console.log("Schedules response:", res);
            setSchedules(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (err) {
            setSchedules([]);
        }
    };

    // Ambil daftar device untuk pilihan device pada jadwal
    const fetchDevices = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/dashboard/devices`);
            setDevices(res.data?.data || []);
        } catch (err) {
            setDevices([]);
        }
    };

    const handlePumpControl = async (action) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await axios.post(`${API_BASE}/api/esp32/command/${DEVICE_ID}`, {
                command: action === "on" ? "pump_on" : "pump_off"
            });
            console.log("Pump control response:", response);
            // Update indicator status sesuai hasil response
            if (action === "on" && response.data?.status === "success") {
                setPumpStatus(true);
            } else if (action === "off" && response.data?.status === "success") {
                setPumpStatus(false);
            }
            // ...success message logic if needed...
        } catch (err) {
            setError("Gagal mengirim perintah ke pompa");
            if (err.response) {
                console.error("Pump control error response:", err.response.data);
            } else {
                console.error("Pump control error:", err);
            }
        }
        setLoading(false);
    };

    // Handler untuk form tambah jadwal
    const handleAddScheduleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewSchedule((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddScheduleSubmit = async (e) => {
        e.preventDefault();
        setAddScheduleLoading(true);
        setAddScheduleError("");
        try {
            // Validasi sederhana
            if (!newSchedule.device_id || !newSchedule.title || !newSchedule.start_time) {
                setAddScheduleError("Semua field wajib diisi.");
                setAddScheduleLoading(false);
                return;
            }
            // Samakan endpoint dengan JadwalSection (biasanya /api/schedules)
            await axios.post(`${API_BASE}/api/schedules`, newSchedule);
            setShowAddSchedule(false);
            setNewSchedule({
                device_id: DEVICE_ID,
                title: "",
                schedule_type: "one-time",
                start_time: "",
                end_time: "",
                action_type: "turn_on",
                is_active: true,
            });
            fetchSchedules();
        } catch (err) {
            setAddScheduleError("Gagal menambah jadwal.");
        }
        setAddScheduleLoading(false);
    };

    // Helper functions for table display (ikuti JadwalSection)
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        // Jika sudah format jam:menit:detik
        if (/^\d{2}:\d{2}/.test(timeString)) {
            return timeString.slice(0, 5);
        }
        // Jika ISO string
        const date = new Date(timeString);
        if (!isNaN(date)) {
            return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        }
        return timeString;
    };
    const getStatusBadge = (isActive) =>
        `px-2 py-1 text-xs font-medium rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`;
    const getScheduleTypeLabel = (type) => {
        if (type === 'one-time') return 'Sekali';
        if (type === 'daily') return 'Harian';
        if (type === 'weekly') return 'Mingguan';
        if (type === 'monthly') return 'Bulanan';
        return type || 'Custom';
    };
    const getActionTypeLabel = (type) => {
        if (type === 'turn_on') return 'Nyalakan';
        if (type === 'turn_off') return 'Matikan';
        if (type === 'toggle') return 'Toggle';
        return type || 'Unknown';
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-purple-500 p-6 mb-8">
                    <h6 className="text-white font-medium text-xl">
                        Kontrol Penyemprotan
                    </h6>
                </div>
                <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Current Status */}
                            <div className="p-4 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Status Saat Ini</h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-gray-500 mb-1">Sistem Penyemprotan</p>
                                        {/* Indikator status pompa: "Nonaktif" atau "Aktif" */}
                                        <span className="font-bold text-xl">
                                            {pumpStatus === null ? "-" : pumpStatus ? "Aktif" : "Nonaktif"}
                                        </span>
                                        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-center space-x-4">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                        onClick={() => handlePumpControl("on")}
                                        disabled={loading || pumpStatus === true}
                                    >
                                        Mulai Penyemprotan
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                        onClick={() => handlePumpControl("off")}
                                        disabled={loading || pumpStatus === false}
                                    >
                                        Hentikan Penyemprotan
                                    </button>
                                </div>
                            </div>

                            {/* Quick Schedule */}
                            <div className="p-4 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Tambah Jadwal</h3>
                                <form onSubmit={handleAddScheduleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                                        <select
                                            name="device_id"
                                            value={newSchedule.device_id}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                            required
                                        >
                                            <option value="">Pilih Device</option>
                                            {devices.map((d) => (
                                                <option key={d.device_id} value={d.device_id}>
                                                    {d.device_name || d.device_id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newSchedule.title}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Jadwal</label>
                                        <select
                                            name="schedule_type"
                                            value={newSchedule.schedule_type}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                        >
                                            <option value="one-time">Sekali</option>
                                            <option value="daily">Harian</option>
                                            <option value="weekly">Mingguan</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                                        <input
                                            type="datetime-local"
                                            name="start_time"
                                            value={newSchedule.start_time}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                                        <input
                                            type="datetime-local"
                                            name="end_time"
                                            value={newSchedule.end_time}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aksi</label>
                                        <select
                                            name="action_type"
                                            value={newSchedule.action_type}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
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
                                            onChange={handleAddScheduleChange}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-gray-700">Aktifkan jadwal</label>
                                    </div>
                                    {addScheduleError && (
                                        <div className="text-red-500 mb-2">{addScheduleError}</div>
                                    )}
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                            disabled={addScheduleLoading}
                                        >
                                            {addScheduleLoading ? "Menyimpan..." : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Spraying Schedule */}
                        <div className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Jadwal Penyemprotan</h3>
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
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {schedules.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-4 text-gray-400">Tidak ada jadwal penyemprotan</td>
                                            </tr>
                                        ) : (
                                            schedules.map((item) => (
                                                <tr key={item.schedule_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.title || '-'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.device?.device_name || `Device ${item.device_id || '-'}`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm text-gray-900">
                                                                {getScheduleTypeLabel(item.schedule_type)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {formatTime(item.start_time)}
                                                                {item.end_time && ` - ${formatTime(item.end_time)}`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">
                                                            {getActionTypeLabel(item.action_type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={getStatusBadge(item.is_active)}>
                                                            {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                                title="Edit"
                                                                // onClick={() => handleEdit(item)}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                                // onClick={() => handleToggleStatus(item.schedule_id)}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                        d={item.is_active ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10 5h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Hapus"
                                                                // onClick={() => handleDelete(item.schedule_id)}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Tombol tambah jadwal */}
                            <div className="mt-4">
                                <button
                                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg"
                                    onClick={() => setShowAddSchedule(true)}
                                >
                                    Tambah Jadwal
                                </button>
                            </div>
                            {/* Form tambah jadwal */}
                            {showAddSchedule && (
                                <form className="mt-4 bg-gray-50 p-4 rounded" onSubmit={handleAddScheduleSubmit}>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                                        <select
                                            name="device_id"
                                            value={newSchedule.device_id}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                            required
                                        >
                                            <option value="">Pilih Device</option>
                                            {devices.map((d) => (
                                                <option key={d.device_id} value={d.device_id}>
                                                    {d.device_name || d.device_id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newSchedule.title}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Jadwal</label>
                                        <select
                                            name="schedule_type"
                                            value={newSchedule.schedule_type}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                        >
                                            <option value="one-time">Sekali</option>
                                            <option value="daily">Harian</option>
                                            <option value="weekly">Mingguan</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                                        <input
                                            type="datetime-local"
                                            name="start_time"
                                            value={newSchedule.start_time}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                                        <input
                                            type="datetime-local"
                                            name="end_time"
                                            value={newSchedule.end_time}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aksi</label>
                                        <select
                                            name="action_type"
                                            value={newSchedule.action_type}
                                            onChange={handleAddScheduleChange}
                                            className="w-full border px-2 py-1 rounded"
                                        >
                                            <option value="turn_on">Nyalakan</option>
                                            <option value="turn_off">Matikan</option>
                                            <option value="toggle">Toggle</option>
                                        </select>
                                    </div>
                                    <div className="mb-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={newSchedule.is_active}
                                            onChange={handleAddScheduleChange}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-gray-700">Aktifkan jadwal</label>
                                    </div>
                                    {addScheduleError && (
                                        <div className="text-red-500 mb-2">{addScheduleError}</div>
                                    )}
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                            disabled={addScheduleLoading}
                                        >
                                            {addScheduleLoading ? "Menyimpan..." : "Simpan"}
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                            onClick={() => setShowAddSchedule(false)}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprayingControl;
