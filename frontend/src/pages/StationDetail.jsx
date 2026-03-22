import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Building2,
    Clock,
    Zap,
    Users,
    Thermometer,
    Wind,
    ShieldCheck,
    AlertCircle,
    AlertTriangle,
    Activity,
    Droplets,
    Waves
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import TrendChart from '../components/TrendChart';
import ReadingCard from '../components/ReadingCard';
import AlertTrigger from '../components/AlertTrigger';
import { stationService } from '../services/stationService';
import { readingService } from '../services/readingService';

const StationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('D');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stationData, readingsData] = await Promise.all([
                    stationService.getById(id),
                    readingService.getByStation(id)
                ]);

                setStation(stationData);
                setReadings(readingsData || []);
            } catch (error) {
                console.error("Error fetching station details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-white">
            <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin mb-4"></div>
            <p className="text-primary-gray font-bold uppercase tracking-widest animate-pulse">Loading Telemetry Fleet...</p>
        </div>
    );

    if (!station) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-white">
            <AlertCircle className="w-16 h-16 text-critical mb-4 opacity-20" />
            <h2 className="text-2xl font-black uppercase mb-2">Station Registry Error</h2>
            <p className="text-primary-gray mb-8">The requested monitoring station could not be located in our secure database.</p>
            <button
                onClick={() => navigate('/dashboard')}
                className="py-3 px-8 rounded-xl bg-accent-gold text-ocean-deep font-black uppercase tracking-widest"
            >
                Return to Core Map
            </button>
        </div>
    );

    const currentReading = (readings && readings.length > 0) ? readings[readings.length - 1] : {};

    const readingParams = [
        { label: 'pH Level', value: currentReading?.pH || station.ph, unit: 'pH', icon: Activity },
        { label: 'Turbidity', value: currentReading?.turbidity || station.turbidity, unit: 'NTU', icon: Droplets },
        { label: 'Dissolved Oxygen', value: currentReading?.dissolvedOxygen || station.dissolved_oxygen, unit: 'mg/L', icon: Wind },
        { label: 'Lead', value: currentReading?.lead || station.lead, unit: 'ppm', icon: ShieldCheck },
        { label: 'Arsenic', value: currentReading?.arsenic || station.arsenic, unit: 'ppm', icon: AlertCircle },
        { label: 'Temperature', value: currentReading?.temperature || station.temperature, unit: '°C', icon: Thermometer },
    ];

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-700">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-primary-gray hover:text-white transition-colors group mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Back to Fleet Overview</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Station Info */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard className="p-8 border-accent-gold/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                        <div className="mb-8">
                            <p className="text-[10px] text-accent-gold uppercase tracking-[0.3em] font-black mb-2 flex items-center">
                                <Waves className="w-3 h-3 mr-2" /> {station.river || "Regional Waters"}
                            </p>
                            <h1 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">{station.name}</h1>
                            <div className="mt-4 flex items-center space-x-3">
                                <StatusBadge status={station.status} className="scale-110 origin-left" />
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none border-l border-white/10 pl-3">
                                    Sector: {station.city || "Remote"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-start space-x-4">
                                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 mt-1">
                                    <MapPin className="w-5 h-5 text-accent-gold" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">Global Coordinates</p>
                                    <p className="text-white font-mono text-sm mt-0.5 tracking-tight group-hover:text-accent-gold transition-colors">
                                        {station.latitude?.toFixed?.(6)}, {station.longitude?.toFixed?.(6)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 mt-1">
                                    <Building2 className="w-5 h-5 text-accent-gold" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">Managed By</p>
                                    <p className="text-white text-sm font-bold italic mt-0.5">{station.managed_by || "Central Water Authority"}</p>
                                    <p className="text-[10px] text-white/40 mt-1 uppercase font-mono tracking-tighter italic">ID: WQM-{station.id}-SYS</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 mt-1">
                                    <Clock className="w-5 h-5 text-accent-gold" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">Last Update</p>
                                    <p className="text-white text-sm mt-0.5 font-medium">
                                        {new Date(station.last_transmission).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (System Time)
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <span className="w-2 h-2 bg-safe rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                                        <span className="text-[10px] text-safe font-black uppercase tracking-tighter">Live Telemetry Link Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10 border-t border-white/5 pt-8">
                            <button className="py-3 px-4 rounded-xl border border-accent-gold/30 text-accent-gold text-xs font-black uppercase tracking-widest hover:bg-accent-gold/10 transition-all flex items-center justify-center space-x-2">
                                <Zap className="w-4 h-4" />
                                <span>Broadcast</span>
                            </button>
                            <button className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>Collaborate</span>
                            </button>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 bg-white/5 border-white/5 hover:border-accent-gold/20 transition-all">
                        <h4 className="text-white font-bold mb-4 flex items-center justify-between">
                            <span className="flex items-center uppercase text-[10px] font-black tracking-[0.2em]"><ShieldCheck className="w-4 h-4 mr-2 text-safe" /> Water Quality Index</span>
                            <span className="text-3xl font-black text-accent-gold italic">{station.wqi || "0"}</span>
                        </h4>
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-4 p-0 border border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${station.status === 'critical' ? 'bg-critical shadow-[0_0_15px_rgba(239,68,68,0.6)]' :
                                    station.status === 'warning' ? 'bg-warning shadow-[0_0_15px_rgba(245,158,11,0.6)]' :
                                        'bg-safe shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                                    }`}
                                style={{ width: `${station.wqi || 0}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed italic font-medium">
                            Current WQI indicates a "{station.status?.toUpperCase() || 'UNKNOWN'}" health status for this sector.
                        </p>
                    </GlassCard>
                </div>

                {/* Right Column: Readings & Charts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {readingParams.map((param, idx) => (
                            <ReadingCard key={idx} {...param} />
                        ))}
                    </div>

                    <GlassCard className="p-10 border-white/5 min-h-[500px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                        
                        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Scientific <span className="text-accent-gold">Trend Analysis</span></h4>
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Advanced multi-parameter telemetry link</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {['H', 'D', 'W', 'M'].map((f) => (
                                    <button 
                                        key={f} 
                                        onClick={() => setTimeFilter(f)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border ${timeFilter === f ? 'bg-accent-gold border-accent-gold text-background shadow-lg shadow-accent-gold/20' : 'bg-white/5 border-white/10 text-white hover:border-white/20'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {readings.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16">
                                <TrendChart data={readings} dataKey="pH" title="pH Level Variance" color="#10b981" externalTimeRange={timeFilter} />
                                <TrendChart data={readings} dataKey="turbidity" title="Turbidity Fluctuation" color="#f59e0b" externalTimeRange={timeFilter} />
                                <TrendChart data={readings} dataKey="dissolvedOxygen" title="Dissolved Oxygen (DO)" color="#3b82f6" externalTimeRange={timeFilter} />
                                <TrendChart data={readings} dataKey="lead" title="Lead Concentration" color="#ef4444" externalTimeRange={timeFilter} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                <Activity className="w-24 h-24 mb-6 text-accent-gold animate-pulse" />
                                <h5 className="text-xl font-black uppercase italic tracking-tighter">No Active Telemetry</h5>
                                <p className="text-sm font-medium text-white/60">Waiting for secure data transmission from the sensor fleet.</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default StationDetail;
