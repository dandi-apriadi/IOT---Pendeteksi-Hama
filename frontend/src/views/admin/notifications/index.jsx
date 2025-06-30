import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useNotifications from "./useNotifications";

const Notifications = () => {
    // Get the base URL from Redux store
    const baseURL = useSelector(state => state.auth.baseURL?.defaults?.baseURL) || process.env.REACT_APP_API_BASE_URL;
    
    // UI state
    const [activeTab, setActiveTab] = useState('notifications');
    const [showPassword, setShowPassword] = useState(false);
    const [filter, setFilter] = useState('all'); // all, unread, insect, pump, schedule
    
    // Notification settings state
    const [notificationMethods, setNotificationMethods] = useState({
        email: true,
        whatsapp: false
    });
    
    // User contact information state
    const [userContact, setUserContact] = useState({
        email: "user@example.com",
        emailPassword: "password123",
        phone: "+62812345678"
    });
    
    // Save notification settings status
    const [saveStatus, setSaveStatus] = useState({
        saving: false,
        message: '',
        error: false
    });

    const { notifications, loading, fetchNotifications } = useNotifications();
    
    // Load notification settings on component mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await axios.get('/api/notifications/settings', { baseURL });
                if (response.data && response.data.success) {
                    const { methods, contact } = response.data.data;
                    if (methods) setNotificationMethods(methods);
                    if (contact) setUserContact(contact);
                }
            } catch (error) {
                console.error('Failed to load notification settings:', error);
            }
        };
        
        loadSettings();
    }, [baseURL]);
    
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
    
    // Handle saving notification settings
    const handleSaveSettings = async () => {
        setSaveStatus({ saving: true, message: '', error: false });
        
        try {
            const response = await axios.post('/api/notifications/settings', {
                methods: notificationMethods,
                contact: userContact
            }, { baseURL });
            
            if (response.data && response.data.success) {
                setSaveStatus({ 
                    saving: false, 
                    message: 'Pengaturan notifikasi berhasil disimpan!', 
                    error: false 
                });
                
                // Clear success message after 3 seconds
                setTimeout(() => setSaveStatus(prev => ({ ...prev, message: '' })), 3000);
            } else {
                setSaveStatus({ 
                    saving: false, 
                    message: 'Gagal menyimpan pengaturan', 
                    error: true 
                });
            }
        } catch (error) {
            console.error('Error saving notification settings:', error);
            setSaveStatus({ 
                saving: false, 
                message: 'Error: ' + (error.response?.data?.message || error.message), 
                error: true 
            });
        }
    };
    
    // Count various notification types
    const insectNotificationsCount = notifications.filter(n => n.type === 'insect' && n.status === 'unread').length;
    const pumpNotificationsCount = notifications.filter(n => n.type === 'pump' && n.status === 'unread').length;
    const scheduleNotificationsCount = notifications.filter(n => n.type === 'schedule' && n.status === 'unread').length;
    const totalUnreadCount = notifications.filter(n => n.status === 'unread').length;

    // Filter notifications based on active filter
    const filteredNotifications = notifications.filter(notification => {
        switch (filter) {
            case 'unread':
                return notification.status === 'unread';
            case 'insect':
                return notification.type === 'insect';
            case 'pump':
                return notification.type === 'pump';
            case 'schedule':
                return notification.type === 'schedule';
            default:
                return true;
        }
    });

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'insect':
                return <span className="text-xl">🐞</span>;
            case 'pump':
                return <span className="text-xl">💧</span>;
            case 'schedule':
                return <span className="text-xl">⏰</span>;
            default:
                return <span className="text-xl">🔔</span>;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'insect':
                return 'border-red-500 bg-red-50';
            case 'pump':
                return 'border-blue-500 bg-blue-50';
            case 'schedule':
                return 'border-green-500 bg-green-50';
            default:
                return 'border-gray-300 bg-gray-50';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                                    <span className="text-2xl">🔔</span>
                                </div>
                                Pusat Notifikasi
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Kelola notifikasi dan pengaturan pemberitahuan sistem IoT
                            </p>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <span className="text-lg">🔔</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{totalUnreadCount}</p>
                                        <p className="text-sm text-gray-500">Belum Dibaca</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <span className="text-lg">✅</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                                        <p className="text-sm text-gray-500">Total</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'notifications'
                                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg">🔔</span>
                                <span>Notifikasi</span>
                                {totalUnreadCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {totalUnreadCount}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'settings'
                                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg">⚙️</span>
                                <span>Pengaturan</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        {/* Filter and Actions Bar */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Filters */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filter === 'all'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Semua ({notifications.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filter === 'unread'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                    >
                                        Belum Dibaca ({totalUnreadCount})
                                    </button>
                                    <button
                                        onClick={() => setFilter('insect')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filter === 'insect'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                        }`}
                                    >
                                        🐞 Serangga ({insectNotificationsCount})
                                    </button>
                                    <button
                                        onClick={() => setFilter('pump')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filter === 'pump'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                    >
                                        💧 Pompa ({pumpNotificationsCount})
                                    </button>
                                    <button
                                        onClick={() => setFilter('schedule')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filter === 'schedule'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        ⏰ Jadwal ({scheduleNotificationsCount})
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await axios.post('/api/notifications/mark-all-read', {}, { baseURL });
                                                fetchNotifications();
                                            } catch (error) {
                                                console.error("Error marking all as read:", error);
                                                alert("Gagal menandai semua notifikasi sebagai telah dibaca. Silakan coba lagi.");
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <span className="text-lg">✅</span>
                                        Tandai Semua Dibaca
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
                                                try {
                                                    await axios.delete('/api/notifications/delete-all', { baseURL });
                                                    fetchNotifications();
                                                } catch (error) {
                                                    console.error("Error deleting all notifications:", error);
                                                    alert("Gagal menghapus semua notifikasi. Silakan coba lagi.");
                                                }
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                        <span className="text-lg">🗑️</span>
                                        Hapus Semua
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    <span className="ml-3 text-gray-600">Memuat notifikasi...</span>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="text-6xl">🔔</span>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        {filter === 'all' ? 'Tidak ada notifikasi' : `Tidak ada notifikasi ${filter}`}
                                    </h3>
                                    <p className="mt-2 text-gray-500">
                                        {filter === 'all' 
                                            ? 'Belum ada notifikasi yang diterima.'
                                            : `Tidak ada notifikasi dalam kategori ${filter}.`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredNotifications.map((notif, idx) => (
                                        <div
                                            key={notif.id || notif.notif_id || idx}
                                            className={`p-6 transition-all hover:bg-gray-50 ${
                                                notif.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {getNotificationIcon(notif.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                                {notif.title}
                                                            </h4>
                                                            {notif.status === 'unread' && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    Baru
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 mb-3 leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-sm">🕒</span>
                                                                {formatDate(notif.created_at)}
                                                            </span>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                notif.type === 'insect' 
                                                                    ? 'bg-orange-100 text-orange-800'
                                                                    : notif.type === 'pump'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {notif.type === 'insect' ? '🐞 Deteksi Serangga' : 
                                                                 notif.type === 'pump' ? '💧 Aktivitas Pompa' : 
                                                                 '⏰ Penjadwalan'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {notif.status === 'unread' && (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const notificationId = notif.notif_id || notif.id;
                                                                if (!notificationId) {
                                                                    alert("ID notifikasi tidak ditemukan. Silakan muat ulang halaman.");
                                                                    return;
                                                                }
                                                                
                                                                await axios.post(`/api/notifications/${notificationId}/read`, {}, { baseURL });
                                                                fetchNotifications();
                                                            } catch (error) {
                                                                console.error("Error marking notification as read:", error);
                                                                alert("Gagal menandai notifikasi sebagai telah dibaca. Silakan coba lagi.");
                                                            }
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium ml-4"
                                                    >
                                                        <span className="text-sm">👁️</span>
                                                        Tandai Dibaca
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-2xl">⚙️</span>
                                Pengaturan Notifikasi
                            </h2>
                            <p className="text-red-100 mt-2">
                                Atur bagaimana Anda ingin menerima pemberitahuan dari sistem IoT
                            </p>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Notification Methods */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-xl">🔔</span>
                                    Metode Notifikasi
                                </h3>
                                
                                <div className="grid gap-4">
                                    {/* Email Option */}
                                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-red-200 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-red-100 rounded-xl">
                                                    <span className="text-2xl">📧</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                                                    <p className="text-gray-600">Terima notifikasi melalui email</p>
                                                    <p className="text-sm text-gray-500">Notifikasi akan dikirim ke alamat email yang terdaftar</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={notificationMethods.email}
                                                    onChange={() => handleToggleMethod('email')}
                                                />
                                                <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-red-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* WhatsApp Option */}
                                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-green-200 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-green-100 rounded-xl">
                                                    <span className="text-2xl">📱</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">WhatsApp</h4>
                                                    <p className="text-gray-600">Terima notifikasi melalui WhatsApp</p>
                                                    <p className="text-sm text-gray-500">Notifikasi akan dikirim ke nomor WhatsApp yang terdaftar</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={notificationMethods.whatsapp}
                                                    onChange={() => handleToggleMethod('whatsapp')}
                                                />
                                                <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-xl">📧</span>
                                    Informasi Kontak
                                </h3>
                                
                                <div className="grid gap-6">
                                    {/* Email Settings */}
                                    <div className={`p-6 rounded-xl border-2 transition-all ${
                                        notificationMethods.email 
                                            ? 'border-red-200 bg-red-50' 
                                            : 'border-gray-200 bg-gray-50 opacity-60'
                                    }`}>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="text-lg">📧</span>
                                            Pengaturan Email
                                        </h4>
                                        
                                        <div className="grid gap-4">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Alamat Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                                    value={userContact.email}
                                                    onChange={handleContactChange}
                                                    disabled={!notificationMethods.email}
                                                    placeholder="example@domain.com"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Password Email
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="emailPassword"
                                                        name="emailPassword"
                                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                                        value={userContact.emailPassword}
                                                        onChange={handleContactChange}
                                                        disabled={!notificationMethods.email}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        disabled={!notificationMethods.email}
                                                    >
                                                        <span className="text-lg">
                                                            {showPassword ? '🙈' : '👁️'}
                                                        </span>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Password untuk akun email yang akan digunakan untuk mengirim notifikasi
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* WhatsApp Settings */}
                                    <div className={`p-6 rounded-xl border-2 transition-all ${
                                        notificationMethods.whatsapp 
                                            ? 'border-green-200 bg-green-50' 
                                            : 'border-gray-200 bg-gray-50 opacity-60'
                                    }`}>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="text-lg">📱</span>
                                            Pengaturan WhatsApp
                                        </h4>
                                        
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nomor WhatsApp
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                value={userContact.phone}
                                                onChange={handleContactChange}
                                                disabled={!notificationMethods.whatsapp}
                                                placeholder="+62812345678"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Nomor WhatsApp untuk menerima notifikasi (format: +62xxx)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={saveStatus.saving}
                                        className={`flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all transform hover:scale-105 font-medium ${
                                            saveStatus.saving ? 'opacity-70 cursor-not-allowed transform-none' : ''
                                        }`}
                                    >
                                        {saveStatus.saving ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">✅</span>
                                                Simpan Pengaturan
                                            </div>
                                        )}
                                    </button>
                                    
                                    {saveStatus.message && (
                                        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                                            saveStatus.error 
                                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                                : 'bg-green-100 text-green-700 border border-green-200'
                                        }`}>
                                            <span className="text-lg">
                                                {saveStatus.error ? '❌' : '✅'}
                                            </span>
                                            <span className="font-medium">{saveStatus.message}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
