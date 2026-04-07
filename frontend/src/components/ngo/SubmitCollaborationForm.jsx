import React, { useState, useEffect } from 'react';
import { 
    Send, 
    CheckCircle, 
    AlertCircle, 
    Building2, 
    AtSign, 
    Tag,
    Loader2,
    MapPin
} from 'lucide-react';
import api from '../../services/api';
import { collaborationService } from '../../services/collaborationService';
import { useAuth } from '../../context/AuthContext';

const SubmitCollaborationForm = ({ onSuccess, initialData = null, isEdit = false, onCancel = null }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        project_name: initialData?.project_name || '',
        ngo_name: initialData?.ngo_name || user?.name || '',
        contact_email: initialData?.contact_email || user?.email || '',
        station_id: initialData?.station_id || ''
    });
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await api.get('/stations');
                setStations(response.data || []);
            } catch (err) {
                console.error("Failed to fetch stations for dropdown:", err);
            }
        };
        fetchStations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (status.type === 'error') setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const payload = {
                ...formData,
                station_id: formData.station_id ? parseInt(formData.station_id) : null
            };
            if (isEdit) {
                await collaborationService.update(initialData.id, payload);
                setStatus({ type: 'success', message: 'Collaboration project updated successfully!' });
            } else {
                await collaborationService.create(payload);
                setStatus({ type: 'success', message: 'Collaboration project submitted successfully!' });
                setFormData({
                    project_name: '',
                    ngo_name: user?.name || '',
                    contact_email: user?.email || '',
                    station_id: ''
                });
            }
            if (onSuccess) onSuccess();
            // Refresh page or list (handled by parent usually, but we'll use a timeout to clear success)
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || "Failed to submit project. Please verify fields.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Project Identifier</label>
                <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-gold/50 group-focus-within:text-accent-gold transition-colors" />
                    <input 
                        type="text"
                        name="project_name"
                        value={formData.project_name}
                        onChange={handleChange}
                        placeholder="e.g. Nile Basin Preservation V2"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/20 transition-all text-white font-medium"
                        required
                        maxLength={120}
                    />
                </div>
            </div>

            {/* NGO Name */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Organization</label>
                <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-gold/50 group-focus-within:text-accent-gold transition-colors" />
                    <input 
                        type="text"
                        name="ngo_name"
                        value={formData.ngo_name}
                        onChange={handleChange}
                        placeholder="NGO Legal Name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/20 transition-all text-white font-medium"
                        required
                    />
                </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Coordination Email</label>
                <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-gold/50 group-focus-within:text-accent-gold transition-colors" />
                    <input 
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        placeholder="contact@organization.org"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/20 transition-all text-white font-medium"
                        required
                    />
                </div>
            </div>

            {/* Linked Station (Optional) */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Target Monitoring Site (Optional)</label>
                <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-gold/50 group-focus-within:text-accent-gold transition-colors" />
                    <select 
                        name="station_id"
                        value={formData.station_id}
                        onChange={handleChange}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-[#0a0e1a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/20 transition-all text-white font-medium appearance-none"
                    >
                        <option value="" className="bg-background hover:bg-white/10 dark:text-white">Unlinked / New Area</option>
                        {stations.map(s => (
                            <option key={s.id} value={s.id} className="bg-background hover:bg-white/10 dark:text-white">{s.name} ({s.city})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Feedback Messages */}
            {status.message && (
                <div className={`p-4 rounded-xl border flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                    status.type === 'success' ? 'bg-safe/10 border-safe/20 text-safe' : 'bg-critical/10 border-critical/20 text-critical'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <p className="text-xs font-bold uppercase tracking-tight leading-tight">{status.message}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className={`flex ${isEdit ? 'space-x-4' : ''}`}>
                {isEdit && onCancel && (
                    <button 
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="w-1/3 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit"
                    disabled={loading}
                    className={`${isEdit ? 'w-2/3' : 'w-full'} py-4 bg-accent-gold hover:bg-yellow-500 text-background font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-accent-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{isEdit ? 'Saving...' : 'Deploying...'}</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>{isEdit ? 'Save Changes' : 'Deploy Project'}</span>
                        </>
                    )}
                </button>
            </div>
            <div className="h-4"></div> {/* Spacer to prevent bottom cutoff in flex-overflow containers */}
        </form>
    );
};

export default SubmitCollaborationForm;
