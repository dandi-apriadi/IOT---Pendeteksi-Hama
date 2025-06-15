import React from 'react';

/**
 * Banner that shows whether we're in real-time (dynamic) or static mode
 */
const StaticModeBanner = ({ isConnected }) => {
    return (
        <div className={`border rounded-lg p-4 mb-6 ${isConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isConnected ? 'text-green-400' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className={`text-sm font-medium ${isConnected ? 'text-green-800' : 'text-yellow-800'}`}>
                        {isConnected ? 'Live Data Mode Active' : 'Static Data Mode Active'}
                    </h3>
                    <p className={`text-sm mt-1 ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
                        {isConnected
                            ? 'Dashboard is receiving real-time data from ESP32 devices via WebSockets.'
                            : 'No live connection to ESP32. Data will not update automatically. Use the "Refresh Data" button to update manually.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaticModeBanner;
