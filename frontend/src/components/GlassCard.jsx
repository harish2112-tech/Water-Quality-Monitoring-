import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", onClick, hover = true }) => {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.01 } : {}}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`glass-card rounded-xl p-4 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
