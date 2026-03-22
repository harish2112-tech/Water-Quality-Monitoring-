import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    FileText,
    Droplets,
    Activity,
    Plus,
    Locate
} from 'lucide-react';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import FloatingActionButton from '../components/FloatingActionButton';
import ReportForm from '../components/ReportForm';
import { stationService } from '../services/stationService';
import { alertService } from '../services/alertService';
import { reportService } from '../services/reportService';
import StationMap from '../components/dashboard/StationMap';

const Dashboard = () => {
    const [stations, setStations] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [stationsData, alertsData, reportsData] = await Promise.all([
                    stationService.getAll(),
                    alertService.getAll(),
                    reportService.getAll()
                ]);
                setStations(stationsData);
                setAlerts(alertsData);
                setReports(reportsData);
                setError(null);
            } catch (err) {
                console.error('Dashboard error:', err);
                setError('Failed to fetch monitoring network data. Please ensure backend is active.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const avgWqi = stations.length > 0 
        ? Math.round(stations.reduce((acc, s) => acc + (s.wqi || 0), 0) / stations.length) 
        : 0;

    const stats = [
        { 
            title: 'Active Alerts', 
            value: alerts.length.toString(), 
            icon: AlertTriangle, 
            status: alerts.length > 0 ? 'critical' : 'safe', 
            trend: '0' 
        },
        { 
            title: 'Recent Reports', 
            value: reports.length.toString(), 
            icon: FileText, 
            status: reports.length > 5 ? 'warning' : 'safe', 
            trend: '+12' 
        },
        { 
            title: 'Stations Online', 
            value: stations.length.toString(), 
            icon: Droplets, 
            status: 'safe', 
            trend: '+5' 
        },
        { 
            title: 'Avg Water Quality', 
            value: avgWqi.toString(), 
            unit: 'WQI', 
            icon: Activity, 
            status: avgWqi > 70 ? 'safe' : (avgWqi > 40 ? 'warning' : 'critical'), 
            trend: '-1' 
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-6 relative animate-in fade-in duration-700">
            {/* Top Stats Grid - Desktop Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="flex flex-1 gap-6 h-[calc(100vh-120px)]">
                {/* Map Center */}
                <div className="flex-1 relative h-full">
                    {loading ? (
                        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-sm">
                            <Activity className="w-12 h-12 text-accent-gold animate-pulse mb-4" />
                            <p className="text-white font-medium uppercase tracking-widest text-xs">Syncing Monitoring Fleet...</p>
                        </div>
                    ) : error ? (
                        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-red-500/10 rounded-[40px] border border-red-500/20 backdrop-blur-sm p-6 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-white font-medium mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-bold uppercase tracking-widest text-xs transition-all"
                            >
                                Re-establish Link
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-[40px] overflow-hidden border border-white/10">
                            <StationMap stations={stations} />
                        </div>
                    )}

                    {/* Quick Action Overlay */}
                    {!loading && !error && (
                        <div className="absolute top-6 right-6 z-[1000]">
                            <button className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all shadow-2xl group active:scale-95">
                                <Locate className="w-5 h-5 text-accent-gold group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar List / Mini Analytics */}
                <div className="w-80 hidden xl:flex flex-col space-y-6">
                    <GlassCard className="flex-1 overflow-hidden flex flex-col p-6 rounded-[32px]">
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center opacity-50">
                            <Activity className="w-3 h-3 mr-2 text-accent-gold" />
                            Status Monitoring
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {stations.length > 0 ? (
                                stations.sort((a,b) => (a.wqi || 0) - (b.wqi || 0)).map(station => (
                                    <div 
                                        key={station.id} 
                                        onClick={() => window.location.href = `/stations/${station.id}`}
                                        className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-accent-gold/30 hover:bg-white/[0.05] transition-all group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-black text-white uppercase tracking-tighter italic group-hover:text-accent-gold transition-colors">{station.name}</p>
                                            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                                                (station.wqi || 0) < 40 ? 'bg-red-500 text-red-500' :
                                                (station.wqi || 0) < 70 ? 'bg-orange-500 text-orange-500' :
                                                'bg-green-500 text-green-500'
                                            }`}></span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">WQI Index</span>
                                            <span className={`text-lg font-black italic ${
                                                (station.wqi || 0) < 40 ? 'text-red-500' :
                                                (station.wqi || 0) < 70 ? 'text-orange-500' :
                                                'text-accent-gold'
                                            }`}>{station.wqi || 0}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-20">
                                    <Droplets className="w-12 h-12 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Stations Online</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    <GlassCard className="h-48 p-8 bg-accent-gold/5 flex flex-col justify-center border-accent-gold/10 rounded-[32px] group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-all">
                            <Activity className="w-24 h-24 text-accent-gold" />
                        </div>
                        <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] mb-3 italic">Intelligence Sync</p>
                        <h5 className="text-white font-black text-lg leading-tight mb-2 uppercase italic tracking-tighter">Telemetry fleet currently reporting optimal sync.</h5>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">All sector links active.</p>
                    </GlassCard>
                </div>
            </div>

            {/* Quick Report FAB */}
            <FloatingActionButton onClick={() => setShowForm(true)}>
                <Plus className="w-5 h-5" />
                <span>Submit Quick Report</span>
            </FloatingActionButton>

            {/* Report Form Modal */}
            {showForm && <ReportForm onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default Dashboard;
