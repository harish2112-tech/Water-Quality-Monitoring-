import React from 'react';
import GlassCard from '../../components/GlassCard';
import { ShieldCheck, FileText, Bell } from 'lucide-react';

const AuthorityDashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                    Authority <span className="text-accent-gold">Dashboard</span>
                </h1>
                <p className="text-primary-gray mt-1 text-sm font-medium tracking-wide">
                    Official water quality moderation and incident management center
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-6 border-white/5 bg-white/5 text-center">
                    <div className="flex items-center justify-center space-x-3 text-accent-gold mb-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Pending Reports</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">0</div>
                </GlassCard>
                <GlassCard className="p-6 border-white/5 bg-white/5 text-center">
                    <div className="flex items-center justify-center space-x-3 text-accent-gold mb-2">
                        <Bell className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Active Alerts</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">0</div>
                </GlassCard>
            </div>

            <GlassCard className="p-10 border-dashed border-white/10 flex flex-col items-center justify-center min-h-[400px] opacity-40">
                <ShieldCheck className="w-16 h-16 text-accent-gold/20 mb-4" />
                <h2 className="text-xl font-black uppercase text-white tracking-widest">Authority Control Center Initializing</h2>
                <p className="text-sm text-primary-gray mt-2 font-medium">Moderation queue and alert management coming in Milestone 4.</p>
            </GlassCard>
        </div>
    );
};

export default AuthorityDashboard;
