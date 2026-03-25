import React from 'react';
import GlassCard from '../../components/GlassCard';
import { Users, FileText, Briefcase } from 'lucide-react';

const NgoDashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                    NGO <span className="text-accent-gold">Portal</span>
                </h1>
                <p className="text-primary-gray mt-1 text-sm font-medium tracking-wide">
                    Community collaboration and regional water monitoring management
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-6 border-white/5 bg-white/5">
                    <div className="flex items-center space-x-3 text-accent-gold mb-2">
                        <Briefcase className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Active Projects</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">0</div>
                </GlassCard>
                <GlassCard className="p-6 border-white/5 bg-white/5">
                    <div className="flex items-center space-x-3 text-accent-gold mb-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Linked Reports</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">0</div>
                </GlassCard>
            </div>

            <GlassCard className="p-10 border-dashed border-white/10 flex flex-col items-center justify-center min-h-[400px] opacity-40">
                <Users className="w-16 h-16 text-accent-gold/20 mb-4" />
                <h2 className="text-xl font-black uppercase text-white tracking-widest">Dashboard Initializing</h2>
                <p className="text-sm text-primary-gray mt-2 font-medium">Collaboration features and project tracking coming in Milestone 4.</p>
            </GlassCard>
        </div>
    );
};

export default NgoDashboard;
