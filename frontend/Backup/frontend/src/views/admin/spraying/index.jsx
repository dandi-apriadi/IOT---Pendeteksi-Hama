import React, { useState } from "react";
import { FiPlay, FiPause, FiCalendar, FiDroplet, FiMap, FiCheck, FiX, FiEye } from "react-icons/fi";

const SprayingControl = () => {
    const [pesticideLevel, setPesticideLevel] = useState(50);

    const handlePesticideLevelChange = (e) => {
        setPesticideLevel(e.target.value);
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 mb-8 flex items-center justify-between">
                    <h6 className="text-white font-semibold text-xl tracking-wide">
                        Kontrol Penyemprotan
                    </h6>
                    <div className="bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full">
                        Smart Farming System
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Current Status */}
                            <div className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                    <div className="w-2 h-6 bg-purple-500 rounded mr-2"></div>
                                    Status Saat Ini
                                </h3>
                                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-center">
                                        <p className="text-gray-500 mb-2 text-sm">Sistem Penyemprotan</p>
                                        <div className="flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                            <p className="font-bold text-xl text-green-600">Aktif</p>
                                        </div>
                                    </div>
                                    <div className="h-12 w-px bg-gray-300"></div>
                                    <div className="text-center">
                                        <p className="text-gray-500 mb-2 text-sm">Level Pestisida</p>
                                        <div className="relative w-24 h-6 bg-gray-200 rounded-full mx-auto">
                                            <div
                                                className="absolute top-0 left-0 h-6 bg-blue-500 rounded-full"
                                                style={{ width: '75%' }}
                                            ></div>
                                            <p className="relative font-bold text-sm text-white z-10 text-center leading-6">75%</p>
                                        </div>
                                    </div>
                                    <div className="h-12 w-px bg-gray-300"></div>
                                    <div className="text-center">
                                        <p className="text-gray-500 mb-2 text-sm">Cakupan Hari Ini</p>
                                        <p className="font-bold text-xl flex items-center justify-center">
                                            <FiMap className="mr-1 text-purple-500" />
                                            2.5 hektar
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-center space-x-4">
                                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-5 rounded-lg transition duration-200 flex items-center shadow-sm hover:shadow">
                                        <FiPlay className="mr-2" />
                                        Mulai Penyemprotan
                                    </button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-5 rounded-lg transition duration-200 flex items-center shadow-sm hover:shadow">
                                        <FiPause className="mr-2" />
                                        Hentikan Penyemprotan
                                    </button>
                                </div>
                            </div>

                            {/* Quick Schedule */}
                            <div className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                    <div className="w-2 h-6 bg-purple-500 rounded mr-2"></div>
                                    Jadwal Cepat
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pilih Lahan
                                        </label>
                                        <select className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg transition duration-200 bg-white shadow-sm">
                                            <option>Lahan A</option>
                                            <option>Lahan B</option>
                                            <option>Lahan C</option>
                                            <option>Semua Lahan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal & Waktu Penyemprotan
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiCalendar className="text-gray-400" />
                                            </div>
                                            <input
                                                type="datetime-local"
                                                className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Konsentrasi Pestisida
                                        </label>
                                        <div className="flex items-center">
                                            <FiDroplet className="text-blue-500 mr-2" />
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={pesticideLevel}
                                                onChange={handlePesticideLevelChange}
                                                className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                            />
                                            <span className="ml-3 text-sm bg-purple-100 text-purple-800 font-semibold py-1 px-2 rounded">{pesticideLevel}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pesticideLevel}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow flex items-center justify-center">
                                            <FiCheck className="mr-2" />
                                            Jadwalkan Penyemprotan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spraying Schedule */}
                        <div className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                <div className="w-2 h-6 bg-purple-500 rounded mr-2"></div>
                                Jadwal Penyemprotan
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lahan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lahan A</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22 Okt 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08:00</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Terjadwal</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3 flex items-center">
                                                    <FiEye className="mr-1" /> Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 flex items-center">
                                                    <FiX className="mr-1" /> Batalkan
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lahan B</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">23 Okt 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:30</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Terjadwal</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3 flex items-center">
                                                    <FiEye className="mr-1" /> Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 flex items-center">
                                                    <FiX className="mr-1" /> Batalkan
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lahan C</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">21 Okt 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">07:15</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 flex items-center">
                                                    <FiEye className="mr-1" /> Lihat Laporan
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprayingControl;
