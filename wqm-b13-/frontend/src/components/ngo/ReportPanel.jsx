import React from 'react';
import { X, AlertCircle, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react';
import ReportForm from '../ReportForm';
import { collaborationService } from '../../services/collaborationService';

const ReportPanel = ({ reports: initialReports, isOpen, onClose, stationName, stationId, initialCoords }) => {
    const [showForm, setShowForm] = React.useState(false);
    const [reports, setReports] = React.useState(initialReports);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setReports(initialReports);
    }, [initialReports]);

    const refreshReports = async () => {
        if (!stationId) return;
        setLoading(true);
        try {
            const updated = await collaborationService.getReportsByStation(stationId);
            setReports(updated);
        } catch (err) {
            console.error("Failed to refresh reports:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'verified': return 'text-safe bg-safe/10 border-safe/20';
            case 'rejected': return 'text-critical bg-critical/10 border-critical/20';
            default: return 'text-warning bg-warning/10 border-warning/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'verified': return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[1001] transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-ocean-deep border-l border-white/10 z-[1002] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Station Reports</h2>
                        <p className="text-[10px] font-bold text-accent-gold uppercase tracking-widest">{stationName || 'Linked monitoring station'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setShowForm(true)}
                            className="p-2 bg-accent-gold/10 hover:bg-accent-gold/20 border border-accent-gold/30 rounded-lg transition-all group/add flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4 text-accent-gold group-hover/add:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-accent-gold uppercase tracking-tighter">Add Report</span>
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                        >
                            <X className="w-6 h-6 text-primary-gray group-hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-custom">
                    {reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-50">
                            <AlertCircle className="w-10 h-10 text-primary-gray" />
                            <p className="text-sm font-medium">No reports found for this station.</p>
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tighter flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                                        {getStatusIcon(report.status)}
                                        <span>{report.status || 'Pending'}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-primary-gray uppercase tracking-widest">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Description</p>
                                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                                        {report.description}
                                    </p>
                                </div>

                                {report.photo_url && (
                                    <div className="rounded-xl overflow-hidden border border-white/10 h-32 w-full">
                                        <img src={report.photo_url} alt="Report attachment" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {showForm && (
                    <ReportForm 
                        onClose={() => setShowForm(false)} 
                        stationId={stationId}
                        initialCoords={initialCoords}
                        onSuccess={refreshReports}
                    />
                )}

                <div className="p-6 border-t border-white/10 bg-white/[0.01]">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg"
                    >
                        Close Panel
                    </button>
                </div>
            </div>
        </>
    );
};

export default ReportPanel;
