import React, { useState } from "react";

const Dashboard = () => {
  // State to track which tab is active
  const [activeTab, setActiveTab] = useState("ikhtisar");

  // Function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "perangkat":
        return renderPerangkatSection();
      case "jadwal":
        return renderJadwalSection();
      case "ikhtisar":
      default:
        return renderIkhtisarSection();
    }
  };

  // Overview tab content
  const renderIkhtisarSection = () => (
    <>
      {/* Device Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Voltage Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-purple-500 p-4">
            <h6 className="text-white font-medium text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Tegangan
            </h6>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">220 V</p>
                <p className="text-sm text-gray-500">Rata-rata tegangan saat ini</p>
              </div>
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-medium">
                  +1.5%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Optimal: 220-240V</span>
              <span>85%</span>
            </div>
          </div>
        </div>

        {/* Current Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-500 p-4">
            <h6 className="text-white font-medium text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Arus
            </h6>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">5.2 A</p>
                <p className="text-sm text-gray-500">Penggunaan arus saat ini</p>
              </div>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-medium">
                  -0.7%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Maksimum: 8.5 A</span>
              <span>62%</span>
            </div>
          </div>
        </div>

        {/* Energy Consumption Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-green-500 p-4">
            <h6 className="text-white font-medium text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Energi/Perjam
            </h6>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">1.3 kWh</p>
                <p className="text-sm text-gray-500">Konsumsi energi perjam</p>
              </div>
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-medium">-2.1%</span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Hemat: &lt; 2.0 kWh</span>
              <span>45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
        {/* Sensor Readings Chart */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-500 p-4 mb-4">
            <h6 className="text-white font-medium text-lg">
              Pembacaan Sensor
            </h6>
          </div>
          <div className="p-4">
            <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Tempat grafik - Grafik garis menunjukkan suhu, kelembaban, dan deteksi hama</p>
            </div>
          </div>
        </div>

        {/* Spraying Schedule */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-green-500 p-4 mb-4">
            <h6 className="text-white font-medium text-lg">
              Jadwal Penyemprotan Mendatang
            </h6>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                    <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">Lahan A</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">22 Okt</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">08:00 Pagi</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <div className="rounded-full py-1 px-3 text-center bg-green-100">
                        <p className="text-xs font-semibold text-green-800">Dijadwalkan</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">Lahan B</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">23 Okt</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">09:30 Pagi</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <div className="rounded-full py-1 px-3 text-center bg-green-100">
                        <p className="text-xs font-semibold text-green-800">Dijadwalkan</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">Lahan C</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">24 Okt</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">07:00 Pagi</p>
                    </td>
                    <td className="py-3 px-5 border-b border-gray-200">
                      <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                        <p className="text-xs font-semibold text-amber-800">Tertunda</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5">
                      <p className="text-xs font-semibold text-gray-600">Lahan D</p>
                    </td>
                    <td className="py-3 px-5">
                      <p className="text-xs font-semibold text-gray-600">25 Okt</p>
                    </td>
                    <td className="py-3 px-5">
                      <p className="text-xs font-semibold text-gray-600">10:00 Pagi</p>
                    </td>
                    <td className="py-3 px-5">
                      <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                        <p className="text-xs font-semibold text-amber-800">Tertunda</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 p-4">
            <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Lihat Semua
            </button>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                &lt; Sebelumnya
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                Selanjutnya &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-red-500 p-4 mb-4">
          <h6 className="text-white font-medium text-lg">
            Peringatan Terbaru
          </h6>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Peringatan</th>
                  <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat Keparahan</th>
                  <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Deteksi Hama</p>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Lahan A</p>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Hari ini, 08:23 Pagi</p>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <div className="rounded-full py-1 px-3 text-center bg-red-100">
                      <p className="text-xs font-semibold text-red-800">Tinggi</p>
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                      Lihat
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Baterai Lemah</p>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Perangkat #12</p>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Hari ini, 09:45 Pagi</p>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                      <p className="text-xs font-semibold text-amber-800">Sedang</p>
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                      Lihat
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5">
                    <p className="text-xs font-semibold text-gray-600">Kerusakan Semprotan</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-semibold text-gray-600">Lahan C</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-semibold text-gray-600">Kemarin</p>
                  </td>
                  <td className="py-3 px-5">
                    <div className="rounded-full py-1 px-3 text-center bg-red-100">
                      <p className="text-xs font-semibold text-red-800">Tinggi</p>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                      Lihat
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 p-4">
          <p className="text-sm text-gray-600">Menampilkan 3 dari 7 peringatan</p>
          <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Lihat Semua Peringatan
          </button>
        </div>
      </div>
    </>
  );

  // Devices tab content
  const renderPerangkatSection = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-indigo-500 p-4 mb-4">
        <h6 className="text-white font-medium text-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Daftar Perangkat
        </h6>
      </div>
      <div className="p-4">
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Cari perangkat..."
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
              Cari
            </button>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Semua Status</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Semua Lokasi</option>
              <option>Lahan A</option>
              <option>Lahan B</option>
              <option>Lahan C</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead>
              <tr>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Perangkat</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Baterai</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-001</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Semprotan Utama</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan A</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-green-100">
                    <p className="text-xs font-semibold text-green-800">Online</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">85%</span>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                    Kontrol
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-002</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Sensor Hama</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan B</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-green-100">
                    <p className="text-xs font-semibold text-green-800">Online</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">32%</span>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                    Kontrol
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-003</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Sensor Suhu</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan C</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-red-100">
                    <p className="text-xs font-semibold text-red-800">Offline</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">10%</span>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                    Kontrol
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-004</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Sensor Kelembaban</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan D</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-green-100">
                    <p className="text-xs font-semibold text-green-800">Online</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">70%</span>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <button className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800">
                    Kontrol
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button className="px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all">
            Tambah Perangkat
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Halaman 1 dari 3</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 border-r border-gray-300">
                &lt;
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Schedule tab content
  const renderJadwalSection = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-orange-500 p-4 mb-4">
        <h6 className="text-white font-medium text-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Jadwal Detil
        </h6>
      </div>
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter Waktu</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-md">Hari Ini</button>
              <button className="px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700">Minggu Ini</button>
              <button className="px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700">Bulan Ini</button>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter Status</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-md">Dijadwalkan</button>
              <button className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">Tertunda</button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">Selesai</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead>
              <tr>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Jadwal</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Aktivitas</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perangkat</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="border-b border-gray-200 py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">SCH-001</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Penyemprotan</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan A</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">22 Okt 2023</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">08:00 - 09:30</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-001</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-green-100">
                    <p className="text-xs font-semibold text-green-800">Dijadwalkan</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">SCH-002</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Penyemprotan</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan B</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">23 Okt 2023</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">09:30 - 11:00</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-001</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-green-100">
                    <p className="text-xs font-semibold text-green-800">Dijadwalkan</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">SCH-003</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Pemantauan</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">Lahan C</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">24 Okt 2023</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">07:00 - 08:30</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">DEV-003</p>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="rounded-full py-1 px-3 text-center bg-amber-100">
                    <p className="text-xs font-semibold text-amber-800">Tertunda</p>
                  </div>
                </td>
                <td className="py-3 px-5 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 mt-4 pt-4">
          <div className="flex items-center">
            <button className="px-4 py-2 bg-orange-500 text-sm font-medium rounded-md text-white hover:bg-orange-600 transition-colors">
              + Tambah Jadwal Baru
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Halaman 1 dari 3</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 border-r border-gray-300">
                &lt;
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* Improved Header Menu */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg overflow-hidden rounded-b-2xl">
        <div className="px-6 py-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <div className="bg-blue-500 bg-opacity-30 rounded-lg px-4 py-1.5 text-white text-sm hidden md:block">
                <span className="font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              {/* Navigation Tabs - Now Functional */}
              <div className="flex items-center bg-white bg-opacity-10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("ikhtisar")}
                  className={`flex items-center text-white font-medium px-4 py-2 rounded-lg transition-all ${activeTab === "ikhtisar" ? "bg-white bg-opacity-25" : "hover:bg-white hover:bg-opacity-20"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Ikhtisar
                </button>
                <button
                  onClick={() => setActiveTab("perangkat")}
                  className={`flex items-center text-white font-medium px-4 py-2 rounded-lg transition-all ${activeTab === "perangkat" ? "bg-white bg-opacity-25" : "hover:bg-white hover:bg-opacity-20"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Perangkat
                </button>
                <button
                  onClick={() => setActiveTab("jadwal")}
                  className={`flex items-center text-white font-medium px-4 py-2 rounded-lg transition-all ${activeTab === "jadwal" ? "bg-white bg-opacity-25" : "hover:bg-white hover:bg-opacity-20"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Jadwal
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Quick Stats Stripe - Show only on Ikhtisar view */}
        {activeTab === "ikhtisar" && (
          <div className="px-6 py-3 bg-white bg-opacity-10 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-white">
                <div className="mr-2 bg-green-500 bg-opacity-30 p-1.5 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium opacity-80">Perangkat Aktif</p>
                  <p className="text-sm font-semibold">18/20</p>
                </div>
              </div>

              <div className="flex items-center text-white">
                <div className="mr-2 bg-yellow-500 bg-opacity-30 p-1.5 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium opacity-80">Peringatan Hari Ini</p>
                  <p className="text-sm font-semibold">2 Peringatan</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("jadwal")}
              className="mt-2 sm:mt-0 px-4 py-1.5 bg-white bg-opacity-20 text-white text-sm rounded-lg hover:bg-opacity-30 transition-all font-medium"
            >
              Tambah Jadwal +
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto px-4">
        {/* Render content based on active tab */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;