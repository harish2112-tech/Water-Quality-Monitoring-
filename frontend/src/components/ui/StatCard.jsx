import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const StatCard = ({ title, value, unit, icon: Icon, color = "ocean-light", className }) => {
    const [count, setCount] = useState(0);

    // Custom hook for counting animation
    useEffect(() => {
        let start = 0;
        const end = parseInt(value.toString().replace(/,/g, ''), 10);
        if (start === end) return;

        let timer = setInterval(() => {
            start += Math.ceil(end / 100);
            if (start > end) start = end;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, 20);

        return () => clearInterval(timer);
    }, [value]);

    const colorVariants = {
        "ocean-light": "text-ocean-light border-ocean-light/10 bg-ocean-light/5",
        "ocean-glow": "text-ocean-glow border-ocean-glow/10 bg-ocean-glow/5",
        "ocean-DEFAULT": "text-ocean-DEFAULT border-ocean-DEFAULT/10 bg-ocean-DEFAULT/5",
        "accent-gold": "text-accent-gold border-accent-gold/10 bg-accent-gold/5",
        "green": "text-[#2A9D8F] border-[#2A9D8F]/10 bg-[#2A9D8F]/5",
        "red": "text-rose-500 border-rose-500/10 bg-rose-500/5",
        "purple": "text-purple-400 border-purple-400/10 bg-purple-400/5",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className={twMerge(
                clsx(
                    'glass-card relative overflow-hidden group border border-white/5',
                    'hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500',
                    className
                )
            )}
        >
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-[10px] font-black text-ocean-light/40 uppercase tracking-[0.2em] mb-1">{title}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white tracking-tighter italic">
                            {count.toLocaleString()}
                        </span>
                        {unit && <span className="text-[10px] font-bold text-white/30 uppercase">{unit}</span>}
                    </div>
                </div>
                <div className={clsx("p-2.5 rounded-2xl border transition-colors duration-500", colorVariants[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {/* Decorative Wave Animation */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-5 group-hover:opacity-20 transition-opacity duration-700">
                <svg className="absolute bottom-0 w-[200%] h-full animate-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="currentColor" className={color === 'red' ? 'text-rose-500' : 'text-accent-gold'} fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </motion.div>
    );
};
