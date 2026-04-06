import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'glass-card rounded-[24px] p-8 relative overflow-hidden transition-all duration-500',
                    'bg-white/5 backdrop-blur-xl border border-white/10',
                    'hover:shadow-[0_0_30px_rgba(144,224,239,0.15)] hover:border-ocean-light/30',
                    'shadow-2xl shadow-black/40',
                    className
                )
            )}
            {...props}
        >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />

            {/* Edge highlighting */}
            <div className="absolute inset-0 border border-white/5 rounded-[24px] pointer-events-none" />

            <div className="relative z-10">{children}</div>
        </div>
    );
};
