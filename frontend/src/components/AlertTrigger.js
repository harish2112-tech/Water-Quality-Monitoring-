import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertTrigger = ({ currentReading }) => {
    if (!currentReading) return null;

    const getAlerts = () => {
        const triggers = [];
        if (currentReading.pH < 6.5 || currentReading.pH > 8.5) triggers.push("Irregular pH Levels");
        if (currentReading.turbidity > 5) triggers.push("High Turbidity Detected");
        if (currentReading.lead > 0.015) triggers.push("Critical Lead Levels");
        if (currentReading.arsenic > 0.01) triggers.push("Arsenic Contamination");
        return triggers;
    };

    const activeTriggers = getAlerts();

    if (activeTriggers.length === 0) return null;

    return (
        <div className="flex items-center space-x-2 bg-critical/10 border border-critical/20 px-4 py-2 rounded-xl animate-pulse">
            <AlertTriangle className="w-4 h-4 text-critical" />
            <span className="text-[10px] font-black uppercase text-critical tracking-widest">
                Threshold Violation: {activeTriggers.join(", ")}
            </span>
        </div>
    );
};

export default AlertTrigger;
