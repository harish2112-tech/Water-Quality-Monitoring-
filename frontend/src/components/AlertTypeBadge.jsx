import React from 'react';

const TYPE_CONFIG = {
    chemical_imbalance: {
        label: 'Chemical Imbalance',
        colors: 'bg-orange-500/10 text-orange-500 border-orange-500/20 ring-orange-500/30'
    },
    aquatic_risk: {
        label: 'Aquatic Risk',
        colors: 'bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/30'
    },
    clarity_warning: {
        label: 'Clarity Warning',
        colors: 'bg-slate-400/10 text-slate-400 border-slate-400/20 ring-slate-400/30'
    },
    ph_variance: {
        label: 'pH Variance',
        colors: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/30'
    },
    wqi_breach: {
        label: 'WQI Breach',
        colors: 'bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/30'
    },
    default: {
        label: 'System Alert',
        colors: 'bg-primary-gray/10 text-primary-gray border-primary-gray/20 ring-primary-gray/30'
    }
};

const AlertTypeBadge = ({ type, className = '' }) => {
    // Normalization: safely retrieve configured aesthetics
    const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;
    
    // In case there is an unmapped backend type, fallback gracefully while auto-formatting the string
    const displayLabel = TYPE_CONFIG[type] ? config.label : 
                         (type ? type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : config.label);

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm ${config.colors} ${className}`}>
            {displayLabel}
        </span>
    );
};

export default AlertTypeBadge;
