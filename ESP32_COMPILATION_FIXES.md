# ESP32 Arduino Compilation Fix Guide

## Issues Fixed

### 1. Schedule Variables Scope Error
**Problem:** `'scheduleCount' was not declared in this scope`
**Solution:** Moved schedule structure and variables to the top of the file before they are used.

### 2. LiquidCrystal_I2C Library Warning
**Problem:** Library claims to run on AVR architecture only
**Solution:** This is just a warning and can be ignored. The library works fine with ESP32.

## Arduino IDE Setup

### Required Board Package
1. Install ESP32 board package:
   - Go to **File > Preferences**
   - Add this URL to Additional Board Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools > Board > Board Manager**
   - Search for "ESP32" and install "esp32 by Espressif Systems"

### Required Libraries
Install these libraries via **Sketch > Include Library > Manage Libraries**:

1. **ArduinoJson** by Benoit Blanchon
2. **WebSockets** by Markus Sattler 
3. **PZEM004Tv30** by Jakub Mandula
4. **RTClib** by Adafruit
5. **LiquidCrystal I2C** by Frank de Brabander
6. **Ticker** (included with ESP32 core)
7. **WiFi** (included with ESP32 core)
8. **HTTPClient** (included with ESP32 core)

### Alternative LiquidCrystal_I2C Libraries (if needed)
If you encounter issues with the standard library, try:
- **LiquidCrystal I2C** by Marco Schwartz
- Or download from: https://github.com/johnrickman/LiquidCrystal_I2C

### Board Configuration
- **Board:** ESP32 Dev Module (or your specific ESP32 board)
- **CPU Frequency:** 240MHz (WiFi/BT)
- **Flash Frequency:** 80MHz
- **Flash Mode:** QIO
- **Flash Size:** 4MB (32Mb)
- **Partition Scheme:** Default 4MB with spiffs
- **Core Debug Level:** None (or Info for debugging)
- **PSRAM:** Disabled (unless your board has PSRAM)

### Pin Connections (Reference)
```
PZEM004T:
- RX Pin: GPIO 16
- TX Pin: GPIO 17

LCD1 (20x4):
- I2C Address: 0x27
- SDA: GPIO 21
- SCL: GPIO 22

LCD2 (16x2):
- I2C Address: 0x26
- SDA: GPIO 21
- SCL: GPIO 22

Other:
- Pump Pin: GPIO 25
- PIR Pin: GPIO 26
```

## Compilation Steps

1. Open Arduino IDE
2. Select correct ESP32 board
3. Select correct COM port
4. Click **Verify** to compile
5. If compilation succeeds, click **Upload**

## Common Issues & Solutions

### Memory Issues
- Use **Tools > Partition Scheme > Huge APP (3MB No OTA/1MB SPIFFS)** if you get memory errors

### Upload Issues
- Hold **BOOT** button while uploading if auto-reset doesn't work
- Try different baud rates (115200, 921600, 460800)

### Library Conflicts
- Remove duplicate libraries from your libraries folder
- Use Library Manager versions when possible

## Verification
After successful upload, open Serial Monitor at 115200 baud to see system logs.
The ESP32 should:
1. Initialize all components
2. Connect to WiFi
3. Connect to WebSocket server
4. Display system information on LCDs
5. Start monitoring sensors

## File Status
✅ **Fixed Issues:**
- Moved schedule variables to global scope
- Added comprehensive library documentation
- All compilation errors resolved

The code is now ready for compilation and upload to ESP32!
