import React, { useState, useEffect } from "react";
import { errorOnce } from '../../utils/consoleLogger';

/**
 * A tool component for verifying ESP32 sensor data format
 * This is useful for development and troubleshooting
 */
const DataVerifier = ({ sensorData, sensorHistory, isConnected }) => {
    const [expanded, setExpanded] = useState(false);
    const [dataReport, setDataReport] = useState(null);

    // Generate report on data integrity
    useEffect(() => {
        if (!sensorHistory || sensorHistory.length === 0) return;

        try {
            // Check basic data properties
            const samplePoint = sensorHistory[0];
            const missingProperties = [];

            ['voltage', 'current', 'power', 'energy', 'timestamp'].forEach(prop => {
                if (!samplePoint.hasOwnProperty(prop) &&
                    !(prop === 'timestamp' && samplePoint.hasOwnProperty('time_interval'))) {
                    missingProperties.push(prop);
                }
            });

            // Check for data ranges and anomalies
            const anomalies = [];
            let nanCount = 0;

            sensorHistory.forEach((point, idx) => {
                // Check for NaN values
                if (isNaN(parseFloat(point.voltage)) ||
                    isNaN(parseFloat(point.current)) ||
                    isNaN(parseFloat(point.power)) ||
                    isNaN(parseFloat(point.energy))) {
                    nanCount++;
                }

                // Check for anomalous values
                if (parseFloat(point.voltage) > 300 || parseFloat(point.voltage) < 100) {
                    anomalies.push(`Abnormal voltage at point ${idx}: ${point.voltage}V`);
                }

                if (parseFloat(point.current) > 15) {
                    anomalies.push(`Abnormal current at point ${idx}: ${point.current}A`);
                }

                if (parseFloat(point.power) > 3000) {
                    anomalies.push(`Abnormal power at point ${idx}: ${point.power}W`);
                }
            });

            // Check timestamp order
            let unorderedPoints = 0;
            for (let i = 1; i < sensorHistory.length; i++) {
                const prevTime = new Date(sensorHistory[i - 1].timestamp || sensorHistory[i - 1].time_interval);
                const currTime = new Date(sensorHistory[i].timestamp || sensorHistory[i].time_interval);

                if (prevTime > currTime) {
                    unorderedPoints++;
                }
            }

            // Set report data
            setDataReport({
                totalPoints: sensorHistory.length,
                missingProperties,
                nanCount, unorderedPoints,
                anomalies: anomalies.slice(0, 5) // Only show first 5 anomalies
            });
        } catch (err) {
            errorOnce('DATA_VERIFIER_ANALYSIS_ERROR', 'Error analyzing sensor data:', err);
        }
    }, [sensorHistory]);

    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className="font-medium text-slate-700">ESP32 Data Verifier</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {expanded && (
                <div className="mt-3 space-y-2">
                    <div>
                        <span className="font-medium">Current Sensor Reading:</span>
                        <pre className="mt-1 p-2 bg-slate-100 rounded overflow-auto text-[10px]">
                            {JSON.stringify(sensorData, null, 2)}
                        </pre>
                    </div>

                    <div>
                        <span className="font-medium">Data Report:</span>
                        {dataReport ? (
                            <div className="mt-1 p-2 bg-slate-100 rounded">
                                <p>Total data points: {dataReport.totalPoints}</p>
                                {dataReport.missingProperties.length > 0 && (
                                    <p className="text-amber-600">Missing properties: {dataReport.missingProperties.join(', ')}</p>
                                )}
                                {dataReport.nanCount > 0 && (
                                    <p className="text-red-600">Found {dataReport.nanCount} points with NaN values</p>
                                )}
                                {dataReport.unorderedPoints > 0 && (
                                    <p className="text-amber-600">Found {dataReport.unorderedPoints} points out of order</p>
                                )}
                                {dataReport.anomalies.length > 0 && (
                                    <div>
                                        <p className="font-medium text-red-600">Anomalies:</p>
                                        <ul className="list-disc list-inside">
                                            {dataReport.anomalies.map((anomaly, idx) => (
                                                <li key={idx}>{anomaly}</li>
                                            ))}
                                            {dataReport.anomalies.length === 5 && <li>...</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>No data to analyze</p>
                        )}
                    </div>

                    <div>
                        <span className="font-medium">First Data Point:</span>
                        {sensorHistory && sensorHistory.length > 0 ? (
                            <pre className="mt-1 p-2 bg-slate-100 rounded overflow-auto text-[10px]">
                                {JSON.stringify(sensorHistory[0], null, 2)}
                            </pre>
                        ) : (
                            <p>No history data available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataVerifier;
