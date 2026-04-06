import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Clock } from 'lucide-react';
import { alertService } from '../services/alertService';
import AlertTypeBadge from '../components/AlertTypeBadge';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                const data = await alertService.getAll();
                const sorted = (Array.isArray(data) ? data : []).sort(
                    (a, b) => new Date(b.issued_at || 0) - new Date(a.issued_at || 0)
                );
                setAlerts(sorted);
            } catch (err) {
                console.error('Failed to fetch alerts:', err);
                setError('Could not load alerts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const filteredAlerts = alerts.filter((alert) => {
        const q = searchQuery.toLowerCase();
        return (
            (alert.message || '').toLowerCase().includes(q) ||
            (alert.type || '').toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">
                    Water <span className="text-accent-gold">Alerts</span>
                </h1>
                <p className="text-primary-gray mt-1 text-sm font-medium tracking-wide">
                    Real-time monitoring and contamination advisories
                </p>
            </div>

            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by message or type…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 outline-none focus:border-accent-gold/50 transition-colors"
                />
            </div>

            {/* Alert Count */}
            {!loading && !error && (
                <p className="text-xs font-black uppercase tracking-widest text-accent-gold/70">
                    {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''} Found
                </p>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] text-white/20">
                    <Bell className="w-14 h-14 mb-4 opacity-30" />
                    <p className="text-base font-black uppercase tracking-widest italic">
                        {searchQuery ? 'No Matching Alerts' : 'No Alerts Issued'}
                    </p>
                </div>
            )}

            {/* Alerts List */}
            {!loading && !error && filteredAlerts.length > 0 && (
                <div className="space-y-3">
                    {filteredAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all"
                        >
                            {/* Top row: badge + date */}
                            <div className="flex items-center justify-between mb-3">
                                <AlertTypeBadge type={alert.type} />
                                <span className="flex items-center text-[11px] text-white/30 font-mono">
                                    <Clock className="w-3 h-3 mr-1.5 text-accent-gold/30" />
                                    {formatDate(alert.issued_at)}
                                </span>
                            </div>

                            {/* Message */}
                            <p className="text-sm text-white/80 leading-relaxed font-medium mb-3">
                                {alert.message || '—'}
                            </p>

                            {/* Location */}
                            <div className="flex items-center text-[11px] text-primary-gray/70">
                                <MapPin className="w-3 h-3 mr-1.5 text-accent-gold/30 flex-shrink-0" />
                                {alert.location || 'Unknown Location'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alerts;
