import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Users,
    Briefcase,
    Calendar,
    Clock,
    Building2,
    Droplet,
    Trash2
} from 'lucide-react';

import GlassCard from '../components/GlassCard';
import { collaborationService } from '../services/collaborationService';
import { stationService } from '../services/stationService';
import { useAuth } from '../context/AuthContext';

const Collaborations = () => {
    const { user } = useAuth();
    const [collaborations, setCollaborations] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        project_name: '',
        ngo_name: '',
        contact_email: '',
        station_id: ''
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [collabs, stationList] = await Promise.all([
                collaborationService.getAll(),
                stationService.getAll()
            ]);
            setCollaborations(collabs);
            setStations(stationList);
        } catch (error) {
            console.error("Error loading collaborations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await collaborationService.create(formData);
            setShowForm(false);
            setFormData({ project_name: '', ngo_name: '', contact_email: '', station_id: '' });
            loadData();
        } catch (error) {
            console.error("Error creating collaboration:", error);
            alert("Failed to create project. Please check if the station ID is valid.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to retire this collaboration?")) {
            try {
                await collaborationService.delete(id);
                loadData();
            } catch (error) {
                console.error("Error deleting collaboration:", error);
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-white">
            <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin mb-4"></div>
            <p className="text-primary-gray font-bold uppercase tracking-widest animate-pulse">Synchronizing Global Projects...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                        Strategic <span className="text-accent-gold">Collaborations</span>
                    </h2>
                    <p className="text-primary-gray text-xs mt-2 font-medium tracking-wide uppercase">
                        NGO Partnership Portal & Water Infrastructure Synergy.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-accent-gold/50 transition-all w-48 md:w-64"
                        />
                    </div>
                    {user?.role === 'ngo' && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center space-x-2 py-2.5 px-6 rounded-xl bg-accent-gold text-background font-black text-xs uppercase tracking-widest shadow-lg shadow-accent-gold/20 hover:scale-102 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Initiate project</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 border-white/5 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-accent-gold/10 text-accent-gold">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-primary-gray uppercase font-black tracking-widest">Active Initiatives</p>
                        <h4 className="text-2xl font-black text-white">{collaborations.length}</h4>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 border-white/5 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-safe/10 text-safe">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-primary-gray uppercase font-black tracking-widest">Partner NGOs</p>
                        <h4 className="text-2xl font-black text-white">
                            {new Set(collaborations.map(c => c.ngo_name)).size}
                        </h4>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 border-white/5 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                        <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-primary-gray uppercase font-black tracking-widest">Covered Stations</p>
                        <h4 className="text-2xl font-black text-white">
                            {new Set(collaborations.map(c => c.station_id)).size}
                        </h4>
                    </div>
                </GlassCard>
            </div>

            {/* Collaborations Grid/List */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {collaborations.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20">
                        <Users className="w-24 h-24 mb-4" />
                        <h3 className="text-2xl font-black uppercase">No Active Synergies</h3>
                        <p className="text-sm font-medium italic">Mission currently waiting for NGO engagement.</p>
                    </div>
                ) : (
                    collaborations.map((collab) => (
                        <GlassCard key={collab.id} className="p-8 border-white/5 group hover:border-accent-gold/20 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-accent-gold/10 transition-all"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-accent-gold transition-colors">
                                        {collab.project_name}
                                    </h3>
                                    <div className="flex items-center mt-2 space-x-3">
                                        <div className="flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                            <Building2 className="w-3 h-3 text-accent-gold mr-1.5" />
                                            <span className="text-[9px] font-black text-primary-gray uppercase tracking-widest">{collab.ngo_name}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 text-white/40 mr-1.5" />
                                            <span className="text-[9px] font-bold text-white/40 uppercase font-mono">
                                                {new Date(collab.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                    <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                        collab.status === 'ACTIVE' 
                                            ? 'bg-safe/10 border-safe/20 text-safe' 
                                            : 'bg-white/5 border-white/10 text-primary-gray'
                                    }`}>
                                        {collab.status}
                                    </div>
                                    {user?.role === 'ngo' && collab.ngo_user_id === user.id && (
                                        <button 
                                            onClick={() => handleDelete(collab.id)}
                                            className="p-2 text-primary-gray hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-6">
                                <div>
                                    <p className="text-[9px] text-primary-gray uppercase font-black tracking-widest mb-1.5">Assigned Sector</p>
                                    <div className="flex items-center">
                                        <div className="p-2 bg-accent-gold/10 rounded-lg mr-3">
                                            <Droplet className="w-4 h-4 text-accent-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase italic">
                                                {stations.find(s => s.id === collab.station_id)?.name || `Station #${collab.station_id}`}
                                            </p>
                                            <p className="text-[9px] text-white/40 uppercase font-mono mt-0.5">Monitoring Node</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] text-primary-gray uppercase font-black tracking-widest mb-1.5">Command Contact</p>
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white/5 rounded-lg mr-3">
                                            <Clock className="w-4 h-4 text-primary-gray" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white truncate max-w-[120px]">{collab.contact_email}</p>
                                            <p className="text-[9px] text-white/40 uppercase font-mono mt-0.5 tracking-tighter">Direct Synergy Link</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>

            {/* Modal for creating a new project */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md">
                    <GlassCard className="w-full max-w-xl p-10 border-accent-gold/30 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Initiate <span className="text-accent-gold">Mission</span></h3>
                                <p className="text-primary-gray text-xs mt-2 uppercase tracking-widest font-black">Register new NGO collaboration project.</p>
                            </div>
                            <button 
                                onClick={() => setShowForm(false)}
                                className="text-primary-gray hover:text-white"
                            >
                                <Plus className="w-8 h-8 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-accent-gold uppercase font-black tracking-[0.2em] ml-1">Project Code Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ex: PureStream Beta"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-all font-bold placeholder:text-white/20"
                                        value={formData.project_name}
                                        onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-accent-gold uppercase font-black tracking-[0.2em] ml-1">Target Monitoring Hub</label>
                                    <select
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-all font-bold"
                                        value={formData.station_id}
                                        onChange={(e) => setFormData({...formData, station_id: parseInt(e.target.value)})}
                                    >
                                        <option value="" className="bg-ocean-deep text-white">Select Node...</option>
                                        {stations.map(s => (
                                            <option key={s.id} value={s.id} className="bg-ocean-deep text-white">
                                                {s.name} ({s.river || 'Regional'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-accent-gold uppercase font-black tracking-[0.2em] ml-1">NGO Organization Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Legal Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-all font-bold placeholder:text-white/20"
                                    value={formData.ngo_name}
                                    onChange={(e) => setFormData({...formData, ngo_name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-accent-gold uppercase font-black tracking-[0.2em] ml-1">Command Sync Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="contact@org.gov"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-all font-bold placeholder:text-white/20"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-accent-gold text-background font-black uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-accent-gold/20 hover:scale-[1.02] active:scale-98 transition-all"
                                >
                                    Deploy Strategy
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default Collaborations;
