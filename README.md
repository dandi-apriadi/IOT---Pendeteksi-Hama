# IoT Rice Pest Spraying System

## Real-time ESP32 Data Integration with Node.js Backend and React Frontend

This system provides a complete solution for monitoring and controlling an ESP32-based rice pest spraying system. It includes:

- ESP32 firmware for sensor data collection and pump control
- Node.js backend server with WebSocket and HTTP API
- React frontend for real-time data visualization

## System Features

- **Real-time Monitoring**: View electrical measurements (voltage, current, power, energy) in real-time
- **Motion Detection**: PIR sensor status display for pest detection
- **Pump Control**: Manual and automatic control of the spraying pump
- **Historical Data**: Chart visualization of historical sensor data
- **Device Management**: Monitor ESP32 device status and connection

## Prerequisites

- Node.js v14 or higher
- NPM v6 or higher
- Arduino IDE with ESP32 support installed
- React development environment

## Quick Start

1. **Clone the repository**

2. **Install dependencies**
   ```
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure ESP32**
   - Open `ESP32/baru/sketch_jun6a/sketch_jun6a.ino` in Arduino IDE
   - Update WiFi credentials and server IP address
   - Upload sketch to your ESP32 device

4. **Start the system**
   - On Windows, run `start_system.bat` or `pwsh -File start_system.ps1`
   - This will start both backend and frontend servers
   - Open http://localhost:3000 in your web browser

## Connection Information

- **Backend Server**: http://localhost:5000
- **WebSocket Server**: ws://localhost:5000/ws
- **Frontend Server**: http://localhost:3000
- **ESP32 HTTP Endpoint**: http://{server_ip}:5000/api/esp32/data
- **ESP32 WebSocket**: ws://{server_ip}:5000/ws

## Data Flow

1. ESP32 collects sensor data (electrical measurements, PIR status)
2. Data is sent to the Node.js backend via WebSocket or HTTP
3. Backend validates and processes the data
4. Processed data is stored in the MySQL database
5. Real-time data is broadcast to frontend clients via Socket.IO
6. React frontend displays the data in real-time

## Monitoring and Testing Tools

### ESP32 Connection Monitor

Monitor ESP32 connections and real-time data transmission:

```bash
cd backend
npm run monitor
```

This interactive tool provides real-time information about connected ESP32 devices, their status, and latest sensor data.

### System Health Check

Comprehensive system health verification:

```bash
cd backend
npm run health
```

For an interactive health monitoring dashboard:

```bash
cd backend
npm run health:interactive
```

### ESP32 Simulator

Test integration without physical ESP32 hardware:

```bash
cd backend
npm run simulate
```

The simulator supports various test scenarios including normal operation, power surges, voltage drops, and connection issues.

## Troubleshooting

See the [Troubleshooting Guide](TROUBLESHOOTING.md) for detailed information about common issues and their solutions.

Basic troubleshooting steps:
- **ESP32 Not Connecting**: Check WiFi credentials and server IP address
- **No Data Showing**: Ensure backend server is running and WebSocket connection is established
- **Backend Server Errors**: Check MySQL database connection
- **Frontend Not Updating**: Verify Socket.IO connection to backend

## Development

- **ESP32 Code**: Located in `ESP32/baru/sketch_jun6a/`
- **Backend Code**: Located in `backend/`
- **Frontend Code**: Located in `frontend/`

## License

This project is licensed under the MIT License.
