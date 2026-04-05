import React, { useState, useEffect, useCallback } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    MoreHorizontal, 
    FileText, 
    Calendar, 
    AtSign, 
    Building2,
    Loader2,
    AlertCircle,
    Edit2,
    Download,
    Trash2,
    X
} from 'lucide-react';
import { collaborationService } from '../../services/collaborationService';
import ReportPanel from './ReportPanel';
import SubmitCollaborationForm from './SubmitCollaborationForm';

const CollaborationsList = () => {
    const [collaborations, setCollaborations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedReports, setSelectedReports] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [currentStationName, setCurrentStationName] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingCollab, setEditingCollab] = useState(null);

    const handleEditClick = (collab) => {
        setEditingCollab(collab);
        setOpenMenuId(null);
    };

    const handleExportLog = async (collab) => {
        setOpenMenuId(null);
        try {
            const reports = collab.station_id ? await collaborationService.getReportsByStation(collab.station_id) : [];
            if (reports.length === 0) {
                alert("No reports found for this project's station to export.");
                return;
            }
            
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Report ID,Title,Description,Status,Date\n";
            
            reports.forEach(r => {
                const row = [
                    r.id,
                    `"${(r.title || '').replace(/"/g, '""')}"`,
                    `"${(r.description || '').replace(/"/g, '""')}"`,
                    r.status,
                    new Date(r.created_at).toLocaleDateString()
                ].join(',');
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${collab.project_name.replace(/\s+/g, '_')}_Log.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch(e) {
            console.error("Export failure", e);
            alert("Failed to export log data.");
        }
    };

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("CAUTION: Are you sure you want to permanently delete this mission?")) {
            try {
                await collaborationService.delete(id);
                setOpenMenuId(null);
                fetchCollaborations();
            } catch (err) {
                console.error("Failed to delete project:", err);
                alert("Failed to delete project. Make sure you have the correct permissions.");
            }
        }
    };

    const fetchCollaborations = useCallback(async () => {
        setLoading(true);
        try {
            const data = await collaborationService.getAll({ 
                page, 
                limit: 10,
                project_name: search 
            });
            setCollaborations(data);
        } catch (err) {
            setError("Failed to fetch collaboration projects.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchCollaborations();
    }, [fetchCollaborations]);

    const handleViewReports = async (stationId, stationName) => {
        setLoading(true);
        try {
            // stationId might be null if not linked
            const reports = stationId ? await collaborationService.getReportsByStation(stationId) : [];
            setSelectedReports(reports);
            setCurrentStationName(stationName);
            setIsPanelOpen(true);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-critical space-y-3">
                <AlertCircle className="w-12 h-12" />
                <p className="font-bold uppercase tracking-widest">{error}</p>
                <button 
                    onClick={fetchCollaborations}
                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all border border-white/10"
                >
                    Retry Fetching
                </button>
            </div>
        );
    }

    return (
        <div className="w-full overflow-visible pb-32">
            <div className="w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-gray">Project Details</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-gray">NGO Manager</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-gray text-center underline decoration-accent-gold/30">Reports</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-gray">Created At</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-gray text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {loading && collaborations.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <Loader2 className="w-10 h-10 text-accent-gold animate-spin mx-auto mb-4" />
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Synchronizing Records...</p>
                                </td>
                            </tr>
                        ) : collaborations.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <div className="text-white/20 mb-4 flex justify-center"><Building2 className="w-16 h-16" /></div>
                                    <p className="text-sm font-black text-white/40 uppercase tracking-widest leading-loose">No collaboration projects found.</p>
                                    <p className="text-[10px] text-white/20 uppercase tracking-tighter">Initiate a new project using the panel on the right.</p>
                                </td>
                            </tr>
                        ) : (
                            collaborations.map((collab) => (
                                <tr key={collab.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2.5 bg-accent-gold/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                <Building2 className="w-5 h-5 text-accent-gold" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-accent-gold transition-colors">{collab.project_name}</p>
                                                <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-primary-gray font-bold uppercase tracking-wider">
                                                    <AtSign className="w-3 h-3 text-accent-gold/50" />
                                                    <span>{collab.contact_email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">{collab.ngo_name}</span>
                                            <span className="text-[9px] text-primary-gray font-black uppercase tracking-widest mt-0.5 opacity-50">Authorized NGO</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <button 
                                            onClick={() => handleViewReports(collab.station_id, collab.project_name)}
                                            className="px-4 py-1.5 bg-safe/10 border border-safe/20 rounded-lg text-safe text-[10px] font-black uppercase tracking-widest hover:bg-safe/20 transition-all active:scale-95"
                                        >
                                            View Reports
                                        </button>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center space-x-2 text-primary-gray">
                                            <Calendar className="w-3.5 h-3.5 text-accent-gold/50" />
                                            <span className="text-xs font-bold">{new Date(collab.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="relative inline-block text-left">
                                            <button 
                                                onClick={() => toggleMenu(collab.id)}
                                                className={`p-2 rounded-lg transition-colors group ${openMenuId === collab.id ? 'bg-accent-gold/20' : 'hover:bg-white/5'}`}
                                            >
                                                <MoreHorizontal className={`w-5 h-5 ${openMenuId === collab.id ? 'text-accent-gold' : 'text-primary-gray group-hover:text-white'}`} />
                                            </button>
                                            
                                            {openMenuId === collab.id && (
                                                <div className="absolute right-0 mt-2 z-50 w-48 bg-ocean-deep border border-white/10 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="py-1 text-left">
                                                        <button 
                                                            className="w-full flex items-center px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors group/item"
                                                            onClick={() => handleEditClick(collab)}
                                                        >
                                                            <Edit2 className="w-4 h-4 mr-3 text-accent-gold group-hover/item:scale-110 transition-transform" />
                                                            Edit Details
                                                        </button>
                                                        <button 
                                                            className="w-full flex items-center px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors group/item"
                                                            onClick={() => handleExportLog(collab)}
                                                        >
                                                            <Download className="w-4 h-4 mr-3 text-safe group-hover/item:scale-110 transition-transform" />
                                                            Export Log
                                                        </button>
                                                        <div className="h-px w-full bg-white/5 my-1"></div>
                                                        <button 
                                                            className="w-full flex items-center px-4 py-3 text-xs font-bold text-critical hover:bg-critical/10 transition-colors group/item"
                                                            onClick={() => handleDelete(collab.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-3 text-critical group-hover/item:scale-110 transition-transform" />
                                                            Delete Project
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {collaborations.length > 0 && (
                <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <p className="text-[10px] font-bold text-primary-gray uppercase tracking-widest">
                        Showing <span className="text-white">{collaborations.length}</span> results
                    </p>
                    <div className="flex items-center space-x-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-lg border border-white/5 text-primary-gray hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="px-4 py-2 rounded-lg bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-[10px] font-black">
                            {page}
                        </div>
                        <button 
                            disabled={collaborations.length < 10}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg border border-white/5 text-primary-gray hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <ReportPanel 
                reports={selectedReports}
                stationName={currentStationName}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
            />

            {/* Edit Modal */}
            {editingCollab && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-md overflow-hidden">
                    <div className="w-full max-w-xl p-6 md:p-10 bg-[#0a0e1a] border border-accent-gold/30 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-start mb-8 md:mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Edit <span className="text-accent-gold">Mission</span></h3>
                                <p className="text-primary-gray text-xs mt-2 uppercase tracking-widest font-black">Update collaboration project parameters.</p>
                            </div>
                            <button 
                                onClick={() => setEditingCollab(null)}
                                className="text-primary-gray hover:text-white transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                        <SubmitCollaborationForm 
                            initialData={editingCollab} 
                            isEdit={true} 
                            onSuccess={() => { setEditingCollab(null); fetchCollaborations(); }}
                            onCancel={() => setEditingCollab(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollaborationsList;
