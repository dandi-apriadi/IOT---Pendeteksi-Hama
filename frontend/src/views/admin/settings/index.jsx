import React, { useState } from "react";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("general");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-700 p-6 mb-8">
                    <h6 className="text-white font-medium text-xl">
                        Pengaturan Sistem
                    </h6>
                </div>
                <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                        {/* Settings Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("general"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm ${activeTab === "general" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    Umum
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("notifications"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm ${activeTab === "notifications" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    Notifikasi
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("security"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm ${activeTab === "security" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    Keamanan
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("advanced"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm ${activeTab === "advanced" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    Lanjutan
                                </a>
                            </nav>
                        </div>

                        {/* General Settings Form */}
                        {activeTab === "general" && (
                            <form className="py-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-5">Pengaturan Umum</h3>
                                <div className="space-y-6">
                                    {/* System Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nama Sistem</label>
                                            <p className="text-sm text-gray-500">Nama sistem pengendalian hama padi Anda.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                defaultValue="Rice Guardian Pro"
                                            />
                                        </div>
                                    </div>

                                    {/* Timezone */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Zona Waktu</label>
                                            <p className="text-sm text-gray-500">Pilih zona waktu lokal Anda untuk penjadwalan yang akurat.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                <option>(GMT+07:00) Jakarta</option>
                                                <option>(GMT+08:00) Singapura</option>
                                                <option>(GMT+09:00) Tokyo</option>
                                                <option>(GMT+10:00) Sydney</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Units */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Satuan</label>
                                            <p className="text-sm text-gray-500">Pilih satuan pengukuran yang Anda inginkan.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm text-gray-700">Suhu</label>
                                                    <div className="mt-1 flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                id="celsius"
                                                                name="temperature"
                                                                type="radio"
                                                                defaultChecked
                                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                            />
                                                            <label htmlFor="celsius" className="ml-2 block text-sm text-gray-700">
                                                                Celsius (°C)
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                id="fahrenheit"
                                                                name="temperature"
                                                                type="radio"
                                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                            />
                                                            <label htmlFor="fahrenheit" className="ml-2 block text-sm text-gray-700">
                                                                Fahrenheit (°F)
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-700">Jarak</label>
                                                    <div className="mt-1 flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                id="metric"
                                                                name="distance"
                                                                type="radio"
                                                                defaultChecked
                                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                            />
                                                            <label htmlFor="metric" className="ml-2 block text-sm text-gray-700">
                                                                Metrik (m, km)
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                id="imperial"
                                                                name="distance"
                                                                type="radio"
                                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                            />
                                                            <label htmlFor="imperial" className="ml-2 block text-sm text-gray-700">
                                                                Imperial (kaki, mil)
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Auto Updates */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Pembaruan Otomatis</label>
                                            <p className="text-sm text-gray-500">Konfigurasi pembaruan sistem otomatis.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="flex items-center">
                                                <input
                                                    id="auto-updates"
                                                    name="auto-updates"
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="auto-updates" className="ml-2 block text-sm text-gray-700">
                                                    Perbarui sistem secara otomatis saat versi baru tersedia
                                                </label>
                                            </div>
                                            <div className="mt-2 flex items-center">
                                                <input
                                                    id="auto-restart"
                                                    name="auto-restart"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="auto-restart" className="ml-2 block text-sm text-gray-700">
                                                    Izinkan mulai ulang otomatis setelah pembaruan
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Retention */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Penyimpanan Data</label>
                                            <p className="text-sm text-gray-500">Konfigurasi berapa lama data disimpan dalam sistem.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm text-gray-700">Data Sensor</label>
                                                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                        <option>30 hari</option>
                                                        <option>60 hari</option>
                                                        <option>90 hari</option>
                                                        <option>1 tahun</option>
                                                        <option>Selamanya</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-700">Log Sistem</label>
                                                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                        <option>7 hari</option>
                                                        <option>14 hari</option>
                                                        <option>30 hari</option>
                                                        <option>90 hari</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* API Access */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Akses API</label>
                                            <p className="text-sm text-gray-500">Konfigurasi akses API untuk sistem eksternal.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                                <div className="flex items-center">
                                                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                        <input
                                                            id="enable-api"
                                                            name="enable-api"
                                                            type="checkbox"
                                                            defaultChecked
                                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                                                        />
                                                        <label
                                                            htmlFor="enable-api"
                                                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                                        ></label>
                                                    </div>
                                                    <label htmlFor="enable-api" className="ml-2 text-sm font-medium text-gray-700">
                                                        Aktifkan akses API
                                                    </label>
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kunci API</label>
                                                    <div className="flex rounded-md shadow-sm">
                                                        <div className="relative flex-grow">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value="a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
                                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md bg-white border border-gray-300 text-gray-700 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                                title="Salin ke clipboard"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gradient-to-b from-white to-gray-100 text-sm font-medium rounded-r-md text-gray-700 hover:bg-gray-50 hover:from-gray-50 hover:to-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                            </svg>
                                                            Regenerasi
                                                        </button>
                                                    </div>
                                                    <p className="mt-1.5 text-xs text-gray-500">Terakhir dibuat: 2023-09-15 • Kunci ini memberikan akses penuh ke API sistem Anda</p>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-700">Dokumentasi API</span>
                                                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                                                            Lihat dokumen
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-8">
                                        <button type="button" className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Batal
                                        </button>
                                        <button type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Simpan Pengaturan
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Notifications Settings Form */}
                        {activeTab === "notifications" && (
                            <form className="py-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-5">Pengaturan Notifikasi</h3>
                                <div className="space-y-6">
                                    {/* Email Notifications */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Notifikasi Email</label>
                                            <p className="text-sm text-gray-500">Atur pengiriman notifikasi melalui email.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <input
                                                        id="email-alerts"
                                                        name="email-alerts"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="email-alerts" className="ml-2 block text-sm text-gray-700">
                                                        Kirim notifikasi peringatan hama penting melalui email
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="email-system"
                                                        name="email-system"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="email-system" className="ml-2 block text-sm text-gray-700">
                                                        Kirim notifikasi perubahan sistem
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="email-reports"
                                                        name="email-reports"
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="email-reports" className="ml-2 block text-sm text-gray-700">
                                                        Kirim laporan mingguan tentang aktivitas hama
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SMS Notifications */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Notifikasi SMS</label>
                                            <p className="text-sm text-gray-500">Atur pengiriman notifikasi melalui SMS.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <input
                                                        id="sms-critical"
                                                        name="sms-critical"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="sms-critical" className="ml-2 block text-sm text-gray-700">
                                                        Kirim notifikasi SMS hanya untuk peringatan kritis
                                                    </label>
                                                </div>
                                                <div className="mt-3">
                                                    <label className="block text-sm text-gray-700 mb-1">Nomor Telepon</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="+62 8123456789"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Push Notifications */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Notifikasi Push</label>
                                            <p className="text-sm text-gray-500">Atur pengiriman notifikasi push ke perangkat.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="push-enable"
                                                        name="push-enable"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="push-enable" className="ml-2 block text-sm text-gray-700">
                                                        Aktifkan notifikasi push
                                                    </label>
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">Tingkat Notifikasi</label>
                                                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                        <option>Semua notifikasi</option>
                                                        <option>Hanya peringatan tinggi</option>
                                                        <option>Hanya peringatan kritis</option>
                                                        <option>Tanpa notifikasi</option>
                                                    </select>
                                                </div>

                                                <div className="border-t border-gray-200 pt-3">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Perangkat Terdaftar</h4>
                                                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm text-gray-700">iPhone 13 Pro</span>
                                                            <button type="button" className="text-xs text-red-600 hover:text-red-800">Hapus</button>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-700">Samsung Galaxy S22</span>
                                                            <button type="button" className="text-xs text-red-600 hover:text-red-800">Hapus</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Schedule */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Jadwal Notifikasi</label>
                                            <p className="text-sm text-gray-500">Atur kapan notifikasi dapat diterima.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <input
                                                        id="quiet-hours"
                                                        name="quiet-hours"
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="quiet-hours" className="ml-2 block text-sm text-gray-700">
                                                        Aktifkan jam tenang (hanya notifikasi kritis)
                                                    </label>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-700 mb-1">Mulai</label>
                                                        <input
                                                            type="time"
                                                            defaultValue="22:00"
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-700 mb-1">Selesai</label>
                                                        <input
                                                            type="time"
                                                            defaultValue="07:00"
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-8">
                                        <button type="button" className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Batal
                                        </button>
                                        <button type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Simpan Pengaturan
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Security Settings Form */}
                        {activeTab === "security" && (
                            <form className="py-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-5">Pengaturan Keamanan</h3>
                                <div className="space-y-6">
                                    {/* Password Change */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Ubah Kata Sandi</label>
                                            <p className="text-sm text-gray-500">Perbarui kata sandi akun Anda secara berkala untuk keamanan.</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Kata Sandi Saat Ini</label>
                                                <input
                                                    type="password"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Kata Sandi Baru</label>
                                                <input
                                                    type="password"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Kata sandi harus minimal 8 karakter, termasuk huruf, angka, dan simbol.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                                                <input
                                                    type="password"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <button type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    Perbarui Kata Sandi
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Two-Factor Authentication */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Otentikasi Dua Faktor</label>
                                            <p className="text-sm text-gray-500">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                                <div className="flex items-center">
                                                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                        <input
                                                            id="enable-2fa"
                                                            name="enable-2fa"
                                                            type="checkbox"
                                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                                                        />
                                                        <label
                                                            htmlFor="enable-2fa"
                                                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                                        ></label>
                                                    </div>
                                                    <label htmlFor="enable-2fa" className="ml-2 text-sm font-medium text-gray-700">
                                                        Aktifkan Otentikasi Dua Faktor
                                                    </label>
                                                </div>

                                                <div className="mt-4 text-sm text-gray-500">
                                                    <p>Otentikasi dua faktor menambahkan lapisan keamanan ekstra dengan meminta kode verifikasi saat masuk.</p>
                                                    <button type="button" className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        Pelajari Lebih Lanjut
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Login History */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Riwayat Login</label>
                                            <p className="text-sm text-gray-500">Lihat aktivitas login terbaru ke akun Anda.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Tanggal & Waktu
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Perangkat
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Lokasi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>23 Agustus 2023, 14:35</div>
                                                                <div className="text-green-600 text-xs">Saat ini</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                Chrome di Windows
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                Jakarta, Indonesia
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                22 Agustus 2023, 09:12
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                Safari di iPhone
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                Bandung, Indonesia
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                20 Agustus 2023, 18:05
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                Chrome di Mac
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                Jakarta, Indonesia
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <button type="button" className="mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                                Lihat semua aktivitas login
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-8">
                                        <button type="button" className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Batal
                                        </button>
                                        <button type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Simpan Pengaturan
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Advanced Settings Form */}
                        {activeTab === "advanced" && (
                            <form className="py-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-5">Pengaturan Lanjutan</h3>
                                <div className="space-y-6">
                                    {/* System Logs */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Log Sistem</label>
                                            <p className="text-sm text-gray-500">Konfigurasi pembuatan log untuk pemecahan masalah.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">Tingkat Log</label>
                                                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                        <option>Error saja</option>
                                                        <option>Error dan peringatan</option>
                                                        <option>Info (standar)</option>
                                                        <option>Debug (verbose)</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <input
                                                        id="log-rotation"
                                                        name="log-rotation"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="log-rotation" className="ml-2 block text-sm text-gray-700">
                                                        Aktifkan rotasi file log otomatis
                                                    </label>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mt-3">
                                                    <div className="flex justify-between items-center">
                                                        <button type="button" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            Unduh log saat ini
                                                        </button>
                                                        <button type="button" className="text-sm text-red-600 hover:text-red-800">
                                                            Hapus log
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Backup and Restore */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cadangan & Pemulihan</label>
                                            <p className="text-sm text-gray-500">Kelola cadangan sistem dan opsi pemulihan.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-4">
                                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cadangan Otomatis</h4>
                                                    <div className="flex items-center mb-3">
                                                        <input
                                                            id="auto-backup"
                                                            name="auto-backup"
                                                            type="checkbox"
                                                            defaultChecked
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor="auto-backup" className="ml-2 block text-sm text-gray-700">
                                                            Aktifkan cadangan otomatis
                                                        </label>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs text-gray-700 mb-1">Frekuensi</label>
                                                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                                                <option>Harian</option>
                                                                <option>Mingguan</option>
                                                                <option>Bulanan</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-700 mb-1">Simpan</label>
                                                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                                                <option>3 cadangan terakhir</option>
                                                                <option>5 cadangan terakhir</option>
                                                                <option>7 cadangan terakhir</option>
                                                                <option>Semua cadangan</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-3">
                                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        Unduh Cadangan
                                                    </button>
                                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Pulihkan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Diagnostics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Diagnostik Sistem</label>
                                            <p className="text-sm text-gray-500">Periksa kesehatan sistem dan jalankan pemecahan masalah.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-4">
                                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                                    <div className="flex justify-between mb-2">
                                                        <h4 className="text-sm font-medium text-gray-700">Status Sistem</h4>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Berfungsi Normal
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Penggunaan CPU</span>
                                                            <span className="text-gray-700">23%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                                                        </div>

                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Penggunaan Memori</span>
                                                            <span className="text-gray-700">1.2GB / 4GB</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                                                        </div>

                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Penyimpanan</span>
                                                            <span className="text-gray-700">32GB / 128GB</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-3">
                                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                        </svg>
                                                        Jalankan Diagnostik
                                                    </button>
                                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                        </svg>
                                                        Perbarui Sistem
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Factory Reset */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reset Pabrik</label>
                                            <p className="text-sm text-gray-500">Kembalikan sistem ke pengaturan awal.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                                <h4 className="text-sm font-medium text-red-800 mb-2">Peringatan: Tindakan Permanen</h4>
                                                <p className="text-sm text-red-700 mb-3">
                                                    Reset pabrik akan menghapus semua data, pengaturan, dan konfigurasi pengguna. Tindakan ini tidak dapat dibatalkan.
                                                </p>
                                                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                    Reset Pabrik
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-8">
                                        <button type="button" className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Batal
                                        </button>
                                        <button type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Simpan Pengaturan
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
