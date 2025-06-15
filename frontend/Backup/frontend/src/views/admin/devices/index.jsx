import React, { useState } from "react";

const DeviceManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedDevice, setSelectedDevice] = useState(null);

    return (
        <div className="bg-gray-50 min-h-screen pb-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg rounded-b-2xl overflow-hidden mb-6">
                <div className="px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Manajemen Perangkat</h2>
                            <p className="text-indigo-100">Kelola dan monitor semua perangkat IoT dalam satu dashboard</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                            <button className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Tambah Perangkat
                            </button>
                            <button className="flex items-center bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="px-6 py-3 bg-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="w-full sm:w-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari perangkat..."
                            className="w-full sm:w-64 bg-white/20 text-white placeholder-white/70 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>

                    <div className="flex w-full sm:w-auto gap-2 flex-wrap">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white/20 text-white rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none"
                        >
                            <option value="all" className="text-gray-800">Semua Status</option>
                            <option value="active" className="text-gray-800">Aktif</option>
                            <option value="inactive" className="text-gray-800">Tidak Aktif</option>
                            <option value="maintenance" className="text-gray-800">Pemeliharaan</option>
                        </select>

                        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto px-4">
                {/* Device Status Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-green-50">
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Perangkat Online</h3>
                                <p className="text-xl font-semibold text-gray-800">15 Unit</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-red-50">
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Perangkat Offline</h3>
                                <p className="text-xl font-semibold text-gray-800">3 Unit</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-yellow-50">
                                <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Perlu Perhatian</h3>
                                <p className="text-xl font-semibold text-gray-800">2 Unit</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-indigo-50">
                                <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Konsumsi Daya</h3>
                                <p className="text-xl font-semibold text-gray-800">1.8 kWh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Device List */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Daftar Perangkat</h3>
                        <div className="flex items-center space-x-2">
                            <button className="text-xs text-gray-500 hover:text-gray-800 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Urutkan
                            </button>
                            <button className="text-xs text-gray-500 hover:text-gray-800 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                        Perangkat & ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Jenis
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Baterai
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Terakhir Aktif
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDevice('sensor-a1')}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Sensor Lapangan A1</div>
                                                <div className="text-xs text-gray-500">ID: DEV-SEN-001</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">Sensor Suhu & Kelembaban</div>
                                        <div className="text-xs text-gray-500">v2.4</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-grow h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "82%" }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">82%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                            <span>2 menit yang lalu</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2.5 py-1 transition-colors">Detail</button>
                                        <button className="ml-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md px-2.5 py-1 transition-colors">Konfigurasi</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDevice('sprayer-b2')}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Unit Penyemprot B2</div>
                                                <div className="text-xs text-gray-500">ID: DEV-SPR-002</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">Penyemprot Otomatis</div>
                                        <div className="text-xs text-gray-500">v3.1</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-grow h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">45%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                            <span>15 menit yang lalu</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2.5 py-1 transition-colors">Detail</button>
                                        <button className="ml-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md px-2.5 py-1 transition-colors">Konfigurasi</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDevice('weather-c3')}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Stasiun Cuaca C3</div>
                                                <div className="text-xs text-gray-500">ID: DEV-WTH-003</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">Sistem Monitor Cuaca</div>
                                        <div className="text-xs text-gray-500">v1.8</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Tidak Aktif
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-grow h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "12%" }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">12%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                                            <span>2 hari yang lalu</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2.5 py-1 transition-colors">Detail</button>
                                        <button className="ml-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md px-2.5 py-1 transition-colors">Konfigurasi</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDevice('soil-d4')}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Sensor Tanah D4</div>
                                                <div className="text-xs text-gray-500">ID: DEV-SOIL-004</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">Sensor Kelembaban Tanah</div>
                                        <div className="text-xs text-gray-500">v2.0</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Pemeliharaan
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-grow h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "38%" }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">38%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                                            <span>6 jam yang lalu</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2.5 py-1 transition-colors">Detail</button>
                                        <button className="ml-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md px-2.5 py-1 transition-colors">Konfigurasi</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan 4 dari 20 perangkat
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 bg-gray-100 rounded-md text-gray-700 text-sm hover:bg-gray-200 disabled:opacity-50" disabled>
                                Sebelumnya
                            </button>
                            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                                2
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                                3
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200">
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 flex items-center">
                            <div className="bg-white/20 p-3 rounded-full">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white ml-3">Pengaturan Cepat</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs font-medium text-gray-500 mb-1 block">Mode Hemat Energi</span>
                                    <div className="flex items-center">
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle-energy" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer peer checked:right-0 checked:border-green-500" />
                                            <label htmlFor="toggle-energy" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-green-500"></label>
                                        </div>
                                        <label htmlFor="toggle-energy" className="text-sm text-gray-700 cursor-pointer">Aktif</label>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500 mb-1 block">Pembaruan Otomatis</span>
                                    <div className="flex items-center">
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle-update" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer peer checked:right-0 checked:border-green-500" />
                                            <label htmlFor="toggle-update" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-green-500"></label>
                                        </div>
                                        <label htmlFor="toggle-update" className="text-sm text-gray-700 cursor-pointer">Aktif</label>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500 mb-1 block">Notifikasi Alert</span>
                                    <div className="flex items-center">
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle-alert" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer peer checked:right-0 checked:border-green-500" defaultChecked />
                                            <label htmlFor="toggle-alert" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-green-500"></label>
                                        </div>
                                        <label htmlFor="toggle-alert" className="text-sm text-gray-700 cursor-pointer">Aktif</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center">
                            <div className="bg-white/20 p-3 rounded-full">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white ml-3">Status Pemeliharaan</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">Perangkat memerlukan perawatan</div>
                                    <span className="text-sm font-semibold text-purple-600">1 unit</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">Perangkat baterai lemah (&lt;20%)</div>
                                    <span className="text-sm font-semibold text-purple-600">2 unit</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">Perangkat memerlukan kalibrasi</div>
                                    <span className="text-sm font-semibold text-purple-600">3 unit</span>
                                </div>
                                <div className="mt-2 pt-2 border-t">
                                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition duration-300">
                                        Lihat Semua Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 flex items-center">
                            <div className="bg-white/20 p-3 rounded-full">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white ml-3">Aksi Cepat</h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2">
                                <button className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Mulai Ulang</span>
                                </button>
                                <button className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Matikan</span>
                                </button>
                                <button className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Update</span>
                                </button>
                                <button className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Backup</span>
                                </button>
                            </div>
                            <button className="mt-3 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-md text-sm font-medium hover:from-green-600 hover:to-teal-600 transition duration-300">
                                Tambah Perangkat Baru
                            </button>
                        </div>
                    </div>
                </div>

                {/* Device Details Section - Conditionally rendered */}
                {selectedDevice && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-indigo-100 animate-fadeIn">
                        <div className="bg-indigo-500 p-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">Detail Perangkat</h3>
                            <button
                                onClick={() => setSelectedDevice(null)}
                                className="text-white hover:text-indigo-100"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="text-sm text-gray-500 mb-4">
                                Menampilkan detail untuk perangkat yang dipilih. Di sini Anda dapat menyesuaikan pengaturan dan melihat informasi lebih lanjut.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Informasi Dasar</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Nama Perangkat:</span>
                                            <span className="font-medium text-gray-800">
                                                {selectedDevice === 'sensor-a1' ? 'Sensor Lapangan A1' :
                                                    selectedDevice === 'sprayer-b2' ? 'Unit Penyemprot B2' :
                                                        selectedDevice === 'weather-c3' ? 'Stasiun Cuaca C3' :
                                                            'Sensor Tanah D4'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">ID Perangkat:</span>
                                            <span className="font-medium text-gray-800">
                                                {selectedDevice === 'sensor-a1' ? 'DEV-SEN-001' :
                                                    selectedDevice === 'sprayer-b2' ? 'DEV-SPR-002' :
                                                        selectedDevice === 'weather-c3' ? 'DEV-WTH-003' :
                                                            'DEV-SOIL-004'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Jenis Perangkat:</span>
                                            <span className="font-medium text-gray-800">
                                                {selectedDevice === 'sensor-a1' ? 'Sensor Suhu & Kelembaban' :
                                                    selectedDevice === 'sprayer-b2' ? 'Penyemprot Otomatis' :
                                                        selectedDevice === 'weather-c3' ? 'Sistem Monitor Cuaca' :
                                                            'Sensor Kelembaban Tanah'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Versi Firmware:</span>
                                            <span className="font-medium text-gray-800">
                                                {selectedDevice === 'sensor-a1' ? 'v2.4' :
                                                    selectedDevice === 'sprayer-b2' ? 'v3.1' :
                                                        selectedDevice === 'weather-c3' ? 'v1.8' :
                                                            'v2.0'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tanggal Instalasi:</span>
                                            <span className="font-medium text-gray-800">15 Juni 2023</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Pengaturan Perangkat</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="update-interval" className="block text-xs font-medium text-gray-500 mb-1">
                                                Interval Update
                                            </label>
                                            <select id="update-interval" className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                                <option>5 menit</option>
                                                <option>10 menit</option>
                                                <option>15 menit</option>
                                                <option>30 menit</option>
                                                <option>1 jam</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="sensitivity" className="block text-xs font-medium text-gray-500 mb-1">
                                                Sensitivitas
                                            </label>
                                            <div className="flex items-center">
                                                <input type="range" id="sensitivity" min="1" max="10" defaultValue="7"
                                                    className="appearance-none h-2 w-full bg-gray-200 rounded-lg accent-indigo-600 cursor-pointer" />
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Rendah</span>
                                                <span>Tinggi</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-500">Mode Hemat Energi</span>
                                            <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                                <input type="checkbox" name="toggle-energy-save" id="toggle-energy-save" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer peer checked:right-0 checked:border-green-500" />
                                                <label htmlFor="toggle-energy-save" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-green-500"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                    Batal
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add some CSS for toggle and animation */}
            <style jsx>{`
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #10B981;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DeviceManagement;
