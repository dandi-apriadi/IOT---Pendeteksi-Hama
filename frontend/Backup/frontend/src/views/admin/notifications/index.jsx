import React, { useState } from "react";
import { FiBell, FiCheckCircle, FiTrash2, FiX, FiAlertTriangle, FiBattery, FiAlertCircle, FiSettings, FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Notifications = () => {
    const [expandedNotif, setExpandedNotif] = useState(null);

    const toggleExpand = (id) => {
        if (expandedNotif === id) {
            setExpandedNotif(null);
        } else {
            setExpandedNotif(id);
        }
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <FiBell className="text-white text-2xl mr-3" />
                        <h6 className="text-white font-semibold text-xl tracking-wide">
                            Notifikasi
                        </h6>
                    </div>
                    <div className="bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-100 animate-pulse mr-2"></div>
                        Pembaruan Terbaru
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                                    3 Belum Dibaca
                                </span>
                            </div>
                            <div className="flex space-x-3">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors duration-200">
                                    <FiCheckCircle className="mr-1.5" />
                                    Tandai semua telah dibaca
                                </button>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors duration-200">
                                    <FiTrash2 className="mr-1.5" />
                                    Hapus semua
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Unread notifications */}
                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => toggleExpand(1)}>
                                <div className="flex justify-between items-start">
                                    <div className={`${expandedNotif === 1 ? 'w-full' : 'w-11/12'}`}>
                                        <div className="flex items-center">
                                            <FiAlertTriangle className="text-red-500 mr-2" />
                                            <h4 className="font-medium text-red-800">Peringatan Deteksi Hama Tinggi</h4>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Aktivitas hama tidak biasa terdeteksi di Lahan A. Pertimbangkan untuk menyemprot segera.
                                        </p>
                                        {expandedNotif === 1 && (
                                            <div className="mt-3 pt-3 border-t border-red-200">
                                                <div className="flex justify-between">
                                                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 flex-1 mr-2">
                                                        <span className="font-medium">Level Hama:</span> Tinggi (8.5/10)
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 flex-1">
                                                        <span className="font-medium">Area Terpengaruh:</span> 3.2 hektar
                                                    </div>
                                                </div>
                                                <div className="flex mt-3">
                                                    <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200 mr-2">
                                                        Lihat Detail
                                                    </button>
                                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200">
                                                        Jadwalkan Penyemprotan
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center mt-2">
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
                                                Hari ini, 08:23
                                            </div>
                                            {expandedNotif === 1 && (
                                                <button className="ml-3 text-xs text-blue-600 hover:text-blue-700">
                                                    Tandai telah dibaca
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {expandedNotif !== 1 && (
                                        <button className="text-gray-400 hover:text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors duration-200">
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => toggleExpand(2)}>
                                <div className="flex justify-between items-start">
                                    <div className={`${expandedNotif === 2 ? 'w-full' : 'w-11/12'}`}>
                                        <div className="flex items-center">
                                            <FiBattery className="text-yellow-500 mr-2" />
                                            <h4 className="font-medium text-yellow-800">Peringatan Baterai Lemah</h4>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Tingkat baterai Perangkat #12 di 15%. Mohon ganti atau isi ulang segera.
                                        </p>
                                        {expandedNotif === 2 && (
                                            <div className="mt-3 pt-3 border-t border-yellow-200">
                                                <div className="flex justify-between">
                                                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 flex-1 mr-2">
                                                        <span className="font-medium">ID Perangkat:</span> #12 (Sensor Lahan A)
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 flex-1">
                                                        <span className="font-medium">Estimasi Waktu:</span> ~2 jam tersisa
                                                    </div>
                                                </div>
                                                <div className="flex mt-3">
                                                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200 mr-2">
                                                        Lihat Lokasi
                                                    </button>
                                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200">
                                                        Tandai Perlu Penggantian
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center mt-2">
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></div>
                                                Hari ini, 09:45
                                            </div>
                                            {expandedNotif === 2 && (
                                                <button className="ml-3 text-xs text-blue-600 hover:text-blue-700">
                                                    Tandai telah dibaca
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {expandedNotif !== 2 && (
                                        <button className="text-gray-400 hover:text-yellow-500 hover:bg-yellow-100 p-1 rounded-full transition-colors duration-200">
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => toggleExpand(3)}>
                                <div className="flex justify-between items-start">
                                    <div className={`${expandedNotif === 3 ? 'w-full' : 'w-11/12'}`}>
                                        <div className="flex items-center">
                                            <FiAlertCircle className="text-red-500 mr-2" />
                                            <h4 className="font-medium text-red-800">Peringatan Malfungsi Penyemprot</h4>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Sistem penyemprotan di Lahan C melaporkan masalah tekanan. Pemeliharaan diperlukan.
                                        </p>
                                        {expandedNotif === 3 && (
                                            <div className="mt-3 pt-3 border-t border-red-200">
                                                <div className="flex justify-between">
                                                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 flex-1 mr-2">
                                                        <span className="font-medium">ID Penyemprot:</span> #7 (Penyemprot Lahan C)
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 flex-1">
                                                        <span className="font-medium">Status:</span> Dalam Perbaikan
                                                    </div>
                                                </div>
                                                <div className="flex mt-3">
                                                    <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200 mr-2">
                                                        Lihat Detail
                                                    </button>
                                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200">
                                                        Jadwalkan Pemeliharaan
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center mt-2">
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
                                                Kemarin
                                            </div>
                                            {expandedNotif === 3 && (
                                                <button className="ml-3 text-xs text-blue-600 hover:text-blue-700">
                                                    Tandai telah dibaca
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {expandedNotif !== 3 && (
                                        <button className="text-gray-400 hover:text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors duration-200">
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Read notifications */}
                            <div className="border-l-4 border-gray-300 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-700">Pemeliharaan Terjadwal Selesai</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Pemeliharaan mingguan untuk semua perangkat telah berhasil diselesaikan.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">20 Okt 2023</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="border-l-4 border-gray-300 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-700">Pembaruan Sistem Tersedia</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Versi firmware baru 2.3.1 tersedia untuk perangkat Anda. Klik untuk memperbarui.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">18 Okt 2023</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-8 bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Menampilkan 5 dari 12 notifikasi</p>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center">
                                    <FiChevronLeft className="mr-1" /> Sebelumnya
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100">3</button>
                                <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center">
                                    Berikutnya <FiChevronRight className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
