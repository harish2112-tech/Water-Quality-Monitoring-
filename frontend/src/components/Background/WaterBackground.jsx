import React from 'react';

export const WaterBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-ocean-deep">
            {/* Deep Ocean Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark via-ocean-deep to-slate-dark opacity-90" />

            {/* Floating Orbs/Glows */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-ocean-light/10 to-transparent animate-float opacity-30 blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[150%] h-[150%] bg-gradient-radial from-ocean-glow/5 to-transparent animate-float-slow opacity-20 delay-1000 blur-2xl" />

            {/* Moving Water Surface Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />

            {/* Particle Overlay (Simulated with radial gradients for performance) */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-ocean-glow rounded-full opacity-20 animate-float" style={{ animationDuration: '4s' }} />
            <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-ocean-light rounded-full opacity-30 animate-float-slow" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-ocean-DEFAULT rounded-full opacity-10 animate-float" style={{ animationDuration: '6s' }} />
        </div>
    );
};
