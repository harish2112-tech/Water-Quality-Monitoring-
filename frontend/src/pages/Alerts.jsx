import React, { useState, useEffect } from 'react';
import { 
    Bell, 
    MapPin,
    ShieldAlert,
    Activity,
    Share2,
    CheckCircle,
    Info,
    Clock
} from 'lucide-react';
import { stationService } from '../services/stationService';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
        // Fetch stations from backend API
        stationService.getAll().then(fetchedStations => {
            setStations(fetchedStations);
            // Generate alerts based on fetched station parameters
            const generatedAlerts = [];
            fetchedStations.forEach(station => {
                // High Turbidity Alert
                if (station.turbidity > 8) {
                    generatedAlerts.push({
                        id: `turbidity-${station.id}`,
                        title: "High Turbidity Detected",
                        station: station.name,
                        location: station.city,
                        stationId: station.id,
                        severity: "High",
                        description: "Turbidity exceeded safe limits indicating contaminated water.",
                        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                    });
                }
                // Acidic or Alkaline Water Alert
                if (station.ph < 6) {
                    generatedAlerts.push({
                        id: `acidic-${station.id}`,
                        title: "Acidic Water Alert",
                        station: station.name,
                        location: station.city,
                        stationId: station.id,
                        severity: "Warning",
                        description: `pH level of ${station.ph} is below safe threshold (6).`,
                        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                    });
                } else if (station.ph > 8.5) {
                    generatedAlerts.push({
                        id: `alkaline-${station.id}`,
                        title: "Chemical Imbalance Alert",
                        station: station.name,
                        location: station.city,
                        stationId: station.id,
                        severity: "Warning",
                        description: `pH level of ${station.ph} is above safe threshold (8.5).`,
                        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                    });
                }
                // Low Oxygen Alert
                if (station.dissolved_oxygen < 5) {
                    generatedAlerts.push({
                        id: `do-${station.id}`,
                        title: "Low Oxygen Alert",
                        station: station.name,
                        location: station.city,
                        stationId: station.id,
                        severity: "Warning",
                        description: "Oxygen levels dropped below safe threshold, posing risks to aquatic life.",
                        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                    });
                }
                // Critical Water Quality Alert
                if (station.wqi < 40) {
                    generatedAlerts.push({
                        id: `wqi-${station.id}`,
                        title: "Critical Water Quality Alert",
                        station: station.name,
                        location: station.city,
                        stationId: station.id,
                        severity: "Critical",
                        description: `Water Quality Index (WQI) is ${station.wqi}, which is dangerously low. Immediate attention required.`,
                        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                    });
                } else if (station.wqi >= 40 && station.wqi < 70) {
                    generatedAlerts.push({
                        id: `wqi-warning-${station.id}`,
                        title: "Water Quality Warning",
                        station: station.name,
                        location: station.city,
                        stationId: station.id,
                        severity: "Warning",
                        description: `WQI of ${station.wqi} indicates moderate water quality concerns.`,
                        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                    });
                }
            });
            // Sort alerts by severity (Critical > High > Warning)
            const severityOrder = { 'Critical': 0, 'High': 1, 'Warning': 2 };
            const sortedAlerts = generatedAlerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
            setAlerts(sortedAlerts);
            if (sortedAlerts.length > 0) {
                setSelectedAlert(sortedAlerts[0]);
            }
        }).catch(err => {
            console.error('Failed to fetch stations:', err);
        });
    }, []);

    const getSeverityStyles = (severity) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return 'bg-red-500/20 text-red-500 border-red-500/30';
            case 'high':
                return 'bg-red-500/10 text-red-400 border-red-400/30';
            case 'warning':
                return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
            default:
                return 'bg-green-500/20 text-green-500 border-green-500/30';
        }
    };

    const handleAcknowledge = (id) => {
        alert(`Alert ${id} Acknowledged`);
    };

    const handleShare = (alertData) => {
        const text = `Water Safety Alert: ${alertData.title}\nSeverity: ${alertData.severity}\nLocation: ${alertData.location}\nStation: ${alertData.station}\n\n${alertData.description}`;
        if (navigator.share) {
            navigator.share({
                title: alertData.title,
                text: text,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert("Alert details copied to clipboard!");
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col p-6 space-y-6 animate-in fade-in duration-700 bg-[#0a0a0a]">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                    Water <span className="text-accent-gold">Alerts</span>
                </h1>
                <p className="text-primary-gray mt-1 text-sm font-medium tracking-wide">
                    Real-time monitoring and contamination advisories
                </p>
            </div>

            {/* Main Content: Split Pane */}
            <div className="flex-1 flex gap-6 min-h-0">
                
                {/* Left Side: Alert List */}
                <div className="w-[35%] overflow-y-auto max-h-[80vh] flex flex-col space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-accent-gold/70">Active Alerts ({alerts.length})</h2>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {alerts.map((alert) => (
                            <div 
                                key={alert.id}
                                onClick={() => setSelectedAlert(alert)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                                    selectedAlert?.id === alert.id 
                                    ? 'bg-accent-gold/10 border-accent-gold/40 ring-1 ring-accent-gold/20' 
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-bold text-sm leading-tight ${selectedAlert?.id === alert.id ? 'text-accent-gold' : 'text-white'}`}>
                                        {alert.title}
                                    </h3>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getSeverityStyles(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-primary-gray flex items-center">
                                        <Activity className="w-3 h-3 mr-1.5 text-accent-gold/50" />
                                        {alert.station}
                                    </p>
                                    <p className="text-[11px] text-primary-gray/70 flex items-center">
                                        <MapPin className="w-3 h-3 mr-1.5 text-accent-gold/30" />
                                        {alert.location}
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] text-white/30 font-mono italic">
                                        {alert.time}
                                    </span>
                                    {selectedAlert?.id === alert.id && (
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse shadow-sm shadow-accent-gold"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Alert Details */}
                <div className="w-[65%] overflow-y-auto max-h-[80vh]">
                    {selectedAlert ? (
                        <div className="min-h-full bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col backdrop-blur-xl relative">
                            {/* Decorative Background Glow */}
                            <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-20 ${
                                selectedAlert.severity === 'Critical' ? 'bg-red-600' : 
                                selectedAlert.severity === 'High' ? 'bg-orange-600' : 'bg-accent-gold'
                            }`}></div>

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Details Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getSeverityStyles(selectedAlert.severity)}`}>
                                                {selectedAlert.severity} Severity
                                            </span>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Issued: {selectedAlert.time}
                                            </span>
                                        </div>
                                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                                            {selectedAlert.title}
                                        </h2>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <ShieldAlert className={`w-8 h-8 ${
                                            selectedAlert.severity === 'Critical' ? 'text-red-500' : 
                                            selectedAlert.severity === 'High' ? 'text-red-400' : 'text-orange-500'
                                        }`} />
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="mb-10">
                                    <h4 className="text-[10px] font-black uppercase text-accent-gold tracking-[0.2em] mb-4 flex items-center">
                                        <Info className="w-3 h-3 mr-2" />
                                        Alert Advisory
                                    </h4>
                                    <p className="text-xl text-white/90 leading-relaxed font-medium">
                                        {selectedAlert.description}
                                    </p>
                                </div>

                                {/* Station Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl group transition-all hover:bg-white/[0.05]">
                                        <p className="text-[10px] font-black uppercase text-primary-gray tracking-widest mb-2 opacity-50">Monitoring Station</p>
                                        <p className="text-lg text-white font-black italic">{selectedAlert.station}</p>
                                        <p className="text-sm text-accent-gold font-bold mt-1">ID: {selectedAlert.stationId}</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl group transition-all hover:bg-white/[0.05]">
                                        <p className="text-[10px] font-black uppercase text-primary-gray tracking-widest mb-2 opacity-50">Affected Area</p>
                                        <p className="text-lg text-white font-black italic">{selectedAlert.location}</p>
                                        <p className="text-sm text-primary-gray/60 font-medium mt-1 uppercase tracking-widest">Regional Catchment</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto flex gap-4">
                                    <button 
                                        onClick={() => handleAcknowledge(selectedAlert.id)}
                                        className="flex-1 py-5 bg-accent-gold hover:bg-accent-gold/90 text-background rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-xl shadow-accent-gold/20 active:scale-95"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Acknowledge Alert</span>
                                    </button>
                                    <button 
                                        onClick={() => handleShare(selectedAlert)}
                                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center space-x-2 active:scale-95"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span>Share with Authorities</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[32px] bg-white/[0.02] text-white/20">
                            <Bell className="w-16 h-16 mb-6 opacity-30" />
                            <p className="text-lg font-black uppercase tracking-widest italic">Select an alert to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alerts;
