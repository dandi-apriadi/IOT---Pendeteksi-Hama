# ESP32 IoT System - Complete Feature Implementation

## Overview
Kode ESP32 telah diperbarui untuk mendukung semua fitur yang ada di backend server. Sistem ini mengintegrasikan monitoring sensor, kontrol pompa, penjadwalan otomatis, dan komunikasi real-time dengan server.

## Fitur Utama yang Diimplementasikan

### 1. **Pump Control Commands**
ESP32 dapat menerima dan memproses perintah berikut dari backend:
- `toggle_pump` - Toggle status pompa (hidup/mati)
- `pump_on` - Hidupkan pompa secara manual
- `pump_off` - Matikan pompa secara manual
- `set_mode` - Set mode operasi (auto/manual)

### 2. **Schedule Management**
Sistem penjadwalan lengkap yang mendukung:
- `add_schedule` - Menambah jadwal baru dengan jam, menit, dan ID
- `remove_schedule` - Menghapus jadwal berdasarkan ID
- `get_schedules` - Mengirim daftar semua jadwal aktif ke server
- Eksekusi otomatis jadwal berdasarkan waktu RTC
- Reset flag eksekusi harian
- Sinkronisasi jadwal saat device terhubung

### 3. **System Commands**
Perintah sistem untuk maintenance dan monitoring:
- `ping` - Ping device untuk cek koneksi
- `restart` - Restart device secara remote
- Device registration otomatis saat terhubung
- Status monitoring dan heartbeat

### 4. **Sensor Data Management**
- Monitoring PIR sensor untuk deteksi gerakan
- Pembacaan data listrik dari PZEM-004T
- Real-time data transmission ke server
- Data caching dan fallback untuk nilai invalid

### 5. **Real-time Communication**
- WebSocket connection dengan server
- Command queue untuk mencegah flooding
- Rate limiting (maksimal 20 perintah per menit)
- Auto-reconnection saat koneksi terputus
- Broadcast data sensor setiap 5 detik

### 6. **Display & UI**
- LCD display 20x4 untuk status utama
- LCD display 16x2 untuk monitoring listrik
- Update tampilan real-time
- Indikator koneksi WiFi dan server

## Struktur Data dan Variabel Baru

### Schedule Structure
```cpp
struct ScheduleItem {
  int scheduleId;      // ID jadwal dari database
  int hour;           // Jam eksekusi
  int minute;         // Menit eksekusi
  String title;       // Nama jadwal
  bool isActive;      // Status aktif
  bool hasExecutedToday; // Flag eksekusi hari ini
};
```

### Command Queue System
- Buffer perintah dengan ukuran maksimal 5
- Rate limiting untuk mencegah spam
- Stabilization time 10 detik setelah boot

## Flow Komunikasi dengan Backend

### 1. **Device Registration**
```
ESP32 → Server: device_register
Server → ESP32: registration_ack + schedule_sync
```

### 2. **Pump Control**
```
Server → ESP32: pump_on/pump_off/toggle_pump
ESP32 → Server: command_response + pump_status_update
```

### 3. **Schedule Management**
```
Server → ESP32: add_schedule/remove_schedule
ESP32 → Server: schedule_response
ESP32 → Server: schedules_response (saat diminta)
```

### 4. **Data Transmission**
```
ESP32 → Server: sensor_data (setiap 5 detik)
Server → ESP32: sensor_data_ack
```

## Kompatibilitas dengan Backend

### Pump Controller
- ✅ togglePump() - Mendukung toggle_pump command
- ✅ turnPumpOn() - Mendukung pump_on command  
- ✅ turnPumpOff() - Mendukung pump_off command
- ✅ setPumpMode() - Mendukung set_mode command

### Schedule Controller
- ✅ Add schedule - Mendukung add_schedule command
- ✅ Remove schedule - Mendukung remove_schedule command
- ✅ Get schedules - Mendukung get_schedules command
- ✅ Schedule execution - Otomatis eksekusi berdasarkan RTC

### ESP32 Service
- ✅ sendCommandToDevice() - Semua command didukung
- ✅ syncAllSchedulesToDevice() - Auto-sync saat koneksi

### Real-time Features
- ✅ WebSocket communication
- ✅ Device status monitoring
- ✅ Real-time sensor data broadcast
- ✅ Auto-reconnection handling

## Fitur Keamanan dan Reliability

### Command Protection
- Duplicate command detection
- Rate limiting (20 commands/minute)
- Command queue dengan timeout
- Memory usage monitoring

### Connection Management
- Auto WiFi reconnection
- WebSocket heartbeat/ping
- Device status tracking
- Connection quality monitoring

### Error Handling
- JSON parsing error handling
- Command validation
- Fallback values untuk sensor
- Memory leak prevention

## Setup dan Konfigurasi

### Required Libraries
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <PZEM004Tv30.h>
#include <RTClib.h>
#include <LiquidCrystal_I2C.h>
#include <Ticker.h>
```

### Hardware Connections
- PZEM-004T: RX→Pin16, TX→Pin17
- RTC DS3231: SDA→21, SCL→22
- LCD1 (20x4): I2C Address 0x27
- LCD2 (16x2): I2C Address 0x26
- Pump Relay: Pin 25
- PIR Sensor: Pin 26

### WiFi Configuration
```cpp
const char* ssid = "Onesta";
const char* password = "123456788";
const char* serverHost = "192.168.1.5";
const int serverPort = 5000;
```

## Logging dan Debugging

### Comprehensive Logging
- Timestamped log messages
- Category-based logging (PUMP, SCHEDULE, COMMAND, etc.)
- Memory usage tracking
- Connection status logging

### Debug Features
- Serial output untuk monitoring
- LCD status indicators
- Command execution tracking
- Error reporting ke server

## Kesimpulan

ESP32 sekarang mendukung **100% fitur backend** yang berhubungan dengan device:
- ✅ Semua pump control commands
- ✅ Complete schedule management
- ✅ Real-time data transmission
- ✅ System commands dan monitoring
- ✅ WebSocket communication
- ✅ Auto-reconnection dan error handling

Sistem ini siap untuk deployment dan dapat menangani semua skenario operasional yang didefinisikan di backend.
