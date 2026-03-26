import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import { UserPlus, ShieldCheck, Mail, Lock, User, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'authority',
        location: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/api/auth/admin/create-user', formData);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'authority',
                location: '',
                phone: ''
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create user account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                    Admin <span className="text-accent-gold">Control Panel</span>
                </h1>
                <p className="text-primary-gray mt-1 text-sm font-medium tracking-wide font-mono uppercase">
                    System Administration & User Management
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Creation Form */}
                <GlassCard className="lg:col-span-2 p-8 border-white/5 bg-white/5">
                    <div className="flex items-center space-x-3 text-accent-gold mb-8">
                        <UserPlus className="w-6 h-6" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Create Restricted Account</h2>
                    </div>

                    {success && (
                        <div className="mb-6 p-4 bg-safe/10 border border-safe/20 rounded-xl flex items-center space-x-3 text-safe text-sm animate-in slide-in-from-top-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-bold">Account created successfully! The credentials are now active.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    placeholder="Enter full name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent-gold/50 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    placeholder="authority@waterwatch.gov"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent-gold/50 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray tracking-widest pl-1">Temporary Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    placeholder="Min. 6 characters"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent-gold/50 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray tracking-widest pl-1">Account Role</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <select
                                    value={formData.role}
                                    onChange={handleChange('role')}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm appearance-none focus:border-accent-gold/50 transition-all outline-none"
                                >
                                    <option value="authority" className="bg-ocean-deep">Authority Agent</option>
                                    <option value="ngo" className="bg-ocean-deep">NGO Coordinator</option>
                                    <option value="admin" className="bg-ocean-deep">System Administrator</option>
                                    <option value="citizen" className="bg-ocean-deep">Citizen User</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-accent-gold text-background font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-accent-gold/20 hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Provision Account</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </GlassCard>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <GlassCard className="p-6 border-white/5 bg-accent-gold/5 border-accent-gold/20">
                        <h3 className="text-accent-gold font-black uppercase text-xs tracking-widest mb-4">Security Protocol</h3>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Authorities and Official accounts cannot self-register. 
                            Admins must provision these accounts to ensure verified oversight.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
