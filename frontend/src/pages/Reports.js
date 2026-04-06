import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Trash2
} from 'lucide-react';

import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import FloatingActionButton from '../components/FloatingActionButton';
import ReportForm from '../components/ReportForm';
import ReportDetailModal from '../components/ReportDetailModal';

import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
<<<<<<< HEAD
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29

    // Function to load reports
    const loadReports = async () => {
        try {
            const data = await reportService.getAll();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await reportService.updateStatus(id, status);
            await loadReports();
            setMenuOpenId(null);
        } catch (error) {
            console.error(`Error updating report ${id} status:`, error);
            alert("Failed to update report status. Please try again.");
        }
    };

    const handleDeleteReport = async (id) => {
        if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
            try {
                await reportService.delete(id);
                await loadReports();
                setMenuOpenId(null);
            } catch (error) {
                console.error(`Error deleting report ${id}:`, error);
                alert("Failed to delete report. Only admins can perform this action.");
            }
        }
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setMenuOpenId(null);
    };

<<<<<<< HEAD
    const filteredReports = reports.filter((r) => {
        const matchesSearch = (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (r.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (r.location || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
    useEffect(() => {
        loadReports();
    }, []);

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                        Report Registry
                    </h2>
                    <p className="text-primary-gray text-xs mt-1">
                        Citizen monitoring and community reporting database.
                    </p>
                </div>

                <div className="flex items-center space-x-3">

                    <button
                        onClick={() => setShowForm(true)}
                        className="hidden md:flex items-center space-x-2 py-2.5 px-6 rounded-xl bg-accent-gold text-background font-black text-xs uppercase tracking-widest shadow-lg shadow-accent-gold/20 hover:opacity-90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Report</span>
                    </button>

                    <div className="relative group">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray group-focus-within:text-accent-gold transition-colors" />

                        <input
                            type="text"
                            placeholder="Filter registry..."
<<<<<<< HEAD
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-all w-48 md:w-64"
                        />

                    </div>

<<<<<<< HEAD
                    <div className="relative">
                        <button 
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className={`p-2.5 border rounded-xl transition-all ${
                                statusFilter !== 'ALL' 
                                    ? 'bg-accent-gold/10 border-accent-gold/50 text-accent-gold shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                    : 'bg-white/5 border-white/10 text-primary-gray hover:text-white hover:border-white/30'
                            }`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>

                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-ocean-deep border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-2 border-b border-white/5 bg-white/5">
                                    <p className="text-[10px] font-black uppercase text-primary-gray tracking-widest px-2">Moderation Status</p>
                                </div>
                                <div className="p-2 flex flex-col space-y-1">
                                    {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => { setStatusFilter(status); setShowFilterDropdown(false); }}
                                            className={`text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                                                statusFilter === status 
                                                    ? 'bg-accent-gold/20 text-accent-gold' 
                                                    : 'text-primary-gray hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
=======
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-primary-gray hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29

                </div>

            </div>

            <GlassCard className="overflow-hidden border-white/5">

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">

                                <th className="px-6 py-4 text-[10px] uppercase font-black text-primary-gray tracking-[0.2em]">
                                    Report ID
                                </th>

                                <th className="px-6 py-4 text-[10px] uppercase font-black text-primary-gray tracking-[0.2em]">
                                    Subject
                                </th>
<<<<<<< HEAD
=======
{/* 
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-primary-gray tracking-[0.2em]">
                                    Station Context
                                </th> */}
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29

                                <th className="px-6 py-4 text-[10px] uppercase font-black text-primary-gray tracking-[0.2em]">
                                    Timestamp
                                </th>

                                <th className="px-6 py-4 text-[10px] uppercase font-black text-primary-gray tracking-[0.2em]">
                                    Moderation
                                </th>

                                <th className="px-6 py-4 text-[10px] uppercase font-black text-primary-gray tracking-[0.2em]">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">

                            {loading ? (

                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-primary-gray text-sm">
                                        Loading reports...
                                    </td>
                                </tr>

<<<<<<< HEAD
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-primary-gray text-xs font-bold uppercase tracking-widest italic opacity-50">
                                        No reports integrated in database yet.
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-primary-gray text-xs font-bold uppercase tracking-widest italic opacity-50">
                                        No reports match your current filter criteria.
                                    </td>
                                </tr>
                            ) : (

                                filteredReports.map((report) => (
=======
                            ) : (

                                reports.map((report) => (
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29

                                    <tr key={report.id} className="hover:bg-white/5 transition-colors group">

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-mono text-accent-gold/80">
                                                {report.id}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-white group-hover:text-accent-gold transition-all">
                                                {report.title || report.location || "Water Report #" + report.id}
                                            </p>
                                        </td>

                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* <div className="w-2 h-2 rounded-full bg-accent-gold/40 mr-2"></div> */}
                                                {/* <span className="text-xs text-white uppercase font-bold opacity-80">
                                                    {report.location || report.water_source || "N/A"}
                                                </span>
                                            </div> */}
                                        {/* </td> */}

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs text-primary-gray">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={report.status} />
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right">

                                            {/* Authority/NGO/Admin verification actions */}
                                            {(user?.role === 'ngo' || user?.role === 'admin' || user?.role === 'authority') && report.status === 'PENDING' && (
                                                <div className="inline-flex items-center space-x-2 mr-4">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(report.id, 'VERIFIED')}
                                                        className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-[10px] font-black uppercase hover:bg-green-500/20 transition-all"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                                                        className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-black uppercase hover:bg-red-500/20 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {/* <button className="p-2 text-primary-gray hover:text-white transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button> */}

                                            <div className="relative inline-block text-left">
                                                <button 
                                                    onClick={() => setMenuOpenId(menuOpenId === report.id ? null : report.id)}
                                                    className={`p-2 rounded-xl transition-all ${menuOpenId === report.id ? 'bg-accent-gold text-background' : 'text-primary-gray hover:text-white hover:bg-white/5'}`}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {menuOpenId === report.id && (
                                                    <div className="absolute right-0 mt-2 w-48 origin-top-right z-50">
                                                        <GlassCard className="border-white/10 p-1 shadow-2xl backdrop-blur-xl">
                                                            <div className="space-y-1">
                                                                <button
                                                                    onClick={() => handleViewReport(report)}
                                                                    className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-white/10 rounded-lg transition-all group"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-3 text-accent-gold group-hover:scale-110 transition-transform" />
                                                                    View Details
                                                                </button>
                                                                
                                                                {user?.role === 'admin' && (
                                                                    <button
                                                                        onClick={() => handleDeleteReport(report.id)}
                                                                        className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-400 uppercase tracking-wider hover:bg-red-500/10 rounded-lg transition-all group"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                                                                        Delete Report
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </GlassCard>
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

            </GlassCard>

            {/* Report Form Modal */}

            {showForm && (
                <ReportForm
                    onClose={() => {
                        setShowForm(false);
                        loadReports(); // refresh reports automatically
                    }}
                />
            )}

            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}

            {/* Floating Action Button */}

            <FloatingActionButton onClick={() => setShowForm(true)}>
                <Plus className="w-5 h-5" />
                <span>Submit Quick Report</span>
            </FloatingActionButton>

        </div>
    );
};

export default Reports;