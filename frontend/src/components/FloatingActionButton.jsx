import React from 'react';
import { motion } from 'framer-motion';

const FloatingActionButton = ({ children, onClick, className = "", position = "bottom-8 right-8" }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`fixed ${position} px-6 py-3 rounded-full gold-gradient text-background font-bold shadow-lg shadow-accent-gold/30 hover:shadow-accent-gold/50 transition-all flex items-center space-x-2 z-50 ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default FloatingActionButton;
