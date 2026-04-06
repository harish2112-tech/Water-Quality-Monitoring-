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
    Users,
    HelpCircle,
    Shield,
    LayoutDashboard,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const role = user?.role?.toLowerCase() || 'citizen';

    const menuItems = [
        { name: 'NGO Portal', icon: LayoutDashboard, path: '/ngo/dashboard', roles: ['ngo', 'admin'] },
        { name: 'Command Center', icon: Shield, path: '/authority/dashboard', roles: ['admin', 'authority'] },
        { name: 'Map', icon: MapIcon, path: '/dashboard' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Alerts', icon: Bell, path: '/alerts' },
        { name: 'Trends', icon: ChartIcon, path: '/alert-trends' },
        { name: 'Stations', icon: Droplet, path: '/stations' },
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Collaborations', icon: Users, path: '/collaborations', roles: ['ngo', 'admin'] },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Support', icon: HelpCircle, path: '/support' },
    ];

    const filteredItems = menuItems.filter(item => !item.roles || item.roles.includes(role));

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen w-64 glass-panel border-r border-white/5 flex flex-col z-50
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {/* Logo + Mobile Close */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shadow-lg shadow-accent-gold/20">
                            <Droplet className="text-background w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Water<span className="text-accent-gold">Watch</span>
                        </span>
                    </div>

                    {/* Close button - only visible on mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-xl text-primary-gray hover:text-white hover:bg-white/10 transition-all"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
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
                        onClick={onClose}
                        className={({ isActive }) => `
                            flex items-center space-x-3 p-2 rounded-xl border border-white/5 transition-all
                            ${isActive ? 'bg-accent-gold/10 border-accent-gold/20' : 'bg-white/5 hover:bg-white/10'}
                        `}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-yellow-600 flex items-center justify-center font-bold text-background relative flex-shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-safe border-2 border-background rounded-full"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-primary-gray uppercase tracking-tighter">{user?.role || 'Citizen'}</p>
                        </div>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
