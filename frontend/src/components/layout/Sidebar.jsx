import React from 'react';
import {
    LayoutDashboard,
    Map as MapIcon,
    BarChart3,
    Settings,
    LogOut,
    Droplets,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Reports', icon: BarChart3, path: '/reports' },
        { name: 'System Status', icon: Zap, path: '#' },
        { name: 'Settings', icon: Settings, path: '#' },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 z-40 flex flex-col p-6">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-accent-gold to-[#B89830] shadow-lg shadow-accent-gold/20">
                    <Droplets className="w-5 h-5 text-ocean-deep" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter uppercase italic">
                    Water<span className="text-accent-gold"> Monitor</span>
                </span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => item.path !== '#' && navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20'
                                : 'text-ocean-light/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="text-sm font-bold uppercase tracking-widest leading-none">
                                {item.name}
                            </span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="p-4 rounded-2xl bg-ocean-light/5 border border-white/5">
                    <div className="flex items-center gap-2 text-accent-gold mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Sec</span>
                    </div>
                    <p className="text-[10px] text-ocean-light/40 font-bold uppercase leading-tight">
                        Technology protecting <br />Earth's resources.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 font-bold uppercase tracking-widest text-xs"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};
