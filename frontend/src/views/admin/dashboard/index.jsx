import React from "react";

const Dashboard = () => {
    return (
        <div className="mt-12">
            {/* Stats Cards */}
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {/* Active Devices */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="text-gray-700 text-lg font-medium">Perangkat Aktif</h6>
                            <div className="rounded-full bg-blue-100 p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-800">18/20</h4>
                        <p className="mt-2 font-normal text-gray-600">90% beroperasi</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Spray Coverage */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="text-gray-700 text-lg font-medium">Cakupan Semprotan</h6>
                            <div className="rounded-full bg-green-100 p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-800">85%</h4>
                        <p className="mt-2 font-normal text-gray-600">+12% minggu ini</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Pest Alerts */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="text-gray-700 text-lg font-medium">Peringatan Hama</h6>
                            <div className="rounded-full bg-red-100 p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-800">7</h4>
                        <p className="mt-2 font-normal text-gray-600">-3% minggu ini</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="text-gray-700 text-lg font-medium">Kesehatan Sistem</h6>
                            <div className="rounded-full bg-purple-100 p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-800">Baik</h4>
                        <p className="mt-2 font-normal text-gray-600">98% waktu aktif</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
                {/* Sensor Readings Chart */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-blue-500 p-4 mb-4">
                        <h6 className="text-white font-medium text-lg">
                            Pembacaan Sensor
                        </h6>
                    </div>
                    <div className="p-4">
                        <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-600">Tempat grafik - Grafik garis menunjukkan suhu, kelembaban, dan deteksi hama</p>
                        </div>
                    </div>
                </div>

                {/* Spraying Schedule */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-green-500 p-4 mb-4">
                        <h6 className="text-white font-medium text-lg">
                            Jadwal Penyemprotan Mendatang
                        </h6>
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                        <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">Lahan A</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">22 Okt</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">08:00 Pagi</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <div className="rounded-full py-1 px-3 text-center bg-green-100">
                                                <p className="text-xs font-semibold text-green-800">Dijadwalkan</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">Lahan B</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">23 Okt</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">09:30 Pagi</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <div className="rounded-full py-1 px-3 text-center bg-green-100">
                                                <p className="text-xs font-semibold text-green-800">Dijadwalkan</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">Lahan C</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">24 Okt</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600">07:00 Pagi</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-gray-200">
                                            <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                                                <p className="text-xs font-semibold text-amber-800">Tertunda</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-5">
                                            <p className="text-xs font-semibold text-gray-600">Lahan D</p>
                                        </td>
                                        <td className="py-3 px-5">
                                            <p className="text-xs font-semibold text-gray-600">25 Okt</p>
                                        </td>
                                        <td className="py-3 px-5">
                                            <p className="text-xs font-semibold text-gray-600">10:00 Pagi</p>
                                        </td>
                                        <td className="py-3 px-5">
                                            <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                                                <p className="text-xs font-semibold text-amber-800">Tertunda</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 p-4">
                        <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Lihat Semua
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                                &lt; Sebelumnya
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                                Selanjutnya &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-red-500 p-4 mb-4">
                    <h6 className="text-white font-medium text-lg">
                        Peringatan Terbaru
                    </h6>
                </div>
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Peringatan</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat Keparahan</th>
                                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600">Deteksi Hama</p>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600">Lahan A</p>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600">Hari ini, 08:23 Pagi</p>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <div className="rounded-full py-1 px-3 text-center bg-red-100">
                                            <p className="text-xs font-semibold text-red-800">Tinggi</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                                            Lihat
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600">Baterai Lemah</p>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600">Perangkat #12</p>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600">Hari ini, 09:45 Pagi</p>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                                            <p className="text-xs font-semibold text-amber-800">Sedang</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 border-b border-gray-200">
                                        <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                                            Lihat
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-5">
                                        <p className="text-xs font-semibold text-gray-600">Kerusakan Semprotan</p>
                                    </td>
                                    <td className="py-3 px-5">
                                        <p className="text-xs font-semibold text-gray-600">Lahan C</p>
                                    </td>
                                    <td className="py-3 px-5">
                                        <p className="text-xs font-semibold text-gray-600">Kemarin</p>
                                    </td>
                                    <td className="py-3 px-5">
                                        <div className="rounded-full py-1 px-3 text-center bg-red-100">
                                            <p className="text-xs font-semibold text-red-800">Tinggi</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-5">
                                        <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                                            Lihat
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Menampilkan 3 dari 7 peringatan</p>
                    <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Lihat Semua Peringatan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
