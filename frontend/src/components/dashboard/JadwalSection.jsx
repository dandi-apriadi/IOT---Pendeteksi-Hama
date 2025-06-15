import React, { useState, useEffect } from "react";

const JadwalSection = () => {
    // State for schedule data - would typically come from an API in a real implementation
    const [schedules, setSchedules] = useState([]);
    const [timeFilter, setTimeFilter] = useState('today');
    const [statusFilter, setStatusFilter] = useState('scheduled');
    const [loading, setLoading] = useState(false);

    // Mock schedule data - replace with real API data
    useEffect(() => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const mockSchedules = [
                {
                    id: 'SCH-001',
                    activity: 'Penyemprotan',
                    location: 'Lahan A',
                    date: '2023-10-22',
                    startTime: '08:00',
                    endTime: '09:30',
                    device: 'DEV-001',
                    status: 'scheduled'
                },
                {
                    id: 'SCH-002',
                    activity: 'Penyemprotan',
                    location: 'Lahan B',
                    date: '2023-10-23',
                    startTime: '09:30',
                    endTime: '11:00',
                    device: 'DEV-001',
                    status: 'scheduled'
                },
                {
                    id: 'SCH-003',
                    activity: 'Pemantauan',
                    location: 'Lahan C',
                    date: '2023-10-24',
                    startTime: '07:00',
                    endTime: '08:30',
                    device: 'DEV-003',
                    status: 'pending'
                },
                {
                    id: 'SCH-004',
                    activity: 'Pemupukan',
                    location: 'Lahan D',
                    date: '2023-10-25',
                    startTime: '08:30',
                    endTime: '10:00',
                    device: 'DEV-002',
                    status: 'completed'
                }
            ];

            setSchedules(mockSchedules);
            setLoading(false);
        }, 500);
    }, []);

    // Filter schedules based on selected filters
    const filteredSchedules = schedules.filter(schedule => {
        // Time filter
        if (timeFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            if (schedule.date !== today) return false;
        } else if (timeFilter === 'week') {
            const today = new Date();
            const scheduleDate = new Date(schedule.date);
            const diffTime = Math.abs(scheduleDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 7) return false;
        } else if (timeFilter === 'month') {
            const today = new Date();
            const scheduleDate = new Date(schedule.date);
            if (scheduleDate.getMonth() !== today.getMonth() ||
                scheduleDate.getFullYear() !== today.getFullYear()) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && schedule.status !== statusFilter) return false;

        return true;
    });

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-orange-500 p-4 mb-4">
                <h6 className="text-white font-medium text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10" />
                    </svg>
                    Jadwal Detil
                </h6>
            </div>
            <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter Waktu</h3>
                        <div className="flex gap-2">
                            <button
                                className={`px-3 py-1.5 ${timeFilter === 'today' ? 'bg-orange-100 text-orange-700' : 'border border-gray-300 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setTimeFilter('today')}
                            >
                                Hari Ini
                            </button>
                            <button
                                className={`px-3 py-1.5 ${timeFilter === 'week' ? 'bg-orange-100 text-orange-700' : 'border border-gray-300 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setTimeFilter('week')}
                            >
                                Minggu Ini
                            </button>
                            <button
                                className={`px-3 py-1.5 ${timeFilter === 'month' ? 'bg-orange-100 text-orange-700' : 'border border-gray-300 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setTimeFilter('month')}
                            >
                                Bulan Ini
                            </button>
                            <button
                                className={`px-3 py-1.5 ${timeFilter === 'all' ? 'bg-orange-100 text-orange-700' : 'border border-gray-300 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setTimeFilter('all')}
                            >
                                Semua
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter Status</h3>
                        <div className="flex gap-2">
                            <button
                                className={`px-3 py-1.5 ${statusFilter === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setStatusFilter('scheduled')}
                            >
                                Dijadwalkan
                            </button>
                            <button
                                className={`px-3 py-1.5 ${statusFilter === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setStatusFilter('pending')}
                            >
                                Tertunda
                            </button>
                            <button
                                className={`px-3 py-1.5 ${statusFilter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setStatusFilter('completed')}
                            >
                                Selesai
                            </button>
                            <button
                                className={`px-3 py-1.5 ${statusFilter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'} text-xs font-medium rounded-md`}
                                onClick={() => setStatusFilter('all')}
                            >
                                Semua
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : filteredSchedules.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Jadwal</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Aktivitas</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perangkat</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">{schedule.id}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">{schedule.activity}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">{schedule.location}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">
                                                {new Date(schedule.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">{schedule.startTime} - {schedule.endTime}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">{schedule.device}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <div className={`rounded-full py-1 px-3 text-center ${schedule.status === 'scheduled' ? 'bg-green-100' :
                                                    schedule.status === 'pending' ? 'bg-amber-100' : 'bg-blue-100'
                                                }`}>
                                                <p className={`text-xs font-semibold ${schedule.status === 'scheduled' ? 'text-green-800' :
                                                        schedule.status === 'pending' ? 'text-amber-800' : 'text-blue-800'
                                                    }`}>
                                                    {schedule.status === 'scheduled' ? 'Dijadwalkan' :
                                                        schedule.status === 'pending' ? 'Tertunda' : 'Selesai'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <button className="p-1 text-blue-600 hover:text-blue-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button className="p-1 text-red-600 hover:text-red-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-gray-50 py-10 text-center rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h2 className="mt-2 text-lg font-medium text-gray-900">Tidak ada jadwal</h2>
                        <p className="mt-1 text-sm text-gray-500">Tidak ditemukan jadwal yang sesuai dengan filter yang dipilih.</p>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <button className="px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all">
                        Tambah Jadwal Baru
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Halaman 1 dari 1</span>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                            <button className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed border-r border-gray-300">
                                &lt;
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JadwalSection;
