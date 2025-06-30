/*
 * LIBRARY COMPATIBILITY NOTES:
 * 
 * LiquidCrystal_I2C Library Warning:
 * The warning "library LiquidCrystal I2C claims to run on avr architecture(s) and may be 
 * incompatible with your current board which runs on esp32 architecture(s)" is usually 
 * just a warning and can be ignored. The library works fine with ESP32.
 * 
 * If you encounter issues, try one of these ESP32-compatible libraries:
 * 1. Use this specific version: https://github.com/johnrickman/LiquidCrystal_I2C
 * 2. Or install "LiquidCrystal I2C" by Frank de Brabander from Library Manager
 * 3. Alternative: "ESP32 LiquidCrystal I2C" library
 * 
 * The code should work with most ESP32-compatible LiquidCrystal_I2C libraries.
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
#include <time.h>    // Add time library for NTP and timezone

// Add these headers for debugging and watchdog
#include <esp_task_wdt.h>
#include <esp_system.h>
#include <esp_err.h>

// WiFi credentials
const char* ssid = "Onesta";
const char* password = "123456788";

// NTP and Timezone Configuration for WITA (UTC+8)
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 8 * 3600;  // WITA is UTC+8
const int daylightOffset_sec = 0;     // No daylight saving in Indonesia

const char* serverHost = "192.168.1.5";  // Replace with your server IP
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

// Schedule Management Structure and Variables
struct ScheduleItem {
  int scheduleId;
  int hour;
  int minute;
  String title;
  bool isActive;
  bool hasExecutedToday;
};

const int MAX_SCHEDULES = 10;
ScheduleItem schedules[MAX_SCHEDULES];
int scheduleCount = 0;
int lastExecutedDay = -1; // Track day to reset execution flags

// ---- FUNCTION PROTOTYPES (FORWARD DECLARATIONS) ----
// This ensures all functions are visible before they're used
void updateLogTimestamp();
void logMessage(const char* category, const char* message);
void logSensorData(bool isValid = true);
bool isNightTime(DateTime now);
void initNTPTime();
void syncTimeWithNTP();
String getWITATimeString();
DateTime getWITADateTime();
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
void sendPumpStatusUpdate(bool status, const char* activationType);
void sendDataViaWebSocket();
void sendDataViaHTTP();
void sendDataToServer();
void activatePump();
void activatePump(const char* activationType);
void deactivatePump();
void deactivatePump(const char* deactivationType);
void handlePumpAutomation();
void checkConnections();
void updateNextPumpTime();
void updateDisplays();
void updateScheduleDisplay();  // Add prototype for updateScheduleDisplay

// Command handler prototypes
void handleTogglePump(String commandId);
void handlePumpOn(String commandId);
void handlePumpOff(String commandId);
void handleSetMode(String mode, String commandId);
void handleAddSchedule(int hour, int minute, int scheduleId, String title, String commandId);
void handleRemoveSchedule(int scheduleId, String commandId);
void handleGetSchedules(String commandId);
void handlePing(String commandId);
void handleRestart(String commandId);
void handleServerAck(DynamicJsonDocument& doc);
void handleScheduleSyncComplete(DynamicJsonDocument& doc);
void sendCommandResponse(String command, bool success, String commandId, String message);
void sendScheduleResponse(String action, bool success, int hour, int minute, String commandId, String message);
void checkScheduleExecution();
void updateScheduleDisplay();

// Queue management prototypes
bool queueCommand(const String& command);
void processCommandQueue();

// ---- FUNCTION IMPLEMENTATIONS ----

// Utility Functions
bool rtcAvailable = false;
bool ntpSynced = false;
unsigned long lastNtpSync = 0;
const unsigned long ntpSyncInterval = 3600000; // Sync every hour
unsigned long programStartTime = 0;

void updateLogTimestamp() {
  if (ntpSynced || rtcAvailable) {
    String timeStr = getWITATimeString();
    strcpy(logTimeBuffer, timeStr.c_str());
  } else {
    // Fallback if both NTP and RTC are not working - use uptime instead
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
  if (!rtcAvailable && !ntpSynced) {
    // Default behavior if both RTC and NTP are not available - assume nighttime between 6PM-5AM
    unsigned long uptime = millis() - programStartTime;
    unsigned long hours = (uptime / 3600000) % 24;
    return (hours >= 18 || hours < 5);
  }
  
  DateTime witaTime = getWITADateTime();
  int hour = witaTime.hour();
  return (hour >= 18 || hour < 5);
}

// NTP and Timezone Functions
void initNTPTime() {
  if (!wifiConnected) {
    logMessage("NTP", "WiFi not connected, cannot sync NTP");
    return;
  }
  
  logMessage("NTP", "Initializing NTP time synchronization...");
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  // Wait for time to be set
  time_t now = 0;
  struct tm timeinfo;
  int retry = 0;
  const int retry_count = 15;
  
  while (time(&now) < 24 * 3600 && ++retry < retry_count) {
    logMessage("NTP", "Waiting for system time to be set...");
    delay(2000);
  }
  
  if (retry < retry_count) {
    localtime_r(&now, &timeinfo);
    ntpSynced = true;
    lastNtpSync = millis();
    
    char timeStr[64];
    strftime(timeStr, sizeof(timeStr), "%Y-%m-%d %H:%M:%S WITA", &timeinfo);
    logMessage("NTP", ("Time synchronized: " + String(timeStr)).c_str());
    
    // Update RTC if available
    if (rtcAvailable) {
      DateTime ntpTime = DateTime(timeinfo.tm_year + 1900, timeinfo.tm_mon + 1, timeinfo.tm_mday,
                                 timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
      rtc.adjust(ntpTime);
      logMessage("RTC", "RTC updated with NTP time");
    }
  } else {
    logMessage("NTP", "Failed to synchronize time with NTP server");
    ntpSynced = false;
  }
}

void syncTimeWithNTP() {
  if (!wifiConnected) return;
  
  // Check if it's time to sync
  if (millis() - lastNtpSync > ntpSyncInterval) {
    logMessage("NTP", "Performing periodic NTP sync...");
    initNTPTime();
  }
}

String getWITATimeString() {
  char timeStr[25];
  
  if (ntpSynced) {
    // Use ESP32 system time (already configured for WITA)
    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);
    
    strftime(timeStr, sizeof(timeStr), "%d/%m/%y %H:%M:%S", &timeinfo);
  } else if (rtcAvailable) {
    // Use RTC time
    DateTime now = rtc.now();
    sprintf(timeStr, "%02d/%02d/%02d %02d:%02d:%02d",
            now.day(), now.month(), now.year() % 100,
            now.hour(), now.minute(), now.second());
  } else {
    // Fallback to uptime
    unsigned long uptime = millis() - programStartTime;
    unsigned long seconds = (uptime / 1000) % 60;
    unsigned long minutes = (uptime / 60000) % 60;
    unsigned long hours = (uptime / 3600000) % 24;
    
    sprintf(timeStr, "UP:%02lu:%02lu:%02lu", hours, minutes, seconds);
  }
  
  return String(timeStr);
}

DateTime getWITADateTime() {
  if (ntpSynced) {
    // Use ESP32 system time (already configured for WITA)
    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);
    
    return DateTime(timeinfo.tm_year + 1900, timeinfo.tm_mon + 1, timeinfo.tm_mday,
                   timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
  } else if (rtcAvailable) {
    // Use RTC time (assuming it's already set to WITA)
    return rtc.now();
  } else {
    // Fallback - create a dummy DateTime
    return DateTime(2025, 1, 1, 0, 0, 0);
  }
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
      
      // Generate timestamp with WITA timezone
      sensorData.timestamp = getWITATimeString();
      
      // Always read actual pump pin state for real-time status
      sensorData.pumpStatus = digitalRead(pumpPin);
      
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
        
        // Update timestamp with WITA time
        sensorData.timestamp = getWITATimeString();
        
        // Always read actual pump pin state for real-time status
        sensorData.pumpStatus = digitalRead(pumpPin);
        
        xSemaphoreGive(sensorDataMutex);
        
        // Update last valid readings
        lastValid.voltage = v;
        lastValid.current = isnan(i) ? lastValid.current : i;
        lastValid.power = isnan(p) ? lastValid.power : p;
        lastValid.energy = isnan(e) ? lastValid.energy : e;
        lastValid.timestamp = millis();
      }
    } else {
      // Even if PZEM reading fails, update pump status
      if (xSemaphoreTake(sensorDataMutex, 10 / portTICK_PERIOD_MS)) {
        sensorData.pumpStatus = digitalRead(pumpPin);
        sensorData.timestamp = getWITATimeString();
        xSemaphoreGive(sensorDataMutex);
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
    
    // Initialize NTP time synchronization
    initNTPTime();
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
  activatePump("MANUAL");
}

void activatePump(const char* activationType) {
  digitalWrite(pumpPin, HIGH);
  pumpStartTime = millis();
  pumpActive = true;
  
  // Update sensor data immediately for real-time status
  if (xSemaphoreTake(sensorDataMutex, 10 / portTICK_PERIOD_MS)) {
    sensorData.pumpStatus = true;
    xSemaphoreGive(sensorDataMutex);
  }
  
  // Log pump activation with precise timing and activation type
  String currentTime = getWITATimeString();
  logMessage("PUMP", ("Pump activated (" + String(activationType) + ") at " + currentTime).c_str());
  
  sendPumpStatusUpdate(true, activationType);
  
  // Force immediate display update for real-time response
  updateDisplays();
}

void deactivatePump() {
  deactivatePump("MANUAL");
}

void deactivatePump(const char* deactivationType) {
  digitalWrite(pumpPin, LOW);
  pumpActive = false;
  
  // Update sensor data immediately for real-time status
  if (xSemaphoreTake(sensorDataMutex, 10 / portTICK_PERIOD_MS)) {
    sensorData.pumpStatus = false;
    xSemaphoreGive(sensorDataMutex);
  }
  
  // Log pump deactivation with precise timing and deactivation type
  String currentTime = getWITATimeString();
  logMessage("PUMP", ("Pump deactivated (" + String(deactivationType) + ") at " + currentTime).c_str());
  
  sendPumpStatusUpdate(false, deactivationType);
  
  // Force immediate display update for real-time response
  updateDisplays();
}

void handlePumpAutomation() {
  DateTime now = getWITADateTime();
  unsigned long nowMillis = millis();
  
  // Store previous pump state to detect changes
  static bool previousPumpState = false;

  if (isAutoMode && !pumpActive && isNightTime(now)) {
    if (nowMillis - lastScheduledPumpTime >= scheduleInterval) {
      activatePump("AUTO");
      lastScheduledPumpTime = nowMillis;
    }
  }

  if (pumpActive && nowMillis - pumpStartTime >= pumpDuration) {
    deactivatePump("AUTO");
  }

  if (!isAutoMode && !pumpActive) {
    bool newPumpState = manualPump;
    digitalWrite(pumpPin, newPumpState ? HIGH : LOW);
    
    // Update pump status if it changed
    if (newPumpState != previousPumpState) {
      if (xSemaphoreTake(sensorDataMutex, 10 / portTICK_PERIOD_MS)) {
        sensorData.pumpStatus = newPumpState;
        xSemaphoreGive(sensorDataMutex);
      }
      
      // Send status update with MANUAL type for physical/mode changes
      sendPumpStatusUpdate(newPumpState, "MANUAL");
      
      // Force display update when pump state changes
      updateDisplays();
      
      logMessage("PUMP", newPumpState ? "Manual pump activated" : "Manual pump deactivated");
    }
    previousPumpState = newPumpState;
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
  if (!rtcAvailable && !ntpSynced) {
    strcpy(nextPumpTimeStr, "TIME ERROR");
    return;
  }
  
  DateTime now = getWITADateTime();
  
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
  sendPumpStatusUpdate(status, "UNKNOWN");
}

void sendPumpStatusUpdate(bool status, const char* activationType) {
  if (!serverConnected) return;
  
  DynamicJsonDocument doc(512);
  doc["type"] = "pump_status";
  doc["device_id"] = deviceId;
  doc["status"] = status;
  doc["activation_type"] = activationType;  // Add activation type to distinguish schedule vs manual
  doc["timestamp"] = sensorData.timestamp;
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
  
  // Log the type of activation for debugging
  logMessage("NOTIFICATION", ("Sent pump status update: " + String(status ? "ON" : "OFF") + 
                              " (" + String(activationType) + ")").c_str());
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
    
    // Generate time display with WITA timezone
    String timeStr = getWITATimeString();
    snprintf(newLine, sizeof(newLine), "%-20s", timeStr.c_str());
    
    // Check if we have valid time
    validTime = (ntpSynced || rtcAvailable);
    if (validTime) {
      now = getWITADateTime();
    }
    
    // Update the time display
    lcd1.setCursor(0, 0);
    lcd1.print(newLine);
    
    if (displayUpdateCounter % 2 == 0) {
      // Line 1 - Show schedules or "No Schedule"
      lcd1.setCursor(0, 1);
      if (scheduleCount > 0) {
        // Find next schedule to execute today
        int nextScheduleIndex = -1;
        int currentHour = validTime ? now.hour() : 0;
        int currentMinute = validTime ? now.minute() : 0;
        
        for (int i = 0; i < scheduleCount; i++) {
          if (schedules[i].isActive && !schedules[i].hasExecutedToday) {
            // Check if this schedule is later today
            if (schedules[i].hour > currentHour || 
                (schedules[i].hour == currentHour && schedules[i].minute > currentMinute)) {
              if (nextScheduleIndex == -1 || 
                  schedules[i].hour < schedules[nextScheduleIndex].hour ||
                  (schedules[i].hour == schedules[nextScheduleIndex].hour && 
                   schedules[i].minute < schedules[nextScheduleIndex].minute)) {
                nextScheduleIndex = i;
              }
            }
          }
        }
        
        if (nextScheduleIndex >= 0) {
          // Calculate time remaining until next schedule
          int currentTotalMinutes = currentHour * 60 + currentMinute;
          int scheduleTotalMinutes = schedules[nextScheduleIndex].hour * 60 + schedules[nextScheduleIndex].minute;
          int minutesRemaining = scheduleTotalMinutes - currentTotalMinutes;
          
          if (minutesRemaining > 0) {
            if (minutesRemaining < 60) {
              snprintf(newLine, sizeof(newLine), "Next:%02d:%02d(%dm)", 
                       schedules[nextScheduleIndex].hour, 
                       schedules[nextScheduleIndex].minute,
                       minutesRemaining);
            } else {
              snprintf(newLine, sizeof(newLine), "Next: %02d:%02d %s", 
                       schedules[nextScheduleIndex].hour, 
                       schedules[nextScheduleIndex].minute,
                       schedules[nextScheduleIndex].title.substring(0, 8).c_str());
            }
          } else {
            snprintf(newLine, sizeof(newLine), "Next: %02d:%02d NOW!", 
                     schedules[nextScheduleIndex].hour, 
                     schedules[nextScheduleIndex].minute);
          }
        } else {
          // All schedules for today are done, show first schedule for tomorrow
          int earliestIndex = -1;
          for (int i = 0; i < scheduleCount; i++) {
            if (schedules[i].isActive) {
              if (earliestIndex == -1 || 
                  schedules[i].hour < schedules[earliestIndex].hour ||
                  (schedules[i].hour == schedules[earliestIndex].hour && 
                   schedules[i].minute < schedules[earliestIndex].minute)) {
                earliestIndex = i;
              }
            }
          }
          if (earliestIndex >= 0) {
            snprintf(newLine, sizeof(newLine), "Tmrw: %02d:%02d %s", 
                     schedules[earliestIndex].hour, 
                     schedules[earliestIndex].minute,
                     schedules[earliestIndex].title.substring(0, 7).c_str());
          } else {
            snprintf(newLine, sizeof(newLine), "No Active Schedule  ");
          }
        }
      } else {
        snprintf(newLine, sizeof(newLine), "No Schedule         ");
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
    }
    
    // ALWAYS update pump status for real-time response (remove the condition)
    lcd1.setCursor(0, 3);
    String pumpStatusStr;
    
    // Read actual pump pin state for real-time status
    bool actualPumpState = digitalRead(pumpPin);
    
    if (actualPumpState) {
      if (isAutoMode) {
        pumpStatusStr = "AKTIF (AUTO)";
      } else {
        pumpStatusStr = "AKTIF (MANUAL)";
      }
    } else {
      if (isAutoMode) {
        pumpStatusStr = "OFF (AUTO)";
      } else {
        pumpStatusStr = "OFF (MANUAL)";
      }
    }
    
    snprintf(newLine, sizeof(newLine), "POMPA: %-12s", pumpStatusStr.c_str());
    // Always update pump status regardless of previous state for real-time response
    lcd1.print(newLine);
    strcpy(prevDisplay[3], newLine);
    
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
  logMessage("COMMAND", "Processing server command");
  
  // Parse and execute server commands
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    logMessage("JSON", "Parse error in server command");
    return;
  }
  
  // Check for command ID to prevent duplicates
  String commandId = doc["command_id"] | "";
  if (commandId != "" && commandId == lastCommandID) {
    logMessage("COMMAND", "Duplicate command rejected");
    return;
  }
  lastCommandID = commandId;
  
  // Process command
  String command = doc["command"];
  if (command == "") {
    // Check if it's a system message without command field
    String type = doc["type"];
    if (type == "server_welcome") {
      logMessage("SERVER", "Welcome message received");
      return;
    } else if (type == "ack") {
      handleServerAck(doc);
      return;
    } else if (type == "schedule_sync_complete") {
      handleScheduleSyncComplete(doc);
      return;
    }
    
    logMessage("COMMAND", "Invalid command format - missing 'command' field");
    return;
  }
  
  logMessage("COMMAND", ("Executing: " + command).c_str());
  
  // Handle pump control commands
  if (command == "toggle_pump") {
    handleTogglePump(commandId);
  }
  else if (command == "pump_on") {
    handlePumpOn(commandId);
  }
  else if (command == "pump_off") {
    handlePumpOff(commandId);
  }
  else if (command == "set_mode") {
    String mode = doc["value"]["value"];
    handleSetMode(mode, commandId);
  }
  
  // Handle schedule commands
  else if (command == "add_schedule") {
    int hour = doc["value"]["hour"];
    int minute = doc["value"]["minute"];
    int scheduleId = doc["value"]["schedule_id"];
    String title = doc["value"]["title"];
    handleAddSchedule(hour, minute, scheduleId, title, commandId);
  }
  else if (command == "remove_schedule") {
    int scheduleId = doc["value"]["schedule_id"];
    handleRemoveSchedule(scheduleId, commandId);
  }
  else if (command == "get_schedules") {
    handleGetSchedules(commandId);
  }
  
  // Handle system commands
  else if (command == "ping") {
    handlePing(commandId);
  }
  else if (command == "restart") {
    handleRestart(commandId);
  }
  
  else {
    logMessage("COMMAND", ("Unknown command: " + command).c_str());
    sendCommandResponse(command, false, commandId, "Unknown command");
  }
}

// ========== COMPLETE COMMAND HANDLERS ==========

// Pump Control Commands
void handleTogglePump(String commandId) {
  bool newState = !pumpActive;
  
  if (newState) {
    activatePump("MANUAL");
    logMessage("PUMP", "Toggle - Pump activated (MANUAL)");
  } else {
    deactivatePump("MANUAL");
    logMessage("PUMP", "Toggle - Pump deactivated (MANUAL)");
  }
  
  sendCommandResponse("toggle_pump", true, commandId, "Pump toggled successfully");
}

void handlePumpOn(String commandId) {
  if (!pumpActive) {
    activatePump("MANUAL");
    logMessage("PUMP", "Pump turned ON via command (MANUAL)");
    sendCommandResponse("pump_on", true, commandId, "Pump turned on successfully");
  } else {
    logMessage("PUMP", "Pump already ON");
    sendCommandResponse("pump_on", true, commandId, "Pump was already on");
  }
}

void handlePumpOff(String commandId) {
  if (pumpActive) {
    deactivatePump("MANUAL");
    logMessage("PUMP", "Pump turned OFF via command (MANUAL)");
    sendCommandResponse("pump_off", true, commandId, "Pump turned off successfully");
  } else {
    logMessage("PUMP", "Pump already OFF");
    sendCommandResponse("pump_off", true, commandId, "Pump was already off");
  }
}

void handleSetMode(String mode, String commandId) {
  if (mode == "auto") {
    isAutoMode = true;
    manualPump = false;
    logMessage("MODE", "Set to AUTO mode");
    sendCommandResponse("set_mode", true, commandId, "Mode set to AUTO");
    
    // Force immediate display update to show new mode
    updateDisplays();
  } else if (mode == "manual") {
    isAutoMode = false;
    logMessage("MODE", "Set to MANUAL mode");
    sendCommandResponse("set_mode", true, commandId, "Mode set to MANUAL");
    
    // Force immediate display update to show new mode
    updateDisplays();
  } else {
    logMessage("MODE", "Invalid mode specified");
    sendCommandResponse("set_mode", false, commandId, "Invalid mode. Use 'auto' or 'manual'");
  }
}

// Schedule Management (Simple implementation) - Variables moved to top of file

void handleAddSchedule(int hour, int minute, int scheduleId, String title, String commandId) {
  // Log received values for debugging
  logMessage("SCHEDULE", ("Received schedule data - ID: " + String(scheduleId) + 
                          ", Hour: " + String(hour) + 
                          ", Minute: " + String(minute) + 
                          ", Title: " + title).c_str());
  
  // Check if schedule already exists
  for (int i = 0; i < scheduleCount; i++) {
    if (schedules[i].scheduleId == scheduleId) {
      // Update existing schedule
      schedules[i].hour = hour;
      schedules[i].minute = minute;
      schedules[i].title = title;
      schedules[i].isActive = true;
      schedules[i].hasExecutedToday = false;
      
      logMessage("SCHEDULE", ("Updated schedule " + String(scheduleId) + 
                              " to " + String(hour) + ":" + String(minute)).c_str());
      sendScheduleResponse("add_schedule", true, hour, minute, commandId, "Schedule updated successfully");
      
      // Force immediate display update
      updateScheduleDisplay();
      return;
    }
  }
  
  // Add new schedule if there's space
  if (scheduleCount < MAX_SCHEDULES) {
    schedules[scheduleCount].scheduleId = scheduleId;
    schedules[scheduleCount].hour = hour;
    schedules[scheduleCount].minute = minute;
    schedules[scheduleCount].title = title;
    schedules[scheduleCount].isActive = true;
    schedules[scheduleCount].hasExecutedToday = false;
    scheduleCount++;
    
    logMessage("SCHEDULE", ("Added schedule " + String(scheduleId) + 
                            " at " + String(hour) + ":" + String(minute)).c_str());
    sendScheduleResponse("add_schedule", true, hour, minute, commandId, "Schedule added successfully");
    
    // Force immediate display update
    updateScheduleDisplay();
  } else {
    logMessage("SCHEDULE", "Schedule storage full");
    sendScheduleResponse("add_schedule", false, hour, minute, commandId, "Schedule storage full");
  }
}

void handleRemoveSchedule(int scheduleId, String commandId) {
  for (int i = 0; i < scheduleCount; i++) {
    if (schedules[i].scheduleId == scheduleId) {
      // Shift remaining schedules down
      for (int j = i; j < scheduleCount - 1; j++) {
        schedules[j] = schedules[j + 1];
      }
      scheduleCount--;
      
      logMessage("SCHEDULE", ("Removed schedule " + String(scheduleId)).c_str());
      sendScheduleResponse("remove_schedule", true, 0, 0, commandId, "Schedule removed successfully");
      
      // Force immediate display update
      updateScheduleDisplay();
      return;
    }
  }
  
  logMessage("SCHEDULE", ("Schedule " + String(scheduleId) + " not found").c_str());
  sendScheduleResponse("remove_schedule", false, 0, 0, commandId, "Schedule not found");
}

void handleGetSchedules(String commandId) {
  DynamicJsonDocument doc(1024);
  doc["type"] = "schedules_response";
  doc["device_id"] = deviceId;
  doc["command_id"] = commandId;
  
  JsonArray schedulesArray = doc.createNestedArray("schedules");
  
  for (int i = 0; i < scheduleCount; i++) {
    if (schedules[i].isActive) {
      JsonObject schedule = schedulesArray.createNestedObject();
      schedule["schedule_id"] = schedules[i].scheduleId;
      schedule["hour"] = schedules[i].hour;
      schedule["minute"] = schedules[i].minute;
      schedule["title"] = schedules[i].title;
      schedule["hasExecutedToday"] = schedules[i].hasExecutedToday;
    }
  }
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
  
  logMessage("SCHEDULE", ("Sent " + String(scheduleCount) + " schedules to server").c_str());
}

// System Commands
void handlePing(String commandId) {
  DynamicJsonDocument doc(256);
  doc["type"] = "ping_response";
  doc["device_id"] = deviceId;
  doc["command_id"] = commandId;
  doc["timestamp"] = sensorData.timestamp;
  doc["uptime"] = millis();
  doc["free_heap"] = ESP.getFreeHeap();
  doc["wifi_rssi"] = WiFi.RSSI();
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
  
  logMessage("PING", "Ping response sent");
}

void handleRestart(String commandId) {
  logMessage("SYSTEM", "Restart command received");
  
  // Send acknowledgment before restarting
  DynamicJsonDocument doc(256);
  doc["type"] = "restart_response";
  doc["device_id"] = deviceId;
  doc["command_id"] = commandId;
  doc["message"] = "Device will restart in 3 seconds";
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
  
  delay(3000);
  ESP.restart();
}

// Server Response Handlers
void handleServerAck(DynamicJsonDocument& doc) {
  String receivedType = doc["received_type"];
  bool success = doc["success"];
  
  if (success) {
    logMessage("ACK", ("Server acknowledged: " + receivedType).c_str());
  } else {
    logMessage("ACK", ("Server rejected: " + receivedType).c_str());
  }
}

void handleScheduleSyncComplete(DynamicJsonDocument& doc) {
  int syncedCount = doc["syncedCount"];
  int totalSchedules = doc["totalSchedules"];
  bool success = doc["success"];
  
  logMessage("SYNC", ("Schedule sync complete: " + String(syncedCount) + "/" + String(totalSchedules)).c_str());
}

// Helper Functions for Command Responses
void sendCommandResponse(String command, bool success, String commandId, String message) {
  DynamicJsonDocument doc(256);
  doc["type"] = "command_response";
  doc["device_id"] = deviceId;
  doc["command"] = command;
  doc["command_id"] = commandId;
  doc["success"] = success;
  doc["message"] = message;
  doc["timestamp"] = sensorData.timestamp;
  
  String jsonString;
  serializeJson(doc, jsonString);
  webSocket.sendTXT(jsonString);
}

void sendScheduleResponse(String action, bool success, int hour, int minute, String commandId, String message) {
  DynamicJsonDocument doc(256);
  doc["type"] = "schedule_response";
  doc["device_id"] = deviceId;
  doc["action"] = action;
  doc["success"] = success;
  doc["hour"] = hour;
  doc["minute"] = minute;
  doc["command_id"] = commandId;
  doc["message"] = message;
  doc["timestamp"] = sensorData.timestamp;
  
  String jsonString;
  serializeJson(doc, jsonString);
  webSocket.sendTXT(jsonString);
}

// Enhanced register device function
void registerDevice() {
  if (!serverConnected) return;
  
  DynamicJsonDocument doc(384);
  doc["type"] = "device_register";
  doc["device_id"] = deviceId;
  doc["device_type"] = "ESP32-PUMP";
  doc["location"] = deviceLocation;
  doc["timestamp"] = sensorData.timestamp;
  doc["firmware_version"] = "v2.0";
  doc["capabilities"] = "pump_control,scheduling,sensor_monitoring";
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
  
  logMessage("REGISTER", "Device registration sent");
}

// Schedule execution checker - call this in main loop
void checkScheduleExecution() {
  if ((!rtcAvailable && !ntpSynced) || !isAutoMode) return;
  
  DateTime now = getWITADateTime();
  
  // Log current time every minute for debugging
  static int lastLoggedMinute = -1;
  if (now.minute() != lastLoggedMinute) {
    lastLoggedMinute = now.minute();
    logMessage("TIME_CHECK", ("Current WITA time: " + String(now.hour()) + ":" + 
                             String(now.minute()) + ":" + String(now.second())).c_str());
  }
  
  // Reset execution flags daily
  if (lastExecutedDay != now.day()) {
    for (int i = 0; i < scheduleCount; i++) {
      schedules[i].hasExecutedToday = false;
    }
    lastExecutedDay = now.day();
    logMessage("SCHEDULE", "Daily execution flags reset");
  }
  
  // Check each schedule with precise timing
  for (int i = 0; i < scheduleCount; i++) {
    if (schedules[i].isActive && !schedules[i].hasExecutedToday) {
      // Check if current time matches the schedule time exactly
      if (now.hour() == schedules[i].hour && now.minute() == schedules[i].minute) {
        // Additional check: only execute if we're within the first 10 seconds of the minute
        // to avoid repeated executions during the same minute
        if (now.second() <= 10) {
          // Execute schedule
          logMessage("SCHEDULE", ("Executing schedule " + String(schedules[i].scheduleId) + 
                                 " '" + schedules[i].title + "'" +
                                 " at " + String(now.hour()) + ":" + String(now.minute()) + 
                                 ":" + String(now.second())).c_str());
          
          activatePump("SCHEDULE");
          schedules[i].hasExecutedToday = true;
          
          // Send execution notification to server
          DynamicJsonDocument doc(256);
          doc["type"] = "schedule_executed";
          doc["device_id"] = deviceId;
          doc["schedule_id"] = schedules[i].scheduleId;
          doc["executed_at"] = sensorData.timestamp;
          doc["title"] = schedules[i].title;
          
          String message;
          serializeJson(doc, message);
          webSocket.sendTXT(message);
          
          // Update display immediately after execution
          updateScheduleDisplay();
          
          // Log execution with timestamp
          logMessage("SCHEDULE", ("Schedule executed successfully: " + schedules[i].title + 
                                 " at " + getWITATimeString()).c_str());
        } else {
          // Log when we're in the correct minute but past the execution window
          logMessage("SCHEDULE", ("Schedule time matched but execution window passed: " + 
                                 String(schedules[i].scheduleId) + " at second " + String(now.second())).c_str());
        }
      }
    }
  }
}

// ========== ARDUINO SETUP AND MAIN LOOP ==========

void setup() {
  Serial.begin(115200);
  
  // Initialize timing
  programStartTime = millis();
  
  // Initialize pins
  pinMode(pumpPin, OUTPUT);
  pinMode(pirPin, INPUT);
  digitalWrite(pumpPin, LOW);
  
  // Initialize PIR interrupt
  attachInterrupt(digitalPinToInterrupt(pirPin), handlePirInterrupt, CHANGE);
  
  // Initialize semaphores
  sensorDataMutex = xSemaphoreCreateMutex();
  pirNotifySemaphore = xSemaphoreCreateBinary();
  
  // Initialize I2C and LCD
  Wire.begin();
  lcd1.init();
  lcd1.backlight();
  lcd1.setCursor(0, 0);
  lcd1.print("ESP32 Starting...");
  
  lcd2.init();
  lcd2.backlight();
  lcd2.setCursor(0, 0);
  lcd2.print("System Init");
  
  delay(1000);
  
  // Initialize RTC
  if (rtc.begin()) {
    rtcAvailable = true;
    logMessage("RTC", "DS3231 initialized successfully");
    
    // Check if RTC lost power and needs time setting
    if (rtc.lostPower()) {
      logMessage("RTC", "RTC lost power, setting time");
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    }
  } else {
    rtcAvailable = false;
    logMessage("RTC", "Failed to initialize DS3231, using uptime");
  }
  
  // Initialize PZEM
  Serial2.begin(9600, SERIAL_8N1, PZEM_RX_PIN, PZEM_TX_PIN);
  delay(500);
  improvedPzemInitialization();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Initialize WebSocket if WiFi connected
  if (wifiConnected) {
    initWebSocket();
  }
  
  // Initialize sensor data structure
  sensorData.voltage = 0;
  sensorData.current = 0;
  sensorData.power = 0;
  sensorData.energy = 0;
  sensorData.pirStatus = false;
  sensorData.pumpStatus = false;
  sensorData.timestamp = "Unknown";
  
  // Initialize schedules
  scheduleCount = 0;
  lastExecutedDay = -1;
  
  // Track free heap
  freeHeapAtBoot = ESP.getFreeHeap();
  lowestFreeHeap = freeHeapAtBoot;
  
  logMessage("SYSTEM", "ESP32 initialization complete");
  logMessage("TIMEZONE", "Configured for WITA (UTC+8) timezone");
  
  if (ntpSynced) {
    String currentTime = getWITATimeString();
    logMessage("TIME", ("Current WITA time: " + currentTime).c_str());
  }
  
  lcd1.clear();
  lcd1.setCursor(0, 0);
  lcd1.print("System Ready - WITA");
  
  lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("IoT Monitor");
}

// Function to immediately update schedule display on LCD
void updateScheduleDisplay() {
  if (!xSemaphoreTake(sensorDataMutex, 100 / portTICK_PERIOD_MS)) return;
  
  char newLine[21];
  DateTime now;
  bool validTime = false;
  
  // Get current WITA time
  if (ntpSynced || rtcAvailable) {
    now = getWITADateTime();
    validTime = true;
  }
  
  // Debug: Log current schedule count and details
  logMessage("DISPLAY", ("Schedule count: " + String(scheduleCount)).c_str());
  for (int i = 0; i < scheduleCount; i++) {
    logMessage("DISPLAY", ("Schedule " + String(i) + ": ID=" + String(schedules[i].scheduleId) + 
                          ", Time=" + String(schedules[i].hour) + ":" + String(schedules[i].minute) + 
                          ", Active=" + String(schedules[i].isActive) + 
                          ", Title=" + schedules[i].title).c_str());
  }
  
  // Update schedule line (Line 1)
  lcd1.setCursor(0, 1);
  
  if (scheduleCount > 0) {
    // Find next schedule to execute today
    int nextScheduleIndex = -1;
    int currentHour = validTime ? now.hour() : 0;
    int currentMinute = validTime ? now.minute() : 0;
    
    logMessage("DISPLAY", ("Current time: " + String(currentHour) + ":" + String(currentMinute)).c_str());
    
    for (int i = 0; i < scheduleCount; i++) {
      if (schedules[i].isActive && !schedules[i].hasExecutedToday) {
        // Check if this schedule is later today
        if (schedules[i].hour > currentHour || 
            (schedules[i].hour == currentHour && schedules[i].minute > currentMinute)) {
          if (nextScheduleIndex == -1 || 
              schedules[i].hour < schedules[nextScheduleIndex].hour ||
              (schedules[i].hour == schedules[nextScheduleIndex].hour && 
               schedules[i].minute < schedules[nextScheduleIndex].minute)) {
            nextScheduleIndex = i;
          }
        }
      }
    }
    
    if (nextScheduleIndex >= 0) {
      // Calculate time remaining until next schedule
      int currentTotalMinutes = currentHour * 60 + currentMinute;
      int scheduleTotalMinutes = schedules[nextScheduleIndex].hour * 60 + schedules[nextScheduleIndex].minute;
      int minutesRemaining = scheduleTotalMinutes - currentTotalMinutes;
      
      if (minutesRemaining > 0) {
        if (minutesRemaining < 60) {
          snprintf(newLine, sizeof(newLine), "Next:%02d:%02d(%dm)", 
                   schedules[nextScheduleIndex].hour, 
                   schedules[nextScheduleIndex].minute,
                   minutesRemaining);
        } else {
          snprintf(newLine, sizeof(newLine), "Next: %02d:%02d %s", 
                   schedules[nextScheduleIndex].hour, 
                   schedules[nextScheduleIndex].minute,
                   schedules[nextScheduleIndex].title.substring(0, 8).c_str());
        }
      } else {
        snprintf(newLine, sizeof(newLine), "Next: %02d:%02d NOW!", 
                 schedules[nextScheduleIndex].hour, 
                 schedules[nextScheduleIndex].minute);
      }
      
      logMessage("DISPLAY", ("Found next schedule: " + String(schedules[nextScheduleIndex].hour) + 
                            ":" + String(schedules[nextScheduleIndex].minute) + 
                            ", Minutes remaining: " + String(minutesRemaining)).c_str());
    } else {
      // All schedules for today are done, show first schedule for tomorrow
      int earliestIndex = -1;
      for (int i = 0; i < scheduleCount; i++) {
        if (schedules[i].isActive) {
          if (earliestIndex == -1 || 
              schedules[i].hour < schedules[earliestIndex].hour ||
              (schedules[i].hour == schedules[earliestIndex].hour && 
               schedules[i].minute < schedules[earliestIndex].minute)) {
            earliestIndex = i;
          }
        }
      }
      if (earliestIndex >= 0) {
        snprintf(newLine, sizeof(newLine), "Tmrw: %02d:%02d %s", 
                 schedules[earliestIndex].hour, 
                 schedules[earliestIndex].minute,
                 schedules[earliestIndex].title.substring(0, 7).c_str());
      } else {
        snprintf(newLine, sizeof(newLine), "No Active Schedule  ");
      }
    }
  } else {
    snprintf(newLine, sizeof(newLine), "No Schedule         ");
  }
  
  lcd1.print(newLine);
  
  // Log the schedule update
  logMessage("DISPLAY", ("Schedule updated: " + String(newLine)).c_str());
  
  xSemaphoreGive(sensorDataMutex);
}

void loop() {
  unsigned long currentTime = millis();
  
  // WebSocket loop - handle every 50ms
  if (currentTime - lastWsLoopTime > 50) {
    webSocket.loop();
    lastWsLoopTime = currentTime;
  }
  
  // Process command queue
  processCommandQueue();
  
  // Read sensor data every 1 second
  if (currentTime - lastMeasurementTime > 1000) {
    readSensorData();
    lastMeasurementTime = currentTime;
  }
  
  // Check PIR sensor
  checkPirSensor();
  
  // Send data to server every 5 seconds
  if (currentTime - lastDataSent > dataSendInterval) {
    sendDataToServer();
    lastDataSent = currentTime;
  }
  
  // Update displays more frequently for real-time pump status - every 500ms
  if (currentTime - lastDisplayTime > 500) {
    updateDisplays();
    lastDisplayTime = currentTime;
  }
  
  // Check connections every 10 seconds
  if (currentTime - lastConnectionCheckTime > 10000) {
    checkConnections();
    lastConnectionCheckTime = currentTime;
  }
  
  // Handle pump automation
  handlePumpAutomation();
  
  // Check schedule execution every 5 seconds for precise timing
  static unsigned long lastScheduleCheck = 0;
  if (currentTime - lastScheduleCheck > 5000) {
    checkScheduleExecution();
    lastScheduleCheck = currentTime;
  }
  
  // Sync time with NTP periodically
  syncTimeWithNTP();
  
  // Memory monitoring every 30 seconds
  static unsigned long lastMemoryCheck = 0;
  if (currentTime - lastMemoryCheck > 30000) {
    uint32_t currentHeap = ESP.getFreeHeap();
    if (currentHeap < lowestFreeHeap) {
      lowestFreeHeap = currentHeap;
    }
    
    // Log if memory is getting low
    if (currentHeap < (freeHeapAtBoot * 0.5)) {
      logMessage("MEMORY", ("Low memory warning: " + String(currentHeap) + " bytes free").c_str());
    }
    
    lastMemoryCheck = currentTime;
  }
  
  // Prevent watchdog reset
  yield();
  delay(10);
}