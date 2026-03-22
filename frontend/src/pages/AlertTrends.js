import React, { useState, useEffect, useMemo } from 'react';
import { 
    History, 
    Calendar, 
    Filter,
    RefreshCw,
    AlertCircle,
    Activity,
    Waves
} from 'lucide-react';
import { alertService } from '../services/alertService';
import { readingService } from '../services/readingService';
import AlertCharts from '../components/AlertCharts';
import TrendChart from '../components/TrendChart';
import GlassCard from '../components/GlassCard';

const AlertTrends = () => {
    const [alerts, setAlerts] = useState([]);
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('D');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [alertsData, readingsData] = await Promise.all([
                alertService.getAll(),
                readingService.getAll(0, 1000)
            ]);
            setAlerts(alertsData);
            setReadings(readingsData);
        } catch (err) {
            console.error("Failed to fetch historical data:", err);
            setError("Unable to load historical data. Please verify connectivity.");
        } finally {
            setLoading(false);
        }
    };

    // Pivot readings for the TrendChart components
    const pivotedReadings = useMemo(() => {
        if (!readings || readings.length === 0) return [];
        
        const paramMap = {
            'ph': 'pH',
            'turbidity': 'turbidity',
            'dissolved_oxygen': 'dissolvedOxygen',
            'temperature': 'temperature',
            'lead': 'lead',
            'arsenic': 'arsenic'
        };

        const pivotedMap = {};
        readings.forEach(r => {
            const date = new Date(r.recorded_at);
            const ts = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const day = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            const key = `${day} ${ts}`;

            if (!pivotedMap[key]) {
                pivotedMap[key] = { time: ts, fullDate: key, timestamp: date.getTime() };
            }
            
            const pKey = paramMap[r.parameter];
            if (pKey) {
                if (pivotedMap[key][pKey]) {
                    pivotedMap[key][pKey] = (pivotedMap[key][pKey] + r.value) / 2;
                } else {
                    pivotedMap[key][pKey] = r.value;
                }
            }
        });

        return Object.values(pivotedMap).sort((a, b) => a.timestamp - b.timestamp);
    }, [readings]);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                        Strategic <span className="text-accent-gold">Analysis</span>
                    </h1>
                    <p className="text-primary-gray mt-1 text-sm font-medium tracking-wide">
                        Statistical telemetry and categorical distribution of monitoring data
                    </p>
                </div>

                <button 
                    onClick={fetchData}
                    className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs transition-all border border-white/10 shadow-xl shadow-black/20 active:scale-95"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Synchronize Telemetry</span>
                </button>
            </div>

            {loading ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-[450px] bg-white/5 rounded-3xl animate-pulse"></div>
                        <div className="h-[450px] bg-white/5 rounded-3xl animate-pulse"></div>
                    </div>
                    <div className="h-[600px] bg-white/5 rounded-[40px] animate-pulse"></div>
                </div>
            ) : error ? (
                <div className="text-center py-24 bg-white/5 rounded-[40px] border border-dashed border-red-500/20 backdrop-blur-sm">
                    <AlertCircle className="w-16 h-16 text-red-500/20 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Telemetry Interrupt</h2>
                    <p className="text-primary-gray text-sm italic max-w-md mx-auto">{error}</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Alert History Section */}
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold/60 flex items-center ml-4">
                            <History className="w-4 h-4 mr-3" /> Emergency Alert History
                        </h2>
                        {alerts.length > 0 ? (
                            <AlertCharts data={alerts} />
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <History className="w-12 h-12 text-primary-gray/20 mx-auto mb-4" />
                                <h3 className="text-white font-bold mb-1 uppercase tracking-wider">No Incident Records</h3>
                                <p className="text-primary-gray text-sm italic">Historical logs are currently empty.</p>
                            </div>
                        )}
                    </section>

                    {/* Sensor Trends Section */}
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold/60 flex items-center ml-4">
                            <Activity className="w-4 h-4 mr-3" /> Water Quality Telemetry
                        </h2>
                        <GlassCard className="p-10 border-white/5 min-h-[500px] relative overflow-hidden rounded-[40px]">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full -mr-48 -mt-48 blur-[100px] pointer-events-none opacity-50"></div>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/5 pb-8 gap-4">
                                <div>
                                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                                        Multi-Parameter <span className="text-accent-gold">Trend Analysis</span>
                                    </h4>
                                    <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mt-3">Statistical variance across the monitoring fleet</p>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                                    {['H', 'D', 'W', 'M'].map((f) => (
                                        <button 
                                            key={f} 
                                            onClick={() => setTimeFilter(f)}
                                            className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${timeFilter === f ? 'bg-accent-gold text-background shadow-lg shadow-accent-gold/20' : 'text-primary-gray hover:text-white hover:bg-white/5'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {pivotedReadings.length > 0 ? (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-16 gap-y-20">
                                    <TrendChart data={pivotedReadings} dataKey="pH" title="pH Level Stability" color="#10b981" externalTimeRange={timeFilter} />
                                    <TrendChart data={pivotedReadings} dataKey="turbidity" title="Turbidity Variance" color="#f59e0b" externalTimeRange={timeFilter} />
                                    <TrendChart data={pivotedReadings} dataKey="dissolvedOxygen" title="Dissolved Oxygen (DO)" color="#3b82f6" externalTimeRange={timeFilter} />
                                    <TrendChart data={pivotedReadings} dataKey="temperature" title="Thermal Fluctuations" color="#6366f1" externalTimeRange={timeFilter} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
                                    <Waves className="w-20 h-20 mb-8 text-accent-gold animate-pulse" />
                                    <h5 className="text-2xl font-black uppercase italic tracking-tighter">Awaiting Link Establishment</h5>
                                    <p className="text-sm font-medium text-white/60 tracking-wide mt-2">Historical telemetry records are not yet synchronized from the station fleet.</p>
                                </div>
                            )}
                        </GlassCard>
                    </section>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-8 border-white/5 rounded-[32px] hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 bg-accent-gold/10 rounded-2xl text-accent-gold shadow-inner">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">Temporal Range</p>
                            <p className="text-xl text-white font-black italic uppercase tracking-tight">Last 48 Hours</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 border-white/5 rounded-[32px] hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                            <Filter className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">Fleet Scope</p>
                            <p className="text-xl text-white font-black italic uppercase tracking-tight">Active Sectors</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 border-white/5 rounded-[32px] hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
                            <History className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">Telemetry Count</p>
                            <p className="text-xl text-white font-black italic uppercase tracking-tight">{readings.length} Signals</p>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default AlertTrends;
