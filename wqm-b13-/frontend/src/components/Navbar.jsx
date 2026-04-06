import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = user?.role?.toLowerCase() || 'citizen';

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard Overview';
        if (path === '/map') return 'Water Station Network';
        if (path.startsWith('/stations')) return 'Station Details';
        if (path === '/reports') return 'Citizen Reports';
        if (path === '/analytics') return 'Data Analytics';
        if (path === '/profile') return 'User Profile';
        if (path === '/admin/users') return 'User Management';
        return 'WaterWatch';
    };

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass-panel border-b border-white/5 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-40">
            <div className="flex items-center space-x-3">
                {/* Hamburger Menu - only on mobile */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-xl text-primary-gray hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <h1 className="text-base sm:text-xl font-bold text-white tracking-wide uppercase text-glow-gold truncate">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">

                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray group-focus-within:text-accent-gold transition-colors" />
                    <input
                        type="search"
                        name="station-search"
                        id="station-search"
                        autoComplete="off"
                        spellCheck="false"
                        data-1p-ignore="true"
                        data-lpignore="true"
                        placeholder="Search stations..."
                        className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all w-64"
                    />
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="relative p-2 text-primary-gray hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-critical rounded-full border-2 border-background shadow-lg shadow-critical/50"></span>
                    </button>

                    {/* ✅ FIXED HERE */}
                    {role === 'admin' ? (
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="flex items-center space-x-2 p-1 pl-2 sm:pl-3 pr-1 rounded-full bg-white/5 border border-white/10 hover:border-accent-gold/30 transition-all cursor-pointer"
                        >
                            <span className="text-sm font-medium text-white hidden sm:block">Admin Panel</span>
                            <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center">
                                <User className="text-background w-5 h-5" />
                            </div>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center space-x-2 p-1 pl-2 sm:pl-3 pr-1 rounded-full bg-white/5 border border-white/10 hover:border-accent-gold/30 transition-all cursor-pointer"
                        >
                            <span className="text-sm font-medium text-white hidden sm:block">Profile</span>
                            <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center">
                                <User className="text-background w-5 h-5" />
                            </div>
                        </button>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Navbar;