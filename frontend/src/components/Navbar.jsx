import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard Overview';
        if (path === '/map') return 'Water Station Network';
        if (path.startsWith('/stations')) return 'Station Details';
        if (path === '/reports') return 'Citizen Reports';
        if (path === '/analytics') return 'Data Analytics';
        if (path === '/profile') return 'User Profile';
        return 'WaterWatch';
    };

    return (
        <header className="fixed top-0 right-0 left-64 h-16 glass-panel border-b border-white/5 px-8 flex items-center justify-between z-40">
            <div>
                <h1 className="text-xl font-bold text-white tracking-wide uppercase text-glow-gold">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center space-x-6">

                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray group-focus-within:text-accent-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search stations..."
                        className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all w-64"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button className="relative p-2 text-primary-gray hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-critical rounded-full border-2 border-background shadow-lg shadow-critical/50"></span>
                    </button>

                    {/* ✅ FIXED HERE */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center space-x-2 p-1 pl-3 pr-1 rounded-full bg-white/5 border border-white/10 hover:border-accent-gold/30 transition-all cursor-pointer"
                    >
                        <span className="text-sm font-medium text-white hidden lg:block">Admin Panel</span>
                        <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center">
                            <User className="text-background w-5 h-5" />
                        </div>
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Navbar;