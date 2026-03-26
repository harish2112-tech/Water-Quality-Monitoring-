import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    Map as MapIcon,
    FileText,
    Bell,
    Droplet,
    Settings,
    LineChart as ChartIcon,
    HelpCircle,
    X,
    ShieldCheck,
    Briefcase
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const menuItems = [
        { name: 'Map', icon: MapIcon, path: '/dashboard' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Alerts', icon: Bell, path: '/alerts' },
        { name: 'Trends', icon: ChartIcon, path: '/alert-trends' },
        { name: 'Stations', icon: Droplet, path: '/stations' },
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Support', icon: HelpCircle, path: '/support' },
    ];

    // Role-specific portals (Milestone 4)
    if (user?.role === 'ngo' || user?.role === 'admin') {
        menuItems.splice(3, 0, { name: 'NGO Portal', icon: Briefcase, path: '/ngo/dashboard' });
    }
    if (user?.role === 'authority' || user?.role === 'admin') {
        menuItems.splice(4, 0, { name: 'Authority Portal', icon: ShieldCheck, path: '/authority/dashboard' });
    }
    if (user?.role === 'admin') {
        menuItems.splice(5, 0, { name: 'Admin Panel', icon: Settings, path: '/admin/dashboard' });
    }

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed left-0 top-0 h-screen w-64 glass-panel border-r border-white/5 flex flex-col z-50 
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo & Close Button (mobile only) */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shadow-lg shadow-accent-gold/20">
                            <Droplet className="text-background w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Water<span className="text-accent-gold">Watch</span>
                        </span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-primary-gray hover:text-white lg:hidden"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive
                                ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20 shadow-lg shadow-accent-gold/5'
                                : 'text-primary-gray hover:bg-white/5 hover:text-white'}
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile Brief */}
            <div className="p-4 border-t border-white/5">
                <NavLink
                    to="/profile"
                    onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) => `
                        flex items-center space-x-3 p-2 rounded-xl border border-white/5 transition-all
                        ${isActive ? 'bg-accent-gold/10 border-accent-gold/20' : 'bg-white/5 hover:bg-white/10'}
                    `}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-yellow-600 flex items-center justify-center font-bold text-background relative flex-shrink-0">
                        JD
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-safe border-2 border-background rounded-full"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user?.name || "Guest User"}</p>
                        <p className="text-[10px] text-accent-gold uppercase tracking-tighter font-bold">{user?.role || "Visitor"} Account</p>
                    </div>
                </NavLink>
            </div>
        </aside>
    </>
    );
};

export default Sidebar;
