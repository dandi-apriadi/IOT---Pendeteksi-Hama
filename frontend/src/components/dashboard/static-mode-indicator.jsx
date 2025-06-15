import React from 'react';

/**
 * Small indicator to show that data is static and requires manual refresh
 */
const StaticModeIndicator = ({ className = '', onRefresh = null }) => {
    return (
        <div className={`bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs p-1.5 rounded-md flex items-center justify-between ${className}`}>
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Data Statis</span>
            </div>

            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default StaticModeIndicator;
