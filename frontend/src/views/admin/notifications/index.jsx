import React, { useState } from "react";
import axios from "axios";
import useNotifications from "./useNotifications";

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

    const { notifications, loading, fetchNotifications } = useNotifications();

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
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {notifications.filter(n => n.status === 'unread').length} Belum Dibaca
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800" onClick={async () => { await axios.post('/api/notifications/mark-all-read'); fetchNotifications(); }}>
                                    Tandai semua telah dibaca
                                </button>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-800" onClick={async () => { await axios.delete('/api/notifications/delete-all'); fetchNotifications(); }}>
                                    Hapus semua
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-4">Tidak ada notifikasi</div>
                            ) : notifications.map((notif, idx) => (
                                <div key={notif.id || idx} className={`border-l-4 ${notif.type === 'insect' ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-4 rounded-r-lg`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className={`font-medium ${notif.type === 'insect' ? 'text-red-800' : 'text-gray-700'}`}>{notif.title}</h4>
                                            <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-2">{new Date(notif.timestamp).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination can be added here if needed */}
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
