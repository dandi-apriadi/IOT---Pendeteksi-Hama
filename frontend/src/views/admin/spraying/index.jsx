import React from "react";

const SprayingControl = () => {
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
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-gray-500 mb-1">Sistem Penyemprotan</p>
                                        <p className="font-bold text-xl text-green-600">Aktif</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Level Pestisida</p>
                                        <p className="font-bold text-xl">75%</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Cakupan Hari Ini</p>
                                        <p className="font-bold text-xl">2.5 hektar</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-center space-x-4">
                                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                        Mulai Penyemprotan
                                    </button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                        Hentikan Penyemprotan
                                    </button>
                                </div>
                            </div>

                            {/* Quick Schedule */}
                            <div className="p-4 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Jadwal Cepat</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pilih Lahan
                                        </label>
                                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
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
                                        <input
                                            type="datetime-local"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Konsentrasi Pestisida
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                defaultValue="50"
                                                className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">50%</span>
                                        </div>
                                    </div>
                                    <div className="pt-3">
                                        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                            Jadwalkan Penyemprotan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spraying Schedule */}
                        <div className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Jadwal Penyemprotan</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
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
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lahan A</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22 Okt 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08:00</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Terjadwal</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                                <button className="text-red-600 hover:text-red-900">Batalkan</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lahan B</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">23 Okt 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:30</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Terjadwal</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                                <button className="text-red-600 hover:text-red-900">Batalkan</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lahan C</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">21 Okt 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">07:15</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900">Lihat Laporan</button>
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
