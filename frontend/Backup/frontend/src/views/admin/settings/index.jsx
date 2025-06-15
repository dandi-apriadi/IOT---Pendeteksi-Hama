import React, { useState } from "react";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("general");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header with improved design */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 mb-6">
                    <h6 className="text-white font-medium text-xl flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Pengaturan Sistem
                    </h6>
                </div>

                <div className="px-6 pb-6">
                    <div>
                        {/* Simplified Settings Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex -mb-px">
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("general"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm flex items-center ${activeTab === "general" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Umum
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("devices"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm flex items-center ${activeTab === "devices" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                    Perangkat
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTabChange("notifications"); }}
                                    className={`border-b-2 py-4 px-6 font-medium text-sm flex items-center ${activeTab === "notifications" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Notifikasi
                                </a>
                            </nav>
                        </div>

                        {/* General Settings (Simplified) */}
                        {activeTab === "general" && (
                            <div className="space-y-8">
                                {/* System Information Card */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                                        <h3 className="text-base font-medium text-gray-700">Informasi Sistem</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Nama Sistem</span>
                                            <span className="text-sm font-medium">Rice Guardian Pro</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Versi Sistem</span>
                                            <span className="text-sm font-medium">2.4.1</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Status</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                Aktif
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Terakhir Diperbarui</span>
                                            <span className="text-sm font-medium">23 Agustus 2023</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Settings Card */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                                        <h3 className="text-base font-medium text-gray-700">Pengaturan Dasar</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {/* System Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sistem</label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                defaultValue="Rice Guardian Pro"
                                            />
                                        </div>

                                        {/* Language */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa</label>
                                            <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                <option>Indonesia</option>
                                                <option>English</option>
                                                <option>日本語</option>
                                            </select>
                                        </div>

                                        {/* Temperature Unit */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Satuan Suhu</label>
                                            <div className="flex space-x-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="celsius"
                                                        name="temperature"
                                                        type="radio"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <label htmlFor="celsius" className="ml-2 text-sm text-gray-700">Celsius (°C)</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="fahrenheit"
                                                        name="temperature"
                                                        type="radio"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <label htmlFor="fahrenheit" className="ml-2 text-sm text-gray-700">Fahrenheit (°F)</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Devices Tab (Simplified) */}
                        {activeTab === "devices" && (
                            <div className="space-y-8">
                                {/* Connected Devices Section */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
                                        <h3 className="text-base font-medium text-gray-700">Perangkat Terhubung</h3>
                                        <button type="button" className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Tambah
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {/* Device 1 */}
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">Hub Sensor Utama</h4>
                                                    <div className="flex mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                            Online
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-2">ID: RSP-2023-57842</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button type="button" className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button type="button" className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Device 2 */}
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">Kamera Pengawas #1</h4>
                                                    <div className="flex mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                            Online
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-2">ID: PC-HD-8945</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button type="button" className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button type="button" className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Device Settings Card */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                                        <h3 className="text-base font-medium text-gray-700">Pengaturan Perangkat</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">Perbarui Otomatis</h4>
                                                <p className="text-sm text-gray-500 mt-1">Perbarui perangkat secara otomatis saat tersedia pembaruan baru</p>
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox" name="toggle" id="auto-update" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label htmlFor="auto-update" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">Mode Penyiapan Perangkat</h4>
                                                <p className="text-sm text-gray-500 mt-1">Temukan dan sambungkan perangkat baru secara otomatis</p>
                                            </div>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox" name="toggle" id="device-setup" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label htmlFor="device-setup" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab (Simplified) */}
                        {activeTab === "notifications" && (
                            <div className="space-y-8">
                                {/* Notification Preferences Card */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                                        <h3 className="text-base font-medium text-gray-700">Preferensi Notifikasi</h3>
                                    </div>
                                    <div className="p-4 space-y-5">
                                        {/* Alert Types */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-gray-900">Jenis Peringatan</h4>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="pest-alerts" className="text-sm text-gray-700">Deteksi hama baru</label>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input type="checkbox" name="toggle" id="pest-alerts" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                    <label htmlFor="pest-alerts" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="system-alerts" className="text-sm text-gray-700">Peringatan sistem</label>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input type="checkbox" name="toggle" id="system-alerts" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                    <label htmlFor="system-alerts" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="update-alerts" className="text-sm text-gray-700">Pembaruan perangkat lunak</label>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input type="checkbox" name="toggle" id="update-alerts" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                    <label htmlFor="update-alerts" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notification Methods */}
                                        <div className="pt-5 border-t border-gray-200 space-y-3">
                                            <h4 className="text-sm font-medium text-gray-900">Metode Notifikasi</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <input
                                                        id="email-notify"
                                                        name="notification-method"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="email-notify" className="ml-2 text-sm text-gray-700">
                                                        Email
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="sms-notify"
                                                        name="notification-method"
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="sms-notify" className="ml-2 text-sm text-gray-700">
                                                        SMS
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="push-notify"
                                                        name="notification-method"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="push-notify" className="ml-2 text-sm text-gray-700">
                                                        Notifikasi Push
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quiet Hours */}
                                        <div className="pt-5 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Jam Tenang</h4>
                                                    <p className="text-sm text-gray-500 mt-1">Hanya kirim notifikasi penting selama jam tertentu</p>
                                                </div>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input type="checkbox" name="toggle" id="quiet-hours" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                    <label htmlFor="quiet-hours" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Dari</label>
                                                    <input
                                                        type="time"
                                                        defaultValue="22:00"
                                                        className="w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Sampai</label>
                                                    <input
                                                        type="time"
                                                        defaultValue="06:00"
                                                        className="w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
