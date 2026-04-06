import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alertService } from '../services/alertService';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import { Activity, Zap, Play, Loader2, Info } from 'lucide-react';

const PredictiveAnalytics = () => {
    const { user } = useAuth();
    const [predictiveData, setPredictiveData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [statusData, setStatusData] = useState(null);

    const isAuthorized = user?.role === 'admin' || user?.role === 'authority';

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await alertService.getPredictive("");
            setPredictiveData(data);
        } catch (err) {
            console.error("Failed to load predictive analytics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setStatusData(null);
        try {
            const result = await alertService.generatePredictive();
            setStatusData(`Successfully processed database pipeline. Generated ${result.generated} new prognostic warnings, skipped ${result.skipped} deduplications.`);
            await fetchAnalytics(); // Refresh the board
        } catch (err) {
            console.error("Model Engine Error:", err);
            alert("Failed to execute ML generation sequence.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/5 space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Machine Learning <span className="text-accent-gold">Engine</span></h2>
                    <p className="text-primary-gray text-xs mt-2 font-black uppercase tracking-[0.2em] flex items-center">
                        <Activity className="w-3 h-3 mr-2" />
                        7-Day Trailing Average Analysis Active
                    </p>
                </div>
                
                {isAuthorized && (
                    <button 
                        onClick={handleGenerate}
                        disabled={generating}
                        className="flex justify-center items-center px-6 py-3 bg-ocean-dark border border-accent-gold/50 rounded-xl hover:bg-accent-gold/20 text-accent-gold font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 min-w-[220px]"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> RUNNING CLOUD MODELS...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" fill="currentColor" /> INITIATE FULL SCAN
                            </>
                        )}
                    </button>
                )}
            </div>

            {statusData && (
                <div className="p-4 rounded-xl bg-safe/10 border border-safe/20 text-safe text-xs font-bold uppercase tracking-widest flex items-center animate-in fade-in slide-in-from-top-4">
                    <Info className="w-4 h-4 mr-3" />
                    {statusData}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Information Card */}
                <GlassCard className="p-6 border border-white/5 bg-white/[0.01]">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center mb-4">
                        <Zap className="w-4 h-4 mr-2 text-accent-gold" /> Parameters
                    </h3>
                    <p className="text-xs text-primary-gray leading-relaxed mb-4">
                        The deterministic engine automatically evaluates incoming station data against the following WHO Thresholds utilizing a recursive 7-day average computation to determine imminent deviations:
                    </p>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/5 text-xs text-white">
                            <span className="font-bold">pH Level</span>
                            <span className="text-primary-gray">6.5 - 8.5</span>
                        </li>
                        <li className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/5 text-xs text-white">
                            <span className="font-bold">Turbidity</span>
                            <span className="text-primary-gray">&gt; 4 NTU</span>
                        </li>
                        <li className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/5 text-xs text-white">
                            <span className="font-bold">Dissolved Oxygen</span>
                            <span className="text-primary-gray">&lt; 6 mg/L</span>
                        </li>
                        <li className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/5 text-xs text-white">
                            <span className="font-bold">Lead (Pb) & Arsenic (As)</span>
                            <span className="text-primary-gray">&gt; 0.01 mg/L</span>
                        </li>
                    </ul>
                </GlassCard>

                {/* Alerts List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-critical" /> Live Forecasts
                    </h3>
                    
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-24 bg-white/5 rounded-xl w-full"></div>
                            <div className="h-24 bg-white/5 rounded-xl w-full"></div>
                        </div>
                    ) : predictiveData && predictiveData.length > 0 ? (
                        <div className="space-y-4">
                            {predictiveData.map((alert, idx) => (
                                <GlassCard key={idx} className="p-5 border-l-4 border-l-accent-gold bg-ocean-dark border-y-white/5 border-r-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-black text-white capitalize">{alert.parameter} Forewarning</h4>
                                        <StatusBadge status="warning" className="scale-75 origin-right" />
                                    </div>
                                    <p className="text-xs text-primary-gray font-bold mb-3 italic">{alert.location || `Station ID: ${alert.station_id}`}</p>
                                    <p className="text-xs text-white leading-relaxed">{alert.message}</p>
                                    <div className="mt-4 text-[10px] text-primary-gray uppercase tracking-widest">
                                        Computed: {new Date(alert.issued_at).toLocaleString()}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-8 text-center border-dashed border-white/10 flex flex-col items-center justify-center h-full">
                            <Zap className="w-12 h-12 text-primary-gray mb-4 opacity-50" />
                            <p className="text-sm font-bold text-white mb-2">All Clear Identified</p>
                            <p className="text-xs text-primary-gray">No predictive breaches computationally isolated. The hydrological grid demonstrates high stability indices relative to WHO parameters.</p>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
