<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
=======
import React from 'react';
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
import {
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Zap,
    Activity
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
<<<<<<< HEAD
import { alertService } from '../services/alertService';

const Analytics = () => {
    const navigate = useNavigate();
    const [predictiveInsight, setPredictiveInsight] = useState(null);
    const [loadingAI, setLoadingAI] = useState(true);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const alerts = await alertService.getPredictive();
                if (alerts && alerts.length > 0) {
                    setPredictiveInsight(alerts[0]);
                }
            } catch (err) {
                console.error("AI Prediction fetch error:", err);
            } finally {
                setLoadingAI(false);
            }
        };
        fetchPredictions();
    }, []);
=======

const Analytics = () => {
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
    const metrics = [
        { label: 'pH Level', value: '7.2', trend: 'stable', change: '0.1', color: '#10b981' },
        { label: 'Turbidity', value: '4.5', trend: 'up', change: '0.8', color: '#f59e0b' },
        { label: 'Dissolved Oxygen', value: '6.8', trend: 'down', change: '1.2', color: '#3b82f6' },
        { label: 'Lead Level', value: '0.01', trend: 'stable', change: '0.001', color: '#ef4444' },
    ];

    const anomalies = [
        { param: 'pH Level', value: '9.2', station: 'Station ST-004', time: '14:20', severity: 'critical' },
        { param: 'Turbidity', value: '12.5', station: 'Station ST-002', time: '12:45', severity: 'warning' },
        { param: 'Arsenic', value: '0.08', station: 'Station ST-004', time: '11:10', severity: 'critical' },
    ];

    return (
        <div className="max-w-md mx-auto space-y-6 pb-20 md:max-w-none md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3">
            {/* Metric Cards */}
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, idx) => (
                    <GlassCard key={idx} className="p-5 flex items-center justify-between border-white/5">
                        <div className="flex-1">
                            <p className="text-[10px] text-primary-gray uppercase font-black tracking-widest mb-1">{m.label}</p>
                            <div className="flex items-baseline space-x-2">
                                <h3 className="text-2xl font-black text-white">{m.value}</h3>
                                <div className="flex items-center space-x-1">
                                    {m.trend === 'up' ? <TrendingUp className="w-3 h-3 text-critical" /> :
                                        m.trend === 'down' ? <TrendingDown className="w-3 h-3 text-safe" /> :
                                            <Activity className="w-3 h-3 text-accent-gold" />}
                                    <span className={`text-[10px] font-bold ${m.trend === 'up' ? 'text-critical' : m.trend === 'down' ? 'text-safe' : 'text-accent-gold'}`}>
                                        {m.change}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: m.color, backgroundColor: m.color }}></div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Anomalies Section */}
            <div className="space-y-4 md:col-span-1">
                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-critical" />
                    Recent Anomalies
                </h4>
                <div className="space-y-3">
                    {anomalies.map((a, idx) => (
                        <GlassCard key={idx} className="p-4 border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-white group-hover:text-accent-gold transition-colors">{a.param} Alert</span>
                                <StatusBadge status={a.severity} className="scale-75 origin-right" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-primary-gray font-bold italic">{a.station}</p>
                                    <p className="text-[10px] text-primary-gray">{a.time} - GMT+5:30</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">{a.value}</p>
                                    <p className="text-[8px] text-primary-gray uppercase tracking-tighter">Recorded Value</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Predictive Alert Card */}
            <div className="space-y-4 md:col-span-1">
                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-accent-gold" />
                    Intelligence
                </h4>
                <GlassCard className="p-6 bg-accent-gold/5 border-accent-gold/20 relative overflow-hidden h-fit">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <Activity className="w-24 h-24 text-accent-gold" />
                    </div>
                    <p className="text-[10px] text-accent-gold font-black uppercase tracking-[0.2em] mb-3">AI Prediction</p>
<<<<<<< HEAD
                    {loadingAI ? (
                        <div className="animate-pulse space-y-2 mb-6">
                            <div className="h-4 bg-accent-gold/20 rounded w-3/4"></div>
                            <div className="h-3 bg-white/5 rounded w-full"></div>
                            <div className="h-3 bg-white/5 rounded w-5/6"></div>
                        </div>
                    ) : predictiveInsight ? (
                        <>
                            <h5 className="text-lg font-bold text-white leading-tight mb-4">
                                {predictiveInsight.message}
                            </h5>
                            <p className="text-xs text-primary-gray leading-relaxed mb-6">
                                Hydrological models detect anomalous {predictiveInsight.parameter} trajectories near {predictiveInsight.location || "monitored zones"} indicating a potential breach threshold.
                            </p>
                        </>
                    ) : (
                        <>
                            <h5 className="text-lg font-bold text-white leading-tight mb-4">Baseline Models Stable</h5>
                            <p className="text-xs text-primary-gray leading-relaxed mb-6">Deep learning algorithms scanning trailing averages identify no imminent quality index breaches.</p>
                        </>
                    )}
                    <button 
                        onClick={() => navigate('/analytics/predictive')}
                        className="w-full py-3 rounded-xl bg-accent-gold text-background font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent-gold/20"
                    >
=======
                    <h5 className="text-lg font-bold text-white leading-tight mb-4">Potential Low Dissolved Oxygen Event predicted in 24–48 hours.</h5>
                    <p className="text-xs text-primary-gray leading-relaxed mb-6">Hydrological models suggest a decrease in flow rate coupled with rising temperatures near Indus Basin.</p>
                    <button className="w-full py-3 rounded-xl bg-accent-gold text-background font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent-gold/20">
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
                        View Full Analytics
                    </button>
                </GlassCard>
            </div>

<<<<<<< HEAD
=======
            {/* Bottom Nav Placeholder for Mobile - Logic in App.js but UI shown here for style */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-white/10 flex items-center justify-around px-6 z-50">
                <button className="flex flex-col items-center text-accent-gold">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-[8px] uppercase font-bold mt-1">Alerts</span>
                </button>
                <button className="flex flex-col items-center text-primary-gray">
                    <Activity className="w-5 h-5" />
                    <span className="text-[8px] uppercase font-bold mt-1">Analytics</span>
                </button>
                <button className="flex flex-col items-center text-primary-gray">
                    <div className="w-5 h-5 rounded-full bg-accent-gold/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent-gold"></div>
                    </div>
                    <span className="text-[8px] uppercase font-bold mt-1">Profile</span>
                </button>
            </div>
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
        </div>
    );
};

export default Analytics;
