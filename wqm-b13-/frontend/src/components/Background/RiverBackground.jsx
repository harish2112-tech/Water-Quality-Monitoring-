import React from 'react';

export const RiverBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                {/* River 1 */}
                <path
                    d="M-50,800 C200,700 300,900 600,800 C900,700 1050,900 1050,900"
                    fill="none"
                    stroke="url(#riverGradient)"
                    strokeWidth="40"
                    strokeLinecap="round"
                    className="animate-river-flow"
                    style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}
                />

                {/* River 2 */}
                <path
                    d="M-50,600 C150,500 400,700 600,600 C800,500 1050,700 1050,700"
                    fill="none"
                    stroke="url(#riverGradient)"
                    strokeWidth="30"
                    strokeLinecap="round"
                    className="animate-river-flow"
                    style={{ strokeDasharray: '1000', strokeDashoffset: '1000', animationDelay: '2s' }}
                />

                <defs>
                    <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#90E0EF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.2" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-transparent to-transparent opacity-60" />
        </div>
    );
};
