# Schedule Time Display Fix - Documentation

## Problem Identified
The ESP32 LCD was always showing "00:00" for schedule times instead of the actual scheduled time.

## Root Cause Analysis
1. **Database Schema**: The `start_time` field in the schedules table uses `DataTypes.TIME` which stores time as "HH:MM:SS" string format, not as a Date object.
2. **Backend Parsing Error**: The `sendScheduleToESP32()` function in `scheduleController.js` was incorrectly trying to parse TIME strings using `new Date(schedule.start_time)`.
3. **Data Format Mismatch**: When retrieving TIME data from MySQL via Sequelize, it returns as string "08:30:00", not as Date object.

## Files Modified

### 1. Backend Controller Fix
**File**: `backend/controllers/scheduleController.js`
- **Function**: `sendScheduleToESP32()`
- **Change**: Added proper TIME string parsing logic
- **Before**: 
  ```javascript
  const startTime = new Date(schedule.start_time);
  const hour = startTime.getHours();
  const minute = startTime.getMinutes();
  ```
- **After**:
  ```javascript
  let hour, minute;
  if (typeof schedule.start_time === 'string') {
      // Handle TIME format like "08:30:00" or "08:30"
      const timeParts = schedule.start_time.split(':');
      hour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);
  } else {
      // Handle Date object
      const startTime = new Date(schedule.start_time);
      hour = startTime.getHours();
      minute = startTime.getMinutes();
  }
  ```

### 2. ESP32 Service Fix
**File**: `backend/services/esp32Service.js`
- **Function**: `syncAllSchedulesToDevice()`
- **Change**: Applied same TIME parsing logic for schedule synchronization

### 3. ESP32 Enhanced Debugging
**File**: `ESP32/baru/sketch_jun6a/sketch_jun6a.ino`
- **Function**: `handleAddSchedule()`
- **Enhancement**: Added detailed logging of received schedule data
- **Function**: `updateScheduleDisplay()`
- **Enhancement**: Added debugging logs for schedule data and parsing logic

## Data Flow Verification

### Backend to ESP32 Command Format
```json
{
  "command": "add_schedule",
  "value": {
    "hour": 8,
    "minute": 30,
    "schedule_id": 1,
    "title": "Morning Pump"
  }
}
```

### ESP32 Schedule Storage
```cpp
struct ScheduleItem {
  int scheduleId;    // e.g., 1
  int hour;          // e.g., 8
  int minute;        // e.g., 30
  String title;      // e.g., "Morning Pump"
  bool isActive;     // true
  bool hasExecutedToday; // false
};
```

### LCD Display Format
- **Next Schedule**: `Next: 08:30 MorningP`
- **Tomorrow Schedule**: `Tmrw: 08:30 MorningP`
- **No Schedule**: `No Schedule`

## Testing Steps

### 1. Verify Backend Time Parsing
```bash
# Check backend logs for correct hour/minute parsing
tail -f backend/logs/server.log | grep "Parsed time"
```

### 2. Test Schedule Creation/Update
```http
PUT http://localhost:3000/api/schedules/1
Content-Type: application/json

{
  "title": "Test Schedule",
  "device_id": 1,
  "schedule_type": "daily",
  "start_time": "14:30",
  "action_type": "turn_on",
  "is_active": true
}
```

### 3. Monitor ESP32 Serial Output
```
[SCHEDULE] Received schedule data - ID: 1, Hour: 14, Minute: 30, Title: Test Schedule
[SCHEDULE] Added schedule 1 at 14:30
[DISPLAY] Schedule count: 1
[DISPLAY] Schedule 0: ID=1, Time=14:30, Active=1, Title=Test Schedule
[DISPLAY] Found next schedule: 14:30
[DISPLAY] Schedule updated: Next: 14:30 TestSche
```

### 4. Verify LCD Display
- Check that LCD Line 1 shows the correct schedule time
- Verify time format is "HH:MM" not "00:00"

## Expected Behavior After Fix

1. **Schedule Creation**: When a schedule is created/updated via the web interface, the correct hour and minute should be sent to ESP32
2. **ESP32 Parsing**: ESP32 should receive and store the correct hour/minute values
3. **LCD Display**: LCD should show the actual schedule time, e.g., "Next: 14:30 TestSche"
4. **Real-time Updates**: Schedule changes should immediately update the LCD display

## Debugging Commands

### Backend Debug
```javascript
// Add to scheduleController.js for debugging
console.log('Raw start_time from DB:', schedule.start_time);
console.log('Type of start_time:', typeof schedule.start_time);
console.log('Parsed hour:', hour, 'minute:', minute);
```

### ESP32 Debug
```cpp
// Monitor ESP32 serial output for:
logMessage("SCHEDULE", ("Received hour: " + String(hour) + ", minute: " + String(minute)).c_str());
```

## Database Schema Reference
```sql
-- schedules table structure
start_time TIME NOT NULL,  -- Stores as "HH:MM:SS" string
end_time TIME NULL,        -- Stores as "HH:MM:SS" string
```

## Related Files
- `backend/controllers/scheduleController.js` - Main schedule logic
- `backend/services/esp32Service.js` - ESP32 communication
- `backend/models/scheduleModel.js` - Database model
- `ESP32/baru/sketch_jun6a/sketch_jun6a.ino` - ESP32 firmware
- `backend/test_schedule_update.rest` - API testing

## Status
✅ **FIXED** - Schedule times should now display correctly on ESP32 LCD instead of showing "00:00".
