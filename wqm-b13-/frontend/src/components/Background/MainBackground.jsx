import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Earth3D } from '../3d/Earth3D';
import { RiverBackground } from './RiverBackground';

export const MainBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-ocean-deep">
            {/* Deep Ocean Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#061A2D] via-ocean-deep to-slate-dark opacity-95" />

            {/* 3D Earth Layer */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Canvas shadows>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
                        <Earth3D />
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* River Layer */}
            <RiverBackground />

            {/* Floating Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-ocean-light/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-ocean-glow/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

            {/* Static Grain Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
