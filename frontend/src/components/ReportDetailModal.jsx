import React from 'react';
import { X, MapPin, Droplets, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import GlassCard from './GlassCard';

const ReportDetailModal = ({ report, onClose }) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 relative p-0">

                {/* Header */}
                <div className="sticky top-0 z-10 bg-ocean-deep/90 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest">Report Detail</span>
                            <span className="text-[10px] font-mono text-white/20">|</span>
                            <span className="text-[10px] font-mono text-white/60">ID: {report.id}</span>
                        </div>
                        <h3 className="text-xl font-black text-white mt-1 uppercase italic tracking-tight">
                            {report.title || "Untitled Report"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-primary-gray hover:text-white hover:border-white/20 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Status Section */}
                    <div className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className={`p-3 rounded-xl mr-4 ${report.status === 'VERIFIED' ? 'bg-green-500/10 text-green-400' :
                            report.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                                'bg-accent-gold/10 text-accent-gold'
                            }`}>
                            {report.status === 'VERIFIED' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest">Status</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">{report.status}</p>
                            
                            {report.status !== 'PENDING' && report.verified_at && (
                                <p className="text-[9px] text-white/40 mt-1 uppercase font-bold tracking-tighter">
                                    {report.status === 'VERIFIED' ? 'Verified' : 'Rejected'} on {new Date(report.verified_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest flex items-center">
                                    <MapPin className="w-3 h-3 mr-1.5 text-accent-gold" />
                                    Location
                                </p>
                                <p className="text-sm text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                                    {report.location || "Not specified"}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest flex items-center">
                                    <Droplets className="w-3 h-3 mr-1.5 text-accent-gold" />
                                    Water Source
                                </p>
                                <p className="text-sm text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                                    {report.water_source || "Not specified"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest">Latitude</p>
                                    <p className="text-xs font-mono text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">{report.latitude}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest">Longitude</p>
                                    <p className="text-xs font-mono text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">{report.longitude}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest flex items-center">
                                    <Clock className="w-3 h-3 mr-1.5 text-accent-gold" />
                                    Timestamp
                                </p>
                                <p className="text-sm text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                                    {new Date(report.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest flex items-center">
                                    <User className="w-3 h-3 mr-1.5 text-accent-gold" />
                                    Reporter ID
                                </p>
                                <p className="text-sm text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                                    USER-{report.user_id}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest">Detailed Description</p>
                        <div className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 min-h-[100px]">
                            {report.description}
                        </div>
                    </div>

                    {/* Evidence Photo */}
                    {report.photo_url && (
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase font-black text-primary-gray tracking-widest">Evidence Photo</p>
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                                <img
                                    src={report.photo_url}
                                    alt="Report Evidence"
                                    className="w-full h-auto object-cover max-h-[300px]"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        </div>
                    )}

                    {/* Moderation Section */}
                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <p className="text-[10px] uppercase font-black text-accent-gold tracking-[0.2em]">Official Verification Details</p>
                        <div className="p-4 rounded-xl bg-accent-gold/5 border border-accent-gold/10">
                            {report.status === 'PENDING' ? (
                                <p className="text-xs text-primary-gray italic">
                                    Your report is currently being reviewed by our team of specialists. We will notify you once a determination has been made.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-primary-gray">Reviewer ID</span>
                                        <span className="text-white">AUTH-{report.verified_by || "OFFICIAL"}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-primary-gray">Resolution Date</span>
                                        <span className="text-white">{new Date(report.verified_at).toLocaleString()}</span>
                                    </div>
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg text-xs text-white/80 border border-white/5 italic">
                                        "The data provided has been cross-referenced with regional monitoring stations and system-wide baseline parameters."
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="py-2 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/10 transition-all"
                    >
                        Close
                    </button>
                </div>

            </GlassCard>
        </div>
    );
};

export default ReportDetailModal;
