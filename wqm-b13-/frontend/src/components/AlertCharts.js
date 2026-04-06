import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import GlassCard from './GlassCard';

const AlertCharts = ({ data }) => {
    // Process data for Line Chart (Alerts over time)
    const processTimeData = () => {
        const grouped = data.reduce((acc, alert) => {
            const date = new Date(alert.issued_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Process data for Bar Chart (Alerts by type)
    const processTypeData = () => {
        const types = {
            chemical_imbalance: 0,
            aquatic_risk: 0,
            clarity_warning: 0,
            ph_variance: 0,
            wqi_breach: 0
        };

        data.forEach(alert => {
            if (types.hasOwnProperty(alert.type)) {
                types[alert.type]++;
            }
        });

        return Object.entries(types).map(([name, count]) => ({
            name: name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            count,
            type: name
        }));
    };

    const timeData = processTimeData();
    const typeData = processTypeData();

    const COLORS = {
        chemical_imbalance: '#f59e0b',
        aquatic_risk: '#ef4444',
        clarity_warning: '#94a3b8',
        ph_variance: '#10b981',
        wqi_breach: '#ef4444'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-8 border-white/5 h-[450px] flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                        Alert <span className="text-accent-gold">Trends</span>
                    </h3>
                    <p className="text-primary-gray text-xs font-medium uppercase tracking-widest mt-1">
                        Timeline of issued safety advisories
                    </p>
                </div>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#0a192f', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#f59e0b' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4, stroke: '#0a192f' }}
                                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: '#0a192f' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard className="p-8 border-white/5 h-[450px] flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                        Distribution <span className="text-accent-gold">by Type</span>
                    </h3>
                    <p className="text-primary-gray text-xs font-medium uppercase tracking-widest mt-1">
                        Categorical breakdown of alerts
                    </p>
                </div>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis 
                                type="number"
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                dataKey="name" 
                                type="category"
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ 
                                    backgroundColor: '#0a192f', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
};

export default AlertCharts;
