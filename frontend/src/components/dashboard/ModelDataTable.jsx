import React, { useState } from 'react';

/**
 * Component to display data from different database models
 */
const ModelDataTable = ({
    modelName,
    data = [],
    isLoading = false,
    maxRows = 10,
    error = null
}) => {
    const [expanded, setExpanded] = useState(true);

    // Format table header title
    const formatTitle = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-gray-800 font-medium">{formatTitle(modelName)} Data</h3>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    {expanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {expanded && (
                <div className="p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-sm text-gray-600">Loading data...</span>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-sm text-red-500">
                            {error}
                        </div>
                    ) : data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(data[0]).map(key => (
                                            <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {key.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.slice(0, maxRows).map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            {Object.values(item).map((value, valueIndex) => (
                                                <td key={valueIndex} className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                                                    {typeof value === 'boolean'
                                                        ? value ? 'Yes' : 'No'
                                                        : String(value)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.length > maxRows && (
                                <div className="text-center p-2 text-xs text-gray-500">
                                    Showing {maxRows} of {data.length} records
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-4 text-gray-500">
                            No {modelName} data available
                        </div>
                    )}
                </div>
            )}

            {!expanded && data.length > 0 && (
                <div className="p-4 text-sm text-gray-500">
                    {data.length} records available. Click to expand.
                </div>
            )}

            {!expanded && data.length === 0 && (
                <div className="p-4 text-sm text-gray-500">
                    No {modelName} data available.
                </div>
            )}
        </div>
    );
};

export default ModelDataTable;
