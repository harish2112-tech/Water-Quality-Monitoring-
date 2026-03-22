import React, { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const TrendChart = ({ data = [], dataKey, color = "#e6d28c", title, externalTimeRange }) => {
    const [localTimeRange, setLocalTimeRange] = useState('D');
    const timeRange = externalTimeRange || localTimeRange;

    // Filter data locally based on timeRange
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        switch (timeRange) {
            case 'H': return data.slice(-2);
            case 'D': return data.slice(-24);
            case 'W': return data.slice(-7);
            case 'M': return data.slice(-30);
            case 'Y': return data.slice(-365);
            default: return data;
        }
    }, [data, timeRange]);

    return (
        <div className="w-full h-72 mt-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h5 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h5>
                    <p className="text-[10px] text-primary-gray mt-0.5">Statistical variance over selected period</p>
                </div>
                {!externalTimeRange && (
                    <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        {['H', 'D', 'W', 'M', 'Y'].map(t => (
                            <button
                                key={t}
                                onClick={() => setLocalTimeRange(t)}
                                className={`text-[9px] font-black px-2.5 py-1 rounded-md transition-all ${timeRange === t
                                    ? 'bg-accent-gold text-background shadow-lg shadow-accent-gold/20'
                                    : 'text-primary-gray hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height="70%">
                {filteredData.length > 0 ? (
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id={`gradient-${dataKey}-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            domain={['auto', 'auto']}
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#9ca3af' }}
                            tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1f2b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: '#fff',
                                backdropFilter: 'blur(8px)'
                            }}
                            itemStyle={{ color: color, fontWeight: 'bold' }}
                            labelFormatter={(unix) => new Date(unix).toLocaleString()}
                            cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#gradient-${dataKey}-${title})`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl bg-white/2">
                        <p className="text-[10px] text-primary-gray uppercase tracking-widest font-bold">No historical data available</p>
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
