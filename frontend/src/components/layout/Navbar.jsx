import React from 'react';
import { Droplets, Bell, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between backdrop-blur-xl bg-ocean-deep/40 border-ocean-light/20">

                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-ocean-light/10 border border-ocean-light/20">
                        <Droplets className="w-6 h-6 text-ocean-glow" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-ocean-glow bg-clip-text text-transparent">
                        Water Monitor
                    </span>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/50 group-focus-within:text-ocean-glow transition-colors" />
                        <input
                            type="text"
                            placeholder="Search zones, sensors, or alerts..."
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-ocean-glow/30 focus:bg-black/30 transition-all"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full hover:bg-white/5 text-ocean-light/70 hover:text-ocean-glow transition-colors relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    </motion.button>

                    <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">Dr. Sarah Chen</p>
                            <p className="text-xs text-ocean-light/60">Lead Analyst</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-light to-ocean-deep border border-ocean-light/30 flex items-center justify-center">
                            <span className="font-bold text-sm">SC</span>
                        </div>
                    </div>

                    <button className="md:hidden p-2 text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
