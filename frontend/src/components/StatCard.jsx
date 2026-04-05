import React from 'react';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, unit, icon: Icon, trend, status, className = "" }) => {
    const getStatusColor = () => {
        if (status === 'safe') return 'text-safe bg-safe/10 border-safe/20';
        if (status === 'warning') return 'text-warning bg-warning/10 border-warning/20';
        if (status === 'critical') return 'text-critical bg-critical/10 border-critical/20';
        return 'text-accent-gold bg-accent-gold/10 border-accent-gold/20';
    };

    return (
        <GlassCard className={`flex flex-col justify-between h-32 ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">{title}</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                        <h3 className="text-2xl font-bold text-white">{value}</h3>
                        {unit && <span className="text-sm font-medium text-white/60">{unit}</span>}
                    </div>
                </div>
                {Icon && (
                    <div className={`p-2 rounded-lg ${getStatusColor()} border`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>

            {trend && (
                <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-safe' : 'text-critical'}`}>
                        {trend}
                    </span>
                    <span className="text-[10px] text-white/60 ml-1.5 uppercase tracking-tighter">vs last 24h</span>
                </div>
            )}
        </GlassCard>
    );
};

export default StatCard;
