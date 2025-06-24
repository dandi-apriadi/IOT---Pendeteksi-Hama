/*
 * Note: The LiquidCrystal_I2C library may show a warning about compatibility with ESP32.
 * This is often just a warning. The code should work with most ESP32-compatible
 * LiquidCrystal_I2C libraries. If you encounter issues, use the library from:
 * https://github.com/johnrickman/LiquidCrystal_I2C
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <PZEM004Tv30.h>
#include <Wire.h>
#include <RTClib.h>
#include <LiquidCrystal_I2C.h>
#include <Ticker.h>  // Add Ticker library for timers

// Add these headers for debugging and watchdog
#include <esp_task_wdt.h>
#include <esp_system.h>
#include <esp_err.h>

// WiFi credentials
const char* ssid = "esta";
const char* password = "1234567890";

// Server configuration
// NOTE: Change serverHost to your actual server IP address
// For local development: use your computer's local IP (e.g., "192.168.1.100")
// For production: use your server's public IP or domain name
const char* serverHost = "192.168.207.169";  // Replace with your server IP
const int serverPort = 5000;  // Should match backend PORT environment variable
const char* httpEndpoint = "/api/esp32/data";
const char* wsEndpoint = "/ws";

// Device configuration
const String deviceId = "ESP32-PUMP-01";
const String deviceLocation = "Sawah Blok A";

// Hardware initialization
#define PZEM_RX_PIN 16
#define PZEM_TX_PIN 17
PZEM004Tv30 pzem(Serial2, PZEM_RX_PIN, PZEM_TX_PIN);

RTC_DS3231 rtc;
LiquidCrystal_I2C lcd1(0x27, 20, 4);
LiquidCrystal_I2C lcd2(0x26, 16, 2);

// Pin definitions
const int pumpPin = 25;
const int pirPin = 26;

// Control variables
bool isAutoMode = true;
bool manualPump = false;
bool pumpActive = false;
bool wifiConnected = false;
bool serverConnected = false;
bool simulatePZEM = true;

// Timing variables
unsigned long pumpStartTime = 0;
const unsigned long pumpDuration = 5000;
const unsigned long scheduleInterval = 30UL * 60UL * 1000UL;
unsigned long lastScheduledPumpTime = 0;
unsigned long lastDataSent = 0;
const unsigned long dataSendInterval = 5000;
unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 5000;

// Missing loop timing variables
unsigned long lastWsLoopTime = 0;
unsigned long lastMeasurementTime = 0;
unsigned long lastDisplayTime = 0;
unsigned long lastConnectionCheckTime = 0;
unsigned long lastPumpTime = 0;  // Add the missing lastPumpTime variable

// WebSocket client
WebSocketsClient webSocket;

// Data storage
struct SensorData {
  float voltage;
  float current;
  float power;
  float energy;
  bool pirStatus;
  bool pumpStatus;
  String timestamp;
} sensorData;

// Last valid readings storage
struct LastValidReadings {
  float voltage;
  float current;
  float power;
  float energy;
  unsigned long timestamp;
} lastValid;

// Thread safety
SemaphoreHandle_t sensorDataMutex;

// Debug flag
#define DEBUG_PZEM true

// Other globals
char nextPumpTimeStr[25] = "";
unsigned long logSequence = 1;
char logTimeBuffer[25];

// PIR sensor optimized variables
volatile bool pirState = false;
volatile bool pirStateChanged = false;
volatile bool motionStarted = false;  // Tracks new motion detection
volatile bool motionStopped = false;  // Tracks motion stopping
volatile unsigned long lastPirChangeTime = 0;
const int PIR_DEBOUNCE_TIME = 3; // Even faster response time - 3ms

// Create a semaphore for PIR notification synchronization
SemaphoreHandle_t pirNotifySemaphore;

// Set higher priority flag for motion detection
volatile bool motionDetected = false;
volatile bool motionNotificationPending = false;

// ---- FUNCTION PROTOTYPES (FORWARD DECLARATIONS) ----
// This ensures all functions are visible before they're used
void updateLogTimestamp();
void logMessage(const char* category, const char* message);
void logSensorData(bool isValid = true);
bool isNightTime(DateTime now);
void IRAM_ATTR handlePirInterrupt();
void checkPirSensor();
void updatePirDisplayMotionStart();
void updatePirDisplayMotionStop();
void updateElectricalMonitoringDisplay();
void sendPirStatusUpdateFast(bool status);
void improvedPzemInitialization();
void readSensorData();
void connectToWiFi();
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length);
void initWebSocket();
void registerDevice();
void handleServerCommand(const char* message);
void sendPirStatusUpdate();
void sendPumpStatusUpdate(bool status);
void sendDataViaWebSocket();
void sendDataViaHTTP();
void sendDataToServer();
void activatePump();
void deactivatePump();
void handlePumpAutomation();
void checkConnections();
void updateNextPumpTime();
void updateDisplays();

// ---- FUNCTION IMPLEMENTATIONS ----

// Utility Functions
bool rtcAvailable = false;
unsigned long programStartTime = 0;

void updateLogTimestamp() {
  if (rtcAvailable) {
    DateTime now = rtc.now();
    sprintf(logTimeBuffer, "%04d-%02d-%02d %02d:%02d:%02d",
            now.year(), now.month(), now.day(),
            now.hour(), now.minute(), now.second());
  } else {
    // Fallback if RTC is not working - use uptime instead
    unsigned long uptime = millis() - programStartTime;
    unsigned long seconds = uptime / 1000;
    unsigned long minutes = seconds / 60;
    unsigned long hours = minutes / 60;
    unsigned long days = hours / 24;
    
    sprintf(logTimeBuffer, "%03lu-%02lu:%02lu:%02lu",
            days, hours % 24, minutes % 60, seconds % 60);
  }
}

void logMessage(const char* category, const char* message) {
  updateLogTimestamp();
  Serial.print("[");
  Serial.print(logSequence++);
  Serial.print("] ");
  Serial.print(logTimeBuffer);
  Serial.print(" | ");
  Serial.print(category);
  Serial.print(": ");
  Serial.println(message);
}

void logSensorData(bool isValid) {
  updateLogTimestamp();
  Serial.print("[");
  Serial.print(logSequence++);
  Serial.print("] ");
  Serial.print(logTimeBuffer);
  Serial.print(" | SENSOR: ");
  
  if (isValid) {
    Serial.println("Reading Success");
    Serial.print("  ├─ Voltage: ");
    Serial.print(sensorData.voltage, 2);
    Serial.print("V, Current: ");
    Serial.print(sensorData.current, 3);
    Serial.println("A");
    
    Serial.print("  ├─ Power: ");
    Serial.print(sensorData.power, 2);
    Serial.print("W, Energy: ");
    Serial.print(sensorData.energy, 3);
    Serial.println("Wh");
    
    Serial.print("  ├─ PIR: ");
    Serial.print(sensorData.pirStatus ? "DETECTED" : "NOT DETECTED");
    Serial.print(", Pump: ");
    Serial.println(sensorData.pumpStatus ? "ON" : "OFF");
    
    Serial.print("  └─ Timestamp: ");
    Serial.println(sensorData.timestamp);
  } else {
    Serial.println("Reading Failed");
  }
}

bool isNightTime(DateTime now) {
  if (!rtcAvailable) {
    // Default behavior if RTC is not available - assume nighttime between 6PM-5AM
    unsigned long uptime = millis() - programStartTime;
    unsigned long hours = (uptime / 3600000) % 24;
    return (hours >= 18 || hours < 5);
  }
  
  int hour = now.hour();
  return (hour >= 18 || hour < 5);
}

// PIR Functions
void IRAM_ATTR handlePirInterrupt() {
  bool newState = digitalRead(pirPin);
  
  if (newState != pirState) {
    // Capture exact time of change for accurate debounce
    unsigned long currentTime = millis();
    
    if (currentTime - lastPirChangeTime > PIR_DEBOUNCE_TIME) {
      pirState = newState;
      
      // Set specific flags for motion starting or stopping
      if (newState) {
        motionStarted = true;      // Motion started
        motionDetected = true;     // General motion flag
      } else {
        motionStopped = true;      // Motion stopped
      }
      
      pirStateChanged = true;
      motionNotificationPending = true;  // Always notify server of state change
      lastPirChangeTime = currentTime;
    }
  }
}

void checkPirSensor() {
  // Get current state directly for the freshest status
  bool currentPirState = digitalRead(pirPin);
  
  // Always update the global sensor data with current state
  sensorData.pirStatus = currentPirState;
  
  // Immediately handle motion start
  if (motionStarted) {
    updatePirDisplayMotionStart();
    motionStarted = false;  // Reset flag
  }
  
  // Immediately handle motion stop
  if (motionStopped) {
    updatePirDisplayMotionStop();
    motionStopped = false;  // Reset flag
  }
  
  // Send notification if needed (for both motion start AND stop)
  if (motionNotificationPending && wifiConnected && serverConnected) {
    sendPirStatusUpdateFast(sensorData.pirStatus); // Pass current state
    motionNotificationPending = false;
  }
  
  // Reset change flag
  pirStateChanged = false;
  
  // Always keep electrical monitoring visible on LCD2, even without motion changes
  updateElectricalMonitoringDisplay();
}

// Split into two specialized functions for motion start/stop
void updatePirDisplayMotionStart() {
  // Update motion detection on LCD1
  lcd1.setCursor(0, 2);
  lcd1.print("PIR: TERDETEKSI   ");
  
  // Flash backlight to alert
  lcd1.noBacklight();
  delayMicroseconds(10000); // 10ms flash
  lcd1.backlight();
  
  // Show motion alert on LCD2 line 0 while keeping electrical data on line 1
  lcd2.setCursor(0, 0);
  lcd2.print("!MOTION DETECTED!");
  
  // Log the event
  Serial.println("*** MOTION STARTED - DISPLAY UPDATED ***");
}

void updatePirDisplayMotionStop() {
  // Update LCD1 to show motion stopped
  lcd1.setCursor(0, 2);
  lcd1.print("PIR: TIDAK DETEKSI");
  
  // Update LCD2 top line to show monitoring mode
  lcd2.setCursor(0, 0);
  lcd2.print("ELECTRICAL MONITOR");
  
  // Log the event
  Serial.println("*** MOTION STOPPED - DISPLAY UPDATED ***");
}

// Keep electrical data always visible on LCD2 line 1
void updateElectricalMonitoringDisplay() {
  // Always update electrical monitoring on second line of LCD2
  lcd2.setCursor(0, 1);
  
  float displayVoltage = isnan(sensorData.voltage) ? 0.0 : sensorData.voltage;
  float displayCurrent = isnan(sensorData.current) ? 0.0 : sensorData.current;
  
  char electricLine[17];
  snprintf(electricLine, sizeof(electricLine), "V:%.1fV I:%.2fA", 
           displayVoltage, displayCurrent);
  lcd2.print(electricLine);
}

// Update to send both state start/stop notifications
void sendPirStatusUpdateFast(bool status) {
  // Create a minimal JSON payload for speed
  DynamicJsonDocument doc(128);
  doc["type"] = "pir_event";
  doc["device_id"] = deviceId;
  doc["status"] = status;  // Send the actual current state
  doc["priority"] = status ? "high" : "normal"; // Different priority for motion start vs stop
  
  String message;
  serializeJson(doc, message);
  
  // Send the message without waiting/blocking
  webSocket.sendTXT(message);
  
  // Log to serial based on state
  if (status) {
    logMessage("MOTION", "Movement detected - notification sent");
  } else {
    logMessage("MOTION", "Movement stopped - notification sent");
  }
}

// PZEM Functions
void improvedPzemInitialization() {
  lcd1.setCursor(0, 1); 
  lcd1.print("PZEM Init...");
  
  Serial2.flush();
  delay(100);
  
  int retries = 0;
  bool initialized = false;
  float testVoltage = 0;
  
  while (!initialized && retries < 10) {
    while(Serial2.available()) {
      Serial2.read();
    }
    
    unsigned long startTime = millis();
    const unsigned long pzemTimeout = 1000;
    
    testVoltage = NAN;
    if (millis() - startTime < pzemTimeout) {
      testVoltage = pzem.voltage();
    }
    
    if (!isnan(testVoltage) && testVoltage > 0) {
      initialized = true;
      Serial.println("PZEM initialization successful!");
      Serial.printf("Test voltage reading: %.2f V\n", testVoltage);
      
      float testCurrent = pzem.current();
      float testPower = pzem.power();
      float testEnergy = pzem.energy();
      
      Serial.printf("Initial readings - V:%.2f, I:%.3f, P:%.2f, E:%.3f\n", 
                   testVoltage, testCurrent, testPower, testEnergy);
      
      if (!isnan(testVoltage)) lastValid.voltage = testVoltage;
      if (!isnan(testCurrent)) lastValid.current = testCurrent;
      if (!isnan(testPower)) lastValid.power = testPower; 
      if (!isnan(testEnergy)) lastValid.energy = testEnergy;
      lastValid.timestamp = millis();
      
      lcd1.setCursor(0, 1);
      lcd1.print("PZEM: OK       ");
    } else {
      retries++;
      
      Serial.print("PZEM init attempt ");
      Serial.print(retries);
      Serial.println(" failed, retrying...");
      
      lcd1.setCursor(0, 1);
      lcd1.print("PZEM Retry #");
      lcd1.print(retries);
      lcd1.print("  ");
      
      if (retries % 3 == 0) {
        Serial.println("Resetting PZEM serial connection...");
        Serial2.end();
        delay(500);
        Serial2.begin(9600, SERIAL_8N1, PZEM_RX_PIN, PZEM_TX_PIN);
        delay(500);
      }
      
      delay(500 * retries);
    }
  }
  
  if (!initialized) {
    Serial.println("WARNING: Failed to initialize PZEM after multiple attempts");
    lcd1.setCursor(0, 1);
    lcd1.print("PZEM Failed!   ");
  }
}

void readSensorData() {
  static unsigned long lastSuccessfulRead = 0;
  static int failCount = 0;
  
  if (simulatePZEM) {
    float v = 220.0 + (random(-100, 100) / 10.0);
    float i = 2.0 + (random(-100, 100) / 100.0);
    float p = v * i;
    float e = sensorData.energy + (p * 0.001 / 3600.0);
    
    if (xSemaphoreTake(sensorDataMutex, 10 / portTICK_PERIOD_MS)) {
      sensorData.voltage = v;
      sensorData.current = i;
      sensorData.power = p;
      sensorData.energy = e;
      
      // Generate timestamp with fallback for RTC failure
      char timeBuffer[20];
      
      if (rtcAvailable) {
        DateTime now = rtc.now();
        sprintf(timeBuffer, "%04d-%02d-%02d %02d:%02d:%02d", 
                now.year(), now.month(), now.day(),
                now.hour(), now.minute(), now.second());
      } else {
        unsigned long uptime = millis() - programStartTime;
        sprintf(timeBuffer, "T+%lu", uptime / 1000);
      }
      
      sensorData.timestamp = String(timeBuffer);
      
      sensorData.pumpStatus = pumpActive || (manualPump && !isAutoMode);
      
      xSemaphoreGive(sensorDataMutex);
    }
    
    lastValid.voltage = v;
    lastValid.current = i;
    lastValid.power = p;
    lastValid.energy = e;
    lastValid.timestamp = millis();
  } 
  else {
    // Real PZEM reading code
    float v = pzem.voltage();
    float i = pzem.current();
    float p = pzem.power();
    float e = pzem.energy();
    
    // Check valid readings
    if (!isnan(v) && v > 0) {
      if (xSemaphoreTake(sensorDataMutex, 10 / portTICK_PERIOD_MS)) {
        sensorData.voltage = v;
        sensorData.current = isnan(i) ? 0 : i;
        sensorData.power = isnan(p) ? 0 : p;
        sensorData.energy = isnan(e) ? sensorData.energy : e;
        
        // Update timestamp
        DateTime now = rtc.now();
        char timeBuffer[20];
        sprintf(timeBuffer, "%04d-%02d-%02d %02d:%02d:%02d", 
                now.year(), now.month(), now.day(),
                now.hour(), now.minute(), now.second());
        sensorData.timestamp = String(timeBuffer);
        
        // Update pump status
        sensorData.pumpStatus = pumpActive || (manualPump && !isAutoMode);
        
        xSemaphoreGive(sensorDataMutex);
        
        // Update last valid readings
        lastValid.voltage = v;
        lastValid.current = isnan(i) ? lastValid.current : i;
        lastValid.power = isnan(p) ? lastValid.power : p;
        lastValid.energy = isnan(e) ? lastValid.energy : e;
        lastValid.timestamp = millis();
      }
    }
  }
}

// WiFi and Network Functions - MISSING IMPLEMENTATION
void connectToWiFi() {
  lcd1.setCursor(0, 1); lcd1.print("Connecting WiFi...");
  lcd2.setCursor(0, 0); lcd2.print("WiFi Connecting");
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println();
    Serial.print("Connected to WiFi: ");
    Serial.println(WiFi.localIP());
    
    lcd1.setCursor(0, 1); lcd1.print("WiFi Connected      ");
    lcd2.setCursor(0, 0); lcd2.print("WiFi: OK        ");
  } else {
    wifiConnected = false;
    lcd1.setCursor(0, 1); lcd1.print("WiFi Failed!        ");
    lcd2.setCursor(0, 0); lcd2.print("WiFi: Failed    ");
  }
}

void initWebSocket() {
  if (strlen(serverHost) == 0 || serverPort == 0) {
    Serial.println("Error: Invalid server host or port");
    return;
  }
  
  webSocket.begin(serverHost, serverPort, wsEndpoint);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  
  Serial.println("WebSocket initialized");
}

// Data Transmission Functions - MISSING IMPLEMENTATION
void sendDataToServer() {
  if (!wifiConnected) return;
  
  if (serverConnected) {
    sendDataViaWebSocket();
  } else {
    sendDataViaHTTP();
  }
}

void sendDataViaWebSocket() {
  if (!serverConnected) {
    logMessage("WEBSOCKET", "Not connected, can't send data");
    return;
  }
  
  if (xSemaphoreTake(sensorDataMutex, portMAX_DELAY)) {
    bool hasNonZeroValues = 
      sensorData.voltage > 0 || 
      sensorData.current > 0 || 
      sensorData.power > 0 ||
      sensorData.energy > 0;
      
    if (!hasNonZeroValues) {
      logMessage("WARNING", "All electrical values are zero. Using last valid values if available.");
      
      if (lastValid.voltage > 0 || lastValid.current > 0 || lastValid.power > 0) {
        sensorData.voltage = lastValid.voltage;
        sensorData.current = lastValid.current;
        sensorData.power = lastValid.power;
        sensorData.energy = lastValid.energy;
      }
    }
    
    DynamicJsonDocument doc(384);
    doc["type"] = "sensor_data";
    doc["device_id"] = deviceId;
    doc["voltage"] = sensorData.voltage;
    doc["current"] = sensorData.current;
    doc["power"] = sensorData.power;
    doc["energy"] = sensorData.energy;
    doc["pir_status"] = sensorData.pirStatus;
    doc["pump_status"] = sensorData.pumpStatus;
    doc["auto_mode"] = isAutoMode;
    doc["timestamp"] = sensorData.timestamp;
    
    String message;
    serializeJson(doc, message);
    
    webSocket.sendTXT(message);
    xSemaphoreGive(sensorDataMutex);
  }
}

void sendDataViaHTTP() {
  if (!wifiConnected) return;
  
  if (xSemaphoreTake(sensorDataMutex, portMAX_DELAY)) {
    HTTPClient http;
    String url = "http://" + String(serverHost) + ":" + String(serverPort) + httpEndpoint;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    DynamicJsonDocument jsonDoc(384);
    jsonDoc["device_id"] = deviceId;
    jsonDoc["voltage"] = sensorData.voltage;
    jsonDoc["current"] = sensorData.current;
    jsonDoc["power"] = sensorData.power;
    jsonDoc["energy"] = sensorData.energy;
    jsonDoc["pir_status"] = sensorData.pirStatus;
    jsonDoc["pump_status"] = sensorData.pumpStatus;
    jsonDoc["timestamp"] = sensorData.timestamp;
    
    String jsonString;
    serializeJson(jsonDoc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.printf("HTTP Response: %d\n", httpResponseCode);
    } else {
      Serial.printf("HTTP Error: %d\n", httpResponseCode);
    }
    
    http.end();
    xSemaphoreGive(sensorDataMutex);
  }
}

// Pump Control Functions - MISSING IMPLEMENTATION
void activatePump() {
  digitalWrite(pumpPin, HIGH);
  pumpStartTime = millis();
  pumpActive = true;
  
  Serial.println("Pump activated");
  sendPumpStatusUpdate(true);
}

void deactivatePump() {
  digitalWrite(pumpPin, LOW);
  pumpActive = false;
  
  Serial.println("Pump deactivated");
  sendPumpStatusUpdate(false);
}

void handlePumpAutomation() {
  DateTime now = rtc.now();
  unsigned long nowMillis = millis();

  if (isAutoMode && !pumpActive && isNightTime(now)) {
    if (nowMillis - lastScheduledPumpTime >= scheduleInterval) {
      activatePump();
      lastScheduledPumpTime = nowMillis;
    }
  }

  if (pumpActive && nowMillis - pumpStartTime >= pumpDuration) {
    deactivatePump();
  }

  if (!isAutoMode && !pumpActive) {
    digitalWrite(pumpPin, manualPump ? HIGH : LOW);
  }
  
  updateNextPumpTime();
}

// Status Management Functions - MISSING IMPLEMENTATION
void checkConnections() {
  if (WiFi.status() != WL_CONNECTED) {
    if (wifiConnected) {
      wifiConnected = false;
      serverConnected = false;
      Serial.println("WiFi disconnected");
    }
    
    if (millis() - lastReconnectAttempt >= reconnectInterval) {
      Serial.println("Attempting WiFi reconnection...");
      connectToWiFi();
      
      if (wifiConnected) {
        initWebSocket();
      }
      
      lastReconnectAttempt = millis();
    }
  }
}

void updateNextPumpTime() {
  if (!rtcAvailable) {
    strcpy(nextPumpTimeStr, "RTC ERROR");
    return;
  }
  
  DateTime now = rtc.now();
  
  if (isAutoMode && isNightTime(now)) {
    unsigned long timeLeft = scheduleInterval - (millis() - lastScheduledPumpTime);
    if (timeLeft > scheduleInterval) timeLeft = 0;
    
    DateTime nextPump = now + TimeSpan(timeLeft / 1000);
    sprintf(nextPumpTimeStr, "%02d/%02d %02d:%02d:%02d",
            nextPump.day(), nextPump.month(),
            nextPump.hour(), nextPump.minute(), nextPump.second());
  } else {
    strcpy(nextPumpTimeStr, "SIANG - OFF");
  }
}

void sendPumpStatusUpdate(bool status) {
  if (!serverConnected) return;
  
  DynamicJsonDocument doc(256);
  doc["type"] = "pump_status";
  doc["device_id"] = deviceId;
  doc["status"] = status;
  doc["timestamp"] = sensorData.timestamp;
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}

// Display update function
void updateDisplays() {
  if (xSemaphoreTake(sensorDataMutex, 5 / portTICK_PERIOD_MS)) {
    static uint32_t displayUpdateCounter = 0;
    displayUpdateCounter++;
    
    char newLine[21];
    static char prevDisplay[4][21] = {"", "", "", ""};
    
    // Properly declare DateTime now variable
    DateTime now;
    bool validTime = false;
    
    // Generate time display with fallback for RTC failure
    if (rtcAvailable) {
      now = rtc.now();
      validTime = true;
      
      snprintf(newLine, sizeof(newLine), "%02d/%02d/%02d %02d:%02d:%02d   ",
               now.day(), now.month(), now.year() % 100,
               now.hour(), now.minute(), now.second());
    } else {
      // Use uptime if RTC isn't available
      unsigned long uptime = millis() - programStartTime;
      unsigned long seconds = (uptime / 1000) % 60;
      unsigned long minutes = (uptime / 60000) % 60;
      unsigned long hours = (uptime / 3600000) % 24;
      
      snprintf(newLine, sizeof(newLine), "Uptime: %02lu:%02lu:%02lu   ",
               hours, minutes, seconds);
    }
    
    // Update the time display
    lcd1.setCursor(0, 0);
    lcd1.print(newLine);
    
    if (displayUpdateCounter % 2 == 0) {
      // Line 1 - Next pump time
      lcd1.setCursor(0, 1);
      if (validTime && isNightTime(now) && isAutoMode) {
        snprintf(newLine, sizeof(newLine), "Next: %-16s", nextPumpTimeStr);
      } else {
        snprintf(newLine, sizeof(newLine), "SIANG - OFF         ");
      }
      if (strcmp(newLine, prevDisplay[1]) != 0) {
        lcd1.print(newLine);
        strcpy(prevDisplay[1], newLine);
      }

      // Line 2 - PIR status - don't overwrite if motion was just detected
      if (!motionDetected) {
        lcd1.setCursor(0, 2);
        snprintf(newLine, sizeof(newLine), "PIR: %-15s", 
                sensorData.pirStatus ? "TERDETEKSI  " : "TIDAK DETEKSI");
        if (strcmp(newLine, prevDisplay[2]) != 0) {
          lcd1.print(newLine);
          strcpy(prevDisplay[2], newLine);
        }
      }
      
      // Line 3 - Pump status
      lcd1.setCursor(0, 3);
      String pumpStatusStr;
      if (pumpActive) {
        pumpStatusStr = "AKTIF";
      } else if (!isAutoMode && manualPump) {
        pumpStatusStr = "MANUAL ON";
      } else {
        pumpStatusStr = "OFF";
      }
      snprintf(newLine, sizeof(newLine), "POMPA: %-12s", pumpStatusStr.c_str());
      if (strcmp(newLine, prevDisplay[3]) != 0) {
        lcd1.print(newLine);
        strcpy(prevDisplay[3], newLine);
      }
    }
    
    // Update second LCD with electrical data
    if (displayUpdateCounter % 4 == 0) {
      // Update LCD2 header if no motion is active
      if (!sensorData.pirStatus) {
        lcd2.setCursor(0, 0);
        lcd2.print("ELECTRICAL MONITOR");
      }
      
      // Always update electrical values
      updateElectricalMonitoringDisplay();
    }
    
    // Connection status indicator
    lcd1.setCursor(19, 0);
    lcd1.print(wifiConnected && serverConnected ? "*" : "x");
    
    xSemaphoreGive(sensorDataMutex);
  }
}

// Add these command debounce and memory management variables
#define WS_MIN_PROCESSING_INTERVAL 500  // Minimum 500ms between WebSocket command processing
#define MAX_COMMANDS_PER_MINUTE 20      // Rate limit commands to 20 per minute

// Command tracking variables
unsigned long lastCommandTime = 0;
String lastCommandID = "";
uint16_t commandsReceivedInLastMinute = 0;
unsigned long commandCounterResetTime = 0;
bool commandProcessingEnabled = false;  // Start disabled until system is stable

// Message queue to prevent flooding
const int MAX_QUEUE_SIZE = 5;
String commandQueue[MAX_QUEUE_SIZE];
int queueHead = 0;
int queueTail = 0;
int queueCount = 0;

// System restart protection
RTC_DATA_ATTR int consecutiveRestarts = 0;
unsigned long systemStabilizationTime = 10000;  // 10 seconds to stabilize after boot

// Add memory tracking
uint32_t freeHeapAtBoot = 0;
uint32_t lowestFreeHeap = UINT32_MAX;

// Improved WebSocket handling functions

// Queue a command for processing (prevents immediate execution flood)
bool queueCommand(const String& command) {
  if (queueCount >= MAX_QUEUE_SIZE) {
    logMessage("QUEUE", "Command queue full, dropping command");
    return false;
  }
  
  commandQueue[queueTail] = command;
  queueTail = (queueTail + 1) % MAX_QUEUE_SIZE;
  queueCount++;
  return true;
}

// Process a single command from the queue
void processCommandQueue() {
  // Only process commands after stabilization period
  if (millis() < systemStabilizationTime) return;
  
  // If no commands or not enough time between commands, skip
  if (queueCount == 0 || millis() - lastCommandTime < WS_MIN_PROCESSING_INTERVAL) return;
  
  // Apply rate limiting
  if (millis() - commandCounterResetTime > 60000) {
    commandsReceivedInLastMinute = 0;
    commandCounterResetTime = millis();
  }
  
  if (commandsReceivedInLastMinute >= MAX_COMMANDS_PER_MINUTE) {
    // Rate limit exceeded
    logMessage("COMMAND", "Rate limit exceeded, deferring command processing");
    return;
  }
  
  // Process one command
  String command = commandQueue[queueHead];
  queueHead = (queueHead + 1) % MAX_QUEUE_SIZE;
  queueCount--;
  
  // Track command timing
  lastCommandTime = millis();
  commandsReceivedInLastMinute++;
  
  // Process the command
  handleServerCommand(command.c_str());
}

// Modified WebSocket event handler with protection
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  // Handle WebSocket events with better protection
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      serverConnected = false;
      break;
      
    case WStype_CONNECTED:
      Serial.println("WebSocket connected");
      serverConnected = true;
      
      // Send simplified registration message
      try {
        webSocket.sendTXT("{\"type\":\"device_register\",\"device_id\":\"" + deviceId + "\"}");
      } catch (...) {
        Serial.println("Error sending registration message");
      }
      break;
      
    case WStype_TEXT:
      // Don't process commands immediately - queue them
      if (length > 0 && length < 512) {  // Sanity check on message size
        // Create a copy to avoid memory issues
        char* safePayload = (char*)malloc(length + 1);
        if (safePayload) {
          memcpy(safePayload, payload, length);
          safePayload[length] = '\0';
          
          // Queue instead of immediate execution
          if (!queueCommand(String(safePayload))) {
            logMessage("WEBSOCKET", "Command queue full, dropping message");
          }
          
          free(safePayload);  // Free the copy
        }
      }
      break;
      
    default:
      break;
  }
  
  // Monitor memory usage
  uint32_t currentHeap = ESP.getFreeHeap();
  if (currentHeap < lowestFreeHeap) {
    lowestFreeHeap = currentHeap;
  }
}

// Modified server command function with improved parsing
void handleServerCommand(const char* message) {
  // Introduce artificial delay to slow down command processing
  delay(5);
  
  // Create a more descriptive log of incoming commands
  Serial.print("Command received: ");
  Serial.println(message);
  
  // Parse and execute server commands
  DynamicJsonDocument doc(256);
  DeserializationError error = deserializeJson(doc, message);
  
  if (!error) {
    // Check for command ID to prevent duplicates
    String commandId = doc["command_id"] | "";
    if (commandId != "" && commandId == lastCommandID) {
      logMessage("COMMAND", "Duplicate command rejected");
      return;
    }
    lastCommandID = commandId;
    
    // Process command
    const char* command = doc["command"];
    if (!command) {
      Serial.println("Invalid command format - missing 'command' field");
      return;
    }
    
    if (strcmp(command, "set_mode") == 0) {
      int mode = doc["mode"];
      isAutoMode = (mode == 1);
      manualPump = !isAutoMode;
      
      logMessage("COMMAND", isAutoMode ? "Auto mode enabled" : "Manual mode enabled");
    } else if (strcmp(command, "toggle_pump") == 0) {
      manualPump = !manualPump;
      pumpActive = manualPump;
      
      digitalWrite(pumpPin, pumpActive ? HIGH : LOW);
      logMessage("COMMAND", pumpActive ? "Pump activated" : "Pump deactivated");
    } else {
      logMessage("COMMAND", "Unknown command");
    }
  } else {
    Serial.print("Failed to parse server command: ");
    Serial.println(error.c_str());
  }
  
  // Force memory cleanup
  doc.clear();
}

// Add this to setup() function - modified to use Ticker instead of Timer
void setupWithProtection() {
  // Record free heap at boot
  freeHeapAtBoot = ESP.getFreeHeap();
  lowestFreeHeap = freeHeapAtBoot;
  
  // Track consecutive restarts to detect problems
  consecutiveRestarts++;
  
  // If we're restarting too frequently, delay longer before enabling commands
  if (consecutiveRestarts > 3) {
    systemStabilizationTime = 30000; // 30 seconds cooldown
    logMessage("PROTECTION", "Multiple restarts detected - extended stabilization");
  } else {
    systemStabilizationTime = 10000; // 10 seconds normally
  }
  
  // Calculate time when command processing should be enabled
  unsigned long enableTime = millis() + systemStabilizationTime;
  logMessage("PROTECTION", "Command processing will be enabled in 10 seconds");
  
  // Create a software timer using Ticker instead of Timer
  static Ticker commandEnableTicker;
  commandEnableTicker.once(systemStabilizationTime/1000.0, []() {
    commandProcessingEnabled = true;
    logMessage("SYSTEM", "Command processing enabled");
  });
}

// Modified setup function
void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, PZEM_RX_PIN, PZEM_TX_PIN);
  delay(100);
  
  // Record program start time
  programStartTime = millis();
  
  // Initialize I2C with proper pins before initializing RTC
  Wire.begin(21, 22);
  delay(100);  // Give the I2C bus time to stabilize
  
  // Try to initialize RTC with proper error handling
  rtcAvailable = rtc.begin();
  
  if (!rtcAvailable) {
    Serial.println("RTC not found or not working");
    lcd1.setCursor(0, 1); lcd1.print("RTC ERROR!");
    lcd2.setCursor(0, 1); lcd2.print("RTC ERROR!");
    delay(2000); // Show error but continue
  } else {
    // Check if the RTC lost power and reset time if needed
    if (rtc.lostPower()) {
      Serial.println("RTC lost power, setting time to compile time");
      lcd1.setCursor(0, 1); lcd1.print("RTC Reset");
      // Set the RTC to the date & time this sketch was compiled
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
      delay(1000);
    }
  }
  
  lcd1.begin(20, 4);
  lcd1.backlight(); lcd1.clear();
  lcd1.setCursor(0, 0); lcd1.print("Inisialisasi...");

  lcd2.begin(16, 2);
  lcd2.backlight(); lcd2.clear();
  lcd2.setCursor(0, 0); lcd2.print("Starting...");

  pinMode(pumpPin, OUTPUT);
  pinMode(pirPin, INPUT_PULLUP); // Use pullup for better reliability
  digitalWrite(pumpPin, LOW);
  
  // Create semaphore for PIR notifications
  pirNotifySemaphore = xSemaphoreCreateBinary();
  
  // Add interrupt with highest priority
  attachInterrupt(digitalPinToInterrupt(pirPin), handlePirInterrupt, CHANGE);
  
  sensorDataMutex = xSemaphoreCreateMutex();
  lastValid = {0, 0, 0, 0, 0};
  
  if (simulatePZEM) {
    lcd1.setCursor(0, 1);
    lcd1.print("PZEM: SIMULATED");
    Serial.println("PZEM simulation mode active");
  } else {
    improvedPzemInitialization();
  }

  connectToWiFi();
  
  if (wifiConnected) {
    initWebSocket();
  }

  lcd1.clear();
  lcd2.clear();
  Serial.println("Setup completed");
}

void loop() {
  // Check PIR sensor with absolute highest priority
  checkPirSensor(); 
  
  // Continue with rest of loop functioning
  unsigned long currentMillis = millis();
  
  // Handle WebSocket LESS frequently - increased to 100ms from 20ms
  if (wifiConnected && currentMillis - lastWsLoopTime >= 100) {
    webSocket.loop();
    lastWsLoopTime = currentMillis;
  }
  
  // Process one command from the queue if it's time
  processCommandQueue();
  
  // Process other functions as before
  if (currentMillis - lastMeasurementTime >= 200) {
    readSensorData();
    lastMeasurementTime = currentMillis;
  }
  
  // Run pump automation less frequently
  if (currentMillis - lastPumpTime >= 1000) { // Slower 1 second rate
    handlePumpAutomation();
    lastPumpTime = currentMillis;
  }
  
  // Run data transmission less frequently
  if (currentMillis - lastDataSent >= dataSendInterval) {
    if (wifiConnected) {
      // Add rate limiting - only send if heap is healthy
      if (ESP.getFreeHeap() > freeHeapAtBoot * 0.7) {
        sendDataToServer();
      } else {
        logMessage("MEMORY", "Low heap, skipping data transmission");
      }
    }
    lastDataSent = currentMillis;
  }
  
  if (currentMillis - lastDisplayTime >= 500) {
    // Only update non-PIR displays if no recent motion
    if (!motionDetected) {
      updateDisplays();
    }
    lastDisplayTime = currentMillis;
  }
  
  if (currentMillis - lastConnectionCheckTime >= 5000) {
    checkConnections();
    lastConnectionCheckTime = currentMillis;
  }

  // Print memory stats every 30 seconds
  static unsigned long lastMemReport = 0;
  if (currentMillis - lastMemReport >= 30000) {
    uint32_t currentHeap = ESP.getFreeHeap();
    Serial.printf("Memory - Current: %u bytes, Lowest: %u bytes (%.1f%% of boot)\n", 
                 currentHeap, lowestFreeHeap, (lowestFreeHeap * 100.0) / freeHeapAtBoot);
    lastMemReport = currentMillis;
  }
  
  // Use a longer delay to reduce CPU usage
  delay(10); // 10ms delay instead of micros delay
}