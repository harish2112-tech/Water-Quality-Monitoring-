import React from 'react';
import StatusBadge from './StatusBadge';
import GlassCard from './GlassCard';

const ReadingCard = ({ label, value, unit, icon: Icon }) => {
    const getStatus = (val, type) => {
        if (val === undefined || val === null || isNaN(val)) return 'unknown';

        const num = Number(val);
        switch (type.toLowerCase()) {
            case 'ph level':
                return (num >= 6.5 && num <= 8.5) ? 'safe' : 'warning';
            case 'dissolved oxygen':
                if (num > 6) return 'safe';
                if (num >= 3) return 'warning';
                return 'critical';
            case 'turbidity':
                if (num < 5) return 'safe';
                if (num <= 10) return 'warning';
                return 'critical';
            default:
                return 'safe'; // Default for lead, arsenic, temp for now
        }
    };

    const status = getStatus(value, label);

    return (
        <GlassCard className="p-4 flex flex-col justify-between hover:border-accent-gold/30 transition-all border-white/5">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">{label}</p>
                <StatusBadge status={status} className="scale-75 origin-right" />
            </div>
            <div className="flex items-center space-x-3">
                {Icon && <Icon className="w-5 h-5 text-accent-gold" />}
                <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-white">{value ?? "--"}</span>
                    <span className="text-xs text-white/60 font-bold">{unit}</span>
                </div>
            </div>
        </GlassCard>
    );
};

export default ReadingCard;
