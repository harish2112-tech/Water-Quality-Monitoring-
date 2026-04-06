import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Bell, 
    MapPin, 
    Clock, 
    ShieldAlert,
    AlertTriangle,
    Droplets,
    ZapOff,
    Share2,
    Printer
} from 'lucide-react';
import { alertService } from '../services/alertService';
import GlassCard from '../components/GlassCard';

const AlertDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                setLoading(true);
                const data = await alertService.getById(id);
                setAlert(data);
            } catch (error) {
                console.error("Failed to fetch alert details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlert();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-white">
            <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin mb-4"></div>
            <p className="text-primary-gray font-bold uppercase tracking-widest animate-pulse">Retrieving Advisory...</p>
        </div>
    );

    if (!alert) return (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <h3 className="text-white font-bold mb-1 uppercase tracking-wider">Alert Not Found</h3>
            <button onClick={() => navigate('/alerts')} className="mt-4 text-accent-gold font-bold">Back to Alerts</button>
        </div>
    );

    const getTypeIcon = (type) => {
        switch (type) {
            case 'boil_notice': return <AlertTriangle className="w-10 h-10 text-accent-gold" />;
            case 'contamination': return <Droplets className="w-10 h-10 text-red-400" />;
            case 'outage': return <ZapOff className="w-10 h-10 text-primary-gray" />;
            default: return <Bell className="w-10 h-10 text-white" />;
        }
    };

    const getTypeName = (type) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getThemeColor = (type) => {
        switch (type) {
            case 'boil_notice': return 'text-accent-gold';
            case 'contamination': return 'text-red-400';
            default: return 'text-primary-gray';
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'boil_notice': return 'bg-accent-gold/10';
            case 'contamination': return 'bg-red-500/10';
            default: return 'bg-white/5';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/alerts')}
                className="flex items-center text-primary-gray hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Advisory List</span>
            </button>

            <GlassCard className="p-0 overflow-hidden border-white/5 shadow-2xl">
                {/* Header Decoration */}
                <div className={`h-2 w-full ${
                    alert.type === 'boil_notice' ? 'bg-accent-gold' :
                    alert.type === 'contamination' ? 'bg-red-500' : 'bg-primary-gray'
                }`}></div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className={`p-6 rounded-3xl ${getBgColor(alert.type)} flex-shrink-0 animate-in zoom-in-50 duration-500`}>
                            {getTypeIcon(alert.type)}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <span className={`text-xs font-black uppercase tracking-[0.3em] ${getThemeColor(alert.type)} mb-2 block`}>
                                    Official Public Advisory
                                </span>
                                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                                    {getTypeName(alert.type)}
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 text-primary-gray">
                                    <MapPin className="w-5 h-5 text-accent-gold" />
                                    <span className="font-bold text-white italic">{alert.location}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-primary-gray">
                                    <Clock className="w-5 h-5 text-accent-gold" />
                                    <span className="font-mono text-xs">{new Date(alert.issued_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-8 bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold opacity-50 flex items-center">
                                <ShieldAlert className="w-3 h-3 mr-2" /> Advisory Details
                            </h3>
                            <p className="text-lg text-white font-medium leading-relaxed">
                                {alert.message}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-4 border-t border-white/5 pt-8">
                        <button className="flex-1 py-4 bg-accent-gold text-background rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent-gold/20 flex items-center justify-center space-x-2">
                            <Share2 className="w-4 h-4" />
                            <span>Broadcast Advisory</span>
                        </button>
                        <button className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                            <Printer className="w-4 h-4" />
                            <span>Print Report</span>
                        </button>
                    </div>
                </div>
            </GlassCard>

            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                <p className="text-[10px] text-primary-gray text-center italic leading-relaxed uppercase tracking-tighter">
                    This is an automated system advisory issued by the Water Quality Monitoring fleet. 
                    Please follow local authority instructions immediately.
                </p>
            </div>
        </div>
    );
};

export default AlertDetail;
