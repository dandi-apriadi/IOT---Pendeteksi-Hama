import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import XLSX from './xlsx';

const SensorData = () => {
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil baseURL dari redux (authSlice)
    const baseURL = useSelector(state => state.auth.baseURL?.defaults?.baseURL) || process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        setLoading(true);
        axios.get("/api/esp32/data/all", { baseURL })
            .then(res => {
                setSensorData(res.data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [baseURL]);

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
            </div>

            <div className="mx-auto px-4">
                {/* Tabel Deteksi Serangga */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-700">Riwayat Deteksi Serangga</h3>
                            <button
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
                                onClick={() => {
                                    // Export data as Excel (XLSX)
                                    const header = ['No', 'Tanggal', 'Jam', 'Sensor', 'Lokasi', 'Status'];
                                    const rows = sensorData.map((item, idx) => {
                                        const [tanggal, jam] = item.timestamp ? item.timestamp.split(' ') : ['-', '-'];
                                        return [
                                            idx + 1,
                                            tanggal,
                                            jam,
                                            item.device && item.device.device_name ? item.device.device_name : `ID: ${item.device_id}`,
                                            item.device && item.device.location ? item.device.location : '-',
                                            'Serangga Terdeteksi'
                                        ];
                                    });
                                    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
                                    const workbook = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deteksi Serangga');
                                    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                                    const blob = new Blob([wbout], { type: 'application/octet-stream' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'riwayat_deteksi_serangga.xlsx';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Export Data
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jam</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sensor</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lokasi</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                                    ) : sensorData.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-4">Tidak ada deteksi serangga</td></tr>
                                    ) : sensorData.map((item, idx) => {
                                        const [tanggal, jam] = item.timestamp ? item.timestamp.split(' ') : ['-', '-'];
                                        return (
                                            <tr key={item.sensor_id || idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">{idx + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tanggal}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jam}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.device && item.device.device_name ? item.device.device_name : `ID: ${item.device_id}`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.device && item.device.location ? item.device.location : '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-500 text-white">Serangga Terdeteksi</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SensorData;
