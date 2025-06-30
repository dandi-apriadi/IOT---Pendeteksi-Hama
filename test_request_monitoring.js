// Test script untuk monitor network requests
// Jalankan di browser console saat mengakses halaman spraying

let requestCount = 0;
let requestLog = [];
const startTime = Date.now();

// Override fetch untuk monitor requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    requestCount++;
    const url = args[0];
    const timestamp = new Date().toISOString();
    
    console.log(`🌐 REQUEST #${requestCount} at ${timestamp}: ${url}`);
    
    requestLog.push({
        id: requestCount,
        url: url,
        timestamp: timestamp,
        time: Date.now() - startTime
    });
    
    return originalFetch.apply(this, args);
};

// Override XMLHttpRequest untuk monitor axios requests
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
    requestCount++;
    const timestamp = new Date().toISOString();
    
    console.log(`📡 XHR REQUEST #${requestCount} at ${timestamp}: ${method} ${url}`);
    
    requestLog.push({
        id: requestCount,
        method: method,
        url: url,
        timestamp: timestamp,
        time: Date.now() - startTime
    });
    
    return originalXHROpen.apply(this, [method, url, ...args]);
};

// Function to analyze requests
window.analyzeRequests = function() {
    console.log(`\n📊 REQUEST ANALYSIS AFTER ${Math.round((Date.now() - startTime) / 1000)}s:`);
    console.log(`Total requests: ${requestCount}`);
    
    // Group by endpoint
    const grouped = requestLog.reduce((acc, req) => {
        const endpoint = req.url.includes('/api/') ? 
            req.url.split('/api/')[1].split('?')[0] : 
            req.url;
        
        if (!acc[endpoint]) {
            acc[endpoint] = [];
        }
        acc[endpoint].push(req);
        return acc;
    }, {});
    
    console.log('\n📈 Requests per endpoint:');
    Object.entries(grouped).forEach(([endpoint, requests]) => {
        console.log(`  ${endpoint}: ${requests.length} requests`);
        
        if (requests.length > 5) {
            console.warn(`  ⚠️  EXCESSIVE REQUESTS detected for ${endpoint}!`);
        }
    });
    
    // Check for pump status polling (should be ~1 request per 2 seconds)
    const pumpRequests = requestLog.filter(req => 
        req.url.includes('/api/esp32/data') || 
        req.url.includes('esp32')
    );
    
    console.log(`\n💧 Pump status requests: ${pumpRequests.length}`);
    
    const scheduleRequests = requestLog.filter(req => 
        req.url.includes('/api/schedules') && 
        !req.url.includes('?force=')
    );
    
    console.log(`📅 Schedule requests: ${scheduleRequests.length}`);
    if (scheduleRequests.length > 2) {
        console.warn(`⚠️  TOO MANY schedule requests! Should be max 1-2.`);
    }
    
    const deviceRequests = requestLog.filter(req => 
        req.url.includes('/api/dashboard/devices')
    );
    
    console.log(`🔧 Device requests: ${deviceRequests.length}`);
    if (deviceRequests.length > 2) {
        console.warn(`⚠️  TOO MANY device requests! Should be max 1-2.`);
    }
    
    return {
        total: requestCount,
        grouped: grouped,
        pumpRequests: pumpRequests.length,
        scheduleRequests: scheduleRequests.length,
        deviceRequests: deviceRequests.length
    };
};

console.log('🔍 Request monitoring started. Run analyzeRequests() to see analysis.');
console.log('Expected behavior:');
console.log('  - 1 initial schedule request');
console.log('  - 1 initial device request'); 
console.log('  - 1 pump status request every 2 seconds');
console.log('  - NO repeated schedule/device requests unless manually triggered');

// Auto-analyze after 30 seconds
setTimeout(() => {
    console.log('\n🕐 Auto-analysis after 30 seconds:');
    window.analyzeRequests();
}, 30000);
