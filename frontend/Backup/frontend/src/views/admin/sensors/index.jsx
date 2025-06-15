import React, { useState } from "react";

const SensorData = () => {
    const [timeRange, setTimeRange] = useState('today');
    const [selectedLocation, setSelectedLocation] = useState('all');

    return (
        <div className="bg-gray-50 min-h-screen pb-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg rounded-b-2xl overflow-hidden mb-6">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Monitoring Sensor</h2>
                            <p className="text-blue-100">Pantau kondisi lahan pertanian secara real-time</p>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1.5 rounded-lg">
                                <svg className="h-4 w-4 text-blue-100 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition duration-150">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition duration-150">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="px-6 py-3 bg-white bg-opacity-10 flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap items-center space-x-4">
                        <div className="relative">
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="appearance-none bg-white bg-opacity-20 text-white text-sm rounded-lg focus:ring-2 focus:ring-white/50 py-2 pl-3 pr-10 outline-none"
                            >
                                <option value="all" className="text-gray-700">Semua Lokasi</option>
                                <option value="lahan-a" className="text-gray-700">Lahan A</option>
                                <option value="lahan-b" className="text-gray-700">Lahan B</option>
                                <option value="lahan-c" className="text-gray-700">Lahan C</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-white text-sm">
                            <button
                                onClick={() => setTimeRange('today')}
                                className={`px-3 py-1 rounded-md ${timeRange === 'today' ? 'bg-white bg-opacity-30' : 'bg-transparent hover:bg-white hover:bg-opacity-10'}`}
                            >
                                Hari Ini
                            </button>
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-3 py-1 rounded-md ${timeRange === 'week' ? 'bg-white bg-opacity-30' : 'bg-transparent hover:bg-white hover:bg-opacity-10'}`}
                            >
                                Minggu Ini
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-3 py-1 rounded-md ${timeRange === 'month' ? 'bg-white bg-opacity-30' : 'bg-transparent hover:bg-white hover:bg-opacity-10'}`}
                            >
                                Bulan Ini
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 sm:mt-0">
                        <button className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-all">
                            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Export Data
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto px-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Total Sensor</h3>
                                <p className="text-xl font-semibold text-gray-800">8 Unit</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-green-50">
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Sensor Online</h3>
                                <p className="text-xl font-semibold text-gray-800">7 Unit</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-amber-50">
                                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Alert Hari Ini</h3>
                                <p className="text-xl font-semibold text-gray-800">2 Alert</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-purple-50">
                                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v-2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-400">Terakhir Update</h3>
                                <p className="text-xl font-semibold text-gray-800">2 menit lalu</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensor Reading Panels - Enhanced */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* <div className="md:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-500 p-4">
                            <h3 className="text-lg font-medium text-white">Pembacaan Suhu</h3>
                        </div>
                        <div className="p-4">
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Grafik Suhu (24 Jam Terakhir)</p>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                                <span className="text-2xl font-bold text-blue-600">28°</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Suhu Saat Ini</p>
                                                <div className="flex items-center text-green-600">
                                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                    <span className="text-xs font-medium">1.2° dari kemarin</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                <span className="text-xs text-gray-600">Normal</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">Hari Ini</p>
                                    <div className="flex space-x-6 mt-2">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Min</p>
                                            <p className="font-bold text-blue-600">22°C</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Maks</p>
                                            <p className="font-bold text-red-500">34°C</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Rata-rata</p>
                                            <p className="font-bold text-indigo-600">26°C</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Histori Lengkap
                                </button>
                            </div>
                        </div>
                    </div> */}

                    {/* <div className="md:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-teal-500 p-4">
                            <h3 className="text-lg font-medium text-white">Pembacaan Kelembaban</h3>
                        </div>
                        <div className="p-4">
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-green-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Grafik Kelembaban (24 Jam Terakhir)</p>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                                                <span className="text-2xl font-bold text-teal-600">65%</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Kelembaban Saat Ini</p>
                                                <div className="flex items-center text-blue-600">
                                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                    <span className="text-xs font-medium">3% dari kemarin</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1">
                                                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                                <span className="text-xs text-gray-600">Optimal</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">Hari Ini</p>
                                    <div className="flex space-x-6 mt-2">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Min</p>
                                            <p className="font-bold text-orange-500">45%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Maks</p>
                                            <p className="font-bold text-teal-500">85%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Rata-rata</p>
                                            <p className="font-bold text-teal-600">62%</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                                    Histori Lengkap
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Soil Moisture and Light Intensity Panels */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="md:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-green-500 p-4">
                            <h3 className="text-lg font-medium text-white">Kelembaban Tanah</h3>
                        </div>
                        <div className="p-4">
                            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                {/* Placeholder for chart */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Grafik Kelembaban Tanah</p>
                                </div>

                                {/* Gauge display */}
                                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-xl font-bold text-green-600">78%</span>
                                            <span className="text-xs text-gray-600 ml-1">Saat Ini</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span className="text-xs text-gray-600">Baik</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-amber-500 p-4">
                            <h3 className="text-lg font-medium text-white">Intensitas Cahaya</h3>
                        </div>
                        <div className="p-4">
                            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                {/* Placeholder for chart */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Grafik Intensitas Cahaya</p>
                                </div>

                                {/* Gauge display */}
                                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-xl font-bold text-amber-600">12.5k</span>
                                            <span className="text-xs text-gray-600 ml-1">lux</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1">
                                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                                <span className="text-xs text-gray-600">Cerah</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensor History Table - Enhanced */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-indigo-500 p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">Riwayat Pembacaan Sensor</h3>
                            <div className="flex space-x-2">
                                <select className="text-xs bg-white/20 text-white rounded-md border-0 px-2 py-1 outline-none">
                                    <option value="all" className="text-gray-800">Semua Sensor</option>
                                    {/* <option value="temperature" className="text-gray-800">Suhu</option> */}
                                    {/* <option value="humidity" className="text-gray-800">Kelembaban</option> */}
                                    <option value="soil" className="text-gray-800">Kelembaban Tanah</option>
                                    <option value="light" className="text-gray-800">Cahaya</option>
                                </select>
                                <select className="text-xs bg-white/20 text-white rounded-md border-0 px-2 py-1 outline-none">
                                    <option value="all" className="text-gray-800">Semua Status</option>
                                    <option value="normal" className="text-gray-800">Normal</option>
                                    <option value="warning" className="text-gray-800">Peringatan</option>
                                    <option value="critical" className="text-gray-800">Kritis</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span>22 Oct 2023</span>
                                                <span className="text-xs text-gray-400">14:23:12</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                                                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">Suhu</p>
                                                    <p className="text-xs text-gray-500">ID: A1-TEMP</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lahan A - Zona 1</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">28.5°C</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Lihat</button>
                                            <button className="text-gray-600 hover:text-gray-900">Riwayat</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span>22 Oct 2023</span>
                                                <span className="text-xs text-gray-400">14:22:34</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-teal-100 flex items-center justify-center">
                                                    <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4V5l8 4 8-4v2z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">Kelembaban</p>
                                                    <p className="text-xs text-gray-500">ID: A1-HUM</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lahan A - Zona 1</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">67%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Lihat</button>
                                            <button className="text-gray-600 hover:text-gray-900">Riwayat</button>
                                        </td>
                                    </tr> */}
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span>22 Oct 2023</span>
                                                <span className="text-xs text-gray-400">14:20:18</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
                                                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">Kelembaban Tanah</p>
                                                    <p className="text-xs text-gray-500">ID: B2-SOIL</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lahan B - Zona 2</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">82%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Tinggi</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Lihat</button>
                                            <button className="text-gray-600 hover:text-gray-900">Riwayat</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-600">Menampilkan 3 dari 36 data</p>
                            <div className="flex items-center space-x-2">
                                <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">Previous</button>
                                <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium">1</button>
                                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">2</button>
                                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">3</button>
                                <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensor Status Summary - Replacement for map */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-indigo-700 p-4">
                        <h3 className="text-lg font-medium text-white">Status Semua Sensor</h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Lahan A</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Suhu</span>
                                        </div>
                                        <span className="text-sm font-medium">28.5°C</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Kelembaban</span>
                                        </div>
                                        <span className="text-sm font-medium">67%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Tanah</span>
                                        </div>
                                        <span className="text-sm font-medium">72%</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Terakhir update: 2 menit lalu</span>
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800">Detail</button>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Lahan B</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Suhu</span>
                                        </div>
                                        <span className="text-sm font-medium">27.2°C</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Kelembaban</span>
                                        </div>
                                        <span className="text-sm font-medium">45%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Tanah</span>
                                        </div>
                                        <span className="text-sm font-medium">82%</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Terakhir update: 5 menit lalu</span>
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800">Detail</button>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Lahan C</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Suhu</span>
                                        </div>
                                        <span className="text-sm font-medium">31.8°C</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Kelembaban</span>
                                        </div>
                                        <span className="text-sm font-medium">68%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                                            <span className="text-sm text-gray-600">Sensor Tanah</span>
                                        </div>
                                        <span className="text-sm text-gray-400">Offline</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Terakhir update: 8 menit lalu</span>
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800">Detail</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                                Lihat Semua Status Sensor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sensor Alert Summary */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-red-500 p-4">
                        <h3 className="text-lg font-medium text-white">Peringatan Sensor Terkini</h3>
                    </div>
                    <div className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center p-3 border rounded-lg bg-red-50">
                                <div className="p-2 rounded-full bg-red-100 text-red-500 mr-3">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800">Suhu terlalu tinggi di Lahan C</h4>
                                    <p className="text-xs text-gray-500">22 October 2023, 12:45 PM</p>
                                </div>
                                <div>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Kritis</span>
                                </div>
                            </div>

                            <div className="flex items-center p-3 border rounded-lg bg-yellow-50">
                                <div className="p-2 rounded-full bg-yellow-100 text-yellow-500 mr-3">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800">Kelembaban tanah tinggi di Lahan B</h4>
                                    <p className="text-xs text-gray-500">22 October 2023, 11:20 AM</p>
                                </div>
                                <div>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Peringatan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SensorData;
