import React, { useState, useEffect } from 'react';
import { 
    Users, 
    FileText, 
    Bell, 
    Plus, 
    Search,
    Filter,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import api from '../../services/api';
import CollaborationsList from '../../components/ngo/CollaborationsList';
import SubmitCollaborationForm from '../../components/ngo/SubmitCollaborationForm';
import BaseMapView from '../BaseMapView';
import { useMap } from '../../context/MapContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        activeProjects: 0,
        reportsInArea: 0,
        activeAlerts: 0
    });
    const [loading, setLoading] = useState(true);
    const { setShowNGOStations } = useMap();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real scenario, these would be customized for the NGO's scope
                const [collabs, reports, alerts] = await Promise.all([
                    api.get('/api/v1/collaborations?status=active'),
                    api.get('/api/v1/reports'), // area filter can be added when scope is defined
                    api.get('/api/v1/alerts')   // location filter can be added
                ]);

                setStats({
                    activeProjects: collabs.data.length,
                    reportsInArea: reports.data.length,
                    activeAlerts: alerts.data.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        setShowNGOStations(true); // Ensure NGO stations are visible when entering dashboard
    }, [setShowNGOStations]);

    const kpiCards = [
        { label: 'Active Projects', value: stats.activeProjects, icon: Users, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
        { label: 'Reports in Area', value: stats.reportsInArea, icon: FileText, color: 'text-safe', bg: 'bg-safe/10' },
        { label: 'Active Alerts', value: stats.activeAlerts, icon: Bell, color: 'text-critical', bg: 'bg-critical/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">NGO Collaboration <span className="text-accent-gold">Portal</span></h1>
                    <p className="text-primary-gray font-medium">Coordinate water quality projects and respond to community reports.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                        <Filter className="w-4 h-4 text-accent-gold" />
                        <span>Filter Scope</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpiCards.map((card, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent-gold/30 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-bl-full -mr-8 -mt-8 opacity-20 group-hover:scale-110 transition-transform duration-500`}></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-primary-gray group-hover:text-white transition-colors" />
                        </div>
                        {loading ? (
                            <div className="h-10 w-20 bg-white/5 animate-pulse rounded-lg"></div>
                        ) : (
                            <div className="text-4xl font-black text-white mb-1 tracking-tighter">{card.value}</div>
                        )}
                        <div className="text-xs font-bold text-primary-gray uppercase tracking-widest">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Ongoing Collaborations</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray" />
                                <input 
                                    type="text" 
                                    placeholder="Search projects..." 
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-accent-gold/50 transition-all w-48 md:w-64"
                                />
                            </div>
                        </div>
                        <CollaborationsList />
                    </div>
                </div>

                {/* Sidebar / Form Section */}
                <div className="space-y-8">
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 gold-gradient-border relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent-gold/20 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-accent-gold" />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">New Project</h2>
                            </div>
                            <SubmitCollaborationForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center space-x-3">
                        <span className="w-2 h-8 bg-accent-gold rounded-full"></span>
                        <span>Interactive Resource Map</span>
                    </h2>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-primary-gray uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></div>
                        <span>Live GIS Data</span>
                    </div>
                </div>
                <div className="h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <BaseMapView />
                    <div className="absolute top-4 left-4 z-[1000] glass-panel p-4 rounded-2xl border border-white/10 max-w-xs">
                        <p className="text-[10px] font-black text-accent-gold uppercase tracking-[0.2em] mb-2">NGO View Enabled</p>
                        <p className="text-xs text-white/70 leading-relaxed font-medium">NGO-managed stations are highlighted in <span className="text-teal-400 font-bold">TEAL</span>. General monitoring stations remain <span className="text-blue-400 font-bold">BLUE</span>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
