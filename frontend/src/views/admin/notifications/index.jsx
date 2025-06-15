import React, { useState } from "react";

const Notifications = () => {
    // Dummy data for notification settings
    const [notificationMethods, setNotificationMethods] = useState({
        email: true,
        whatsapp: false
    });    // Dummy user email and phone
    const [userContact, setUserContact] = useState({
        email: "user@example.com",
        emailPassword: "password123",
        phone: "+62812345678"
    });

    // Handle toggling notification methods
    const handleToggleMethod = (method) => {
        setNotificationMethods({
            ...notificationMethods,
            [method]: !notificationMethods[method]
        });
    };

    // Handle saving contact information
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setUserContact({
            ...userContact,
            [name]: value
        });
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            {/* Notifications Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-red-500 p-6 mb-8">
                    <h6 className="text-white font-medium text-xl">
                        Notifikasi
                    </h6>
                </div>
                <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">3 Belum Dibaca</span>
                            </div>
                            <div className="flex space-x-2">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                    Tandai semua telah dibaca
                                </button>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
                                    Hapus semua
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Unread notifications */}
                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-red-800">Peringatan Deteksi Hama Tinggi</h4>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Aktivitas hama tidak biasa terdeteksi di Lahan A. Pertimbangkan untuk menyemprot segera.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Hari ini, 08:23</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-yellow-800">Peringatan Baterai Lemah</h4>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Tingkat baterai Perangkat #12 di 15%. Mohon ganti atau isi ulang segera.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Hari ini, 09:45</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-red-800">Peringatan Malfungsi Penyemprot</h4>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Sistem penyemprotan di Lahan C melaporkan masalah tekanan. Pemeliharaan diperlukan.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Kemarin</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Read notifications */}
                            <div className="border-l-4 border-gray-300 p-4 rounded-r-lg">
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

                            <div className="border-l-4 border-gray-300 p-4 rounded-r-lg">
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
                        <div className="flex justify-between items-center mt-6">
                            <p className="text-sm text-gray-600">Menampilkan 5 dari 12 notifikasi</p>
                            <div className="flex space-x-1">
                                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Sebelumnya</button>
                                <button className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600">1</button>
                                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">2</button>
                                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">3</button>
                                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Berikutnya</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Settings Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-red-500 p-6 mb-4">
                    <h6 className="text-white font-medium text-xl">
                        Pengaturan Metode Notifikasi
                    </h6>
                </div>
                <div className="px-6 pb-6">
                    <p className="text-gray-700 mb-4">Atur bagaimana Anda ingin menerima pemberitahuan dari sistem.</p>

                    {/* Notification Methods Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Metode Notifikasi</h3>
                        <div className="space-y-3">
                            {/* Email Option */}
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-800">Email</h4>
                                    <p className="text-sm text-gray-600">Terima pemberitahuan melalui email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={notificationMethods.email}
                                        onChange={() => handleToggleMethod('email')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                </label>
                            </div>

                            {/* WhatsApp Option */}
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-800">WhatsApp</h4>
                                    <p className="text-sm text-gray-600">Terima pemberitahuan melalui WhatsApp</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={notificationMethods.whatsapp}
                                        onChange={() => handleToggleMethod('whatsapp')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Informasi Kontak</h3>
                        <div className="space-y-4">                            <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={userContact.email}
                                onChange={handleContactChange}
                                disabled={!notificationMethods.email}
                            />
                        </div>

                            <div>
                                <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Email</label>
                                <input
                                    type="password"
                                    id="emailPassword"
                                    name="emailPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    value={userContact.emailPassword}
                                    onChange={handleContactChange}
                                    disabled={!notificationMethods.email}
                                />
                                <p className="text-xs text-gray-500 mt-1">Password untuk akun email yang akan digunakan untuk mengirim notifikasi</p>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    value={userContact.phone}
                                    onChange={handleContactChange}
                                    disabled={!notificationMethods.whatsapp}
                                />
                            </div>

                            <button
                                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Simpan Pengaturan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
