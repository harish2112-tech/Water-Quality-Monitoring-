import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    Shield,
    Trash2,
    UserCheck,
    Mail,
    MapPin,
    Calendar,
    ChevronRight,
    Edit3,
    Check
} from 'lucide-react';

import GlassCard from '../../components/GlassCard';
import StatusBadge from '../../components/StatusBadge';
import { userService } from '../../services/userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ role: '' });

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleUpdateRole = async (userId) => {
        try {
            await userService.update(userId, { role: editForm.role });
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user role.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("CAUTION: Are you sure you want to permanently revoke access for this operative?")) {
            try {
                await userService.delete(id);
                loadUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-white">
            <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin mb-4"></div>
            <p className="text-primary-gray font-bold uppercase tracking-widest animate-pulse">Scanning Personnel Database...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">
                    Personnel <span className="text-accent-gold">Registry</span>
                </h2>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <p className="text-primary-gray text-xs font-medium tracking-wide uppercase">
                        Administrative control of monitoring fleet operatives and authority access.
                    </p>
                    
                    <div className="flex items-center space-x-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray group-focus-within:text-accent-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Locate operative..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-accent-gold/50 transition-all w-full md:w-64"
                            />
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2.5 border rounded-xl transition-all ${
                                    showFilters || roleFilter !== 'all' 
                                        ? 'bg-accent-gold/10 border-accent-gold/50 text-accent-gold shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                        : 'bg-white/5 border-white/10 text-primary-gray hover:text-white hover:border-white/30'
                                }`}
                            >
                                <Filter className="w-4 h-4" />
                            </button>

                            {showFilters && (
                                <div className="absolute right-0 mt-2 w-48 bg-background border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-2 border-b border-white/5 bg-white/5">
                                        <p className="text-[10px] font-black uppercase text-primary-gray tracking-widest px-2">Filter Access</p>
                                    </div>
                                    <div className="p-2 flex flex-col space-y-1">
                                        {['all', 'admin', 'authority', 'ngo', 'citizen'].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => { setRoleFilter(role); setShowFilters(false); }}
                                                className={`text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                                                    roleFilter === role 
                                                        ? 'bg-accent-gold/20 text-accent-gold' 
                                                        : 'text-primary-gray hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                {role === 'all' ? 'All Accs Levels' : role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Operatives', val: users.length, icon: Users, color: 'accent-gold' },
                    { label: 'Administrators', val: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'critical' },
                    { label: 'Authorities', val: users.filter(u => u.role === 'authority').length, icon: UserCheck, color: 'safe' },
                    { label: 'NGO Synergy', val: users.filter(u => u.role === 'ngo').length, icon: Users, color: 'blue-400' },
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-4 border-white/5">
                        <p className="text-[9px] text-primary-gray uppercase font-black tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-2xl font-black text-white">{stat.val}</h4>
                            <stat.icon className={`w-5 h-5 text-${stat.color} opacity-40`} />
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* User Table */}
            <GlassCard className="overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-5 text-[10px] uppercase font-black text-primary-gray tracking-widest">Operative</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-black text-primary-gray tracking-widest">Access Protocol</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-black text-primary-gray tracking-widest">Assignment</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-black text-primary-gray tracking-widest">Entry Date</th>
                                <th className="px-6 py-5 text-right text-[10px] uppercase font-black text-primary-gray tracking-widest">Command</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-black text-white border border-white/10 shadow-lg group-hover:border-accent-gold/20 transition-all">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white tracking-tight">{u.name}</p>
                                                <p className="text-[10px] text-primary-gray flex items-center mt-0.5">
                                                    <Mail className="w-3 h-3 mr-1 opacity-40" /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {editingUser === u.id ? (
                                            <div className="flex items-center space-x-2">
                                                <select 
                                                    className="bg-background border border-accent-gold/30 text-[10px] font-black text-white rounded-lg px-2 py-1 uppercase"
                                                    value={editForm.role}
                                                    onChange={(e) => setEditForm({role: e.target.value})}
                                                >
                                                    <option value="citizen">CITIZEN</option>
                                                    <option value="ngo">NGO</option>
                                                    <option value="authority">AUTHORITY</option>
                                                    <option value="admin">ADMIN</option>
                                                </select>
                                                <button 
                                                    onClick={() => handleUpdateRole(u.id)}
                                                    className="p-1 px-2 bg-accent-gold text-background rounded-md text-[10px] font-black"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div 
                                                className="cursor-pointer flex items-center group/role"
                                                onClick={() => { setEditingUser(u.id); setEditForm({role: u.role}); }}
                                            >
                                                <StatusBadge status={u.role} className="uppercase tracking-widest text-[9px]" />
                                                <Edit3 className="w-3 h-3 ml-2 opacity-0 group-hover/role:opacity-40 text-primary-gray transition-all" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center text-[11px] text-white/70">
                                            <MapPin className="w-3 h-3 mr-1.5 text-accent-gold opacity-50" />
                                            {u.location || "Sector Unassigned"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center text-[10px] text-primary-gray font-mono">
                                            <Calendar className="w-3 h-3 mr-1.5 opacity-30" />
                                            {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button 
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="p-2 text-primary-gray hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Revoke Access"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-primary-gray hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default UserManagement;
