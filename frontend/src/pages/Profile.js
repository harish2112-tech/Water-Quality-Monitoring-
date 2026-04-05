import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
    Mail,
    Phone,
    MapPin,
    LogOut,
    ChevronRight,
    Eye,
    EyeOff,
    User,
    Shield,
    Camera
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || "Operative",
        email: user?.email || "",
        phone: user?.phone || "+1 (555) 000-0000",
        location: user?.location || "Sector Unassigned"
    });

    React.useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || "Operative",
                email: user.email,
                phone: user.phone || "+1 (555) 000-0000",
                location: user.location || "Sector Unassigned"
            });
        }
    }, [user]);

    const [passwordData, setPasswordData] = useState({
        current: "",
        newPass: "",
        confirm: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        newPass: false,
        confirm: false
    });

    const togglePassword = (field) => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSave = async () => {
        try {
            await authService.updateProfile(profile);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to update profile");
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
            alert("All fields are required");
            return;
        }

        if (passwordData.newPass !== passwordData.confirm) {
            alert("New password and confirm password must match");
            return;
        }

        try {
            await authService.updatePassword({
                current: passwordData.current,
                newPass: passwordData.newPass
            });
            alert("Password updated successfully!");
            setPasswordData({ current: "", newPass: "", confirm: "" });
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to update password");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">

            {/* Profile Overview Header */}
            <GlassCard className="p-8 border-accent-gold/20 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-gold via-yellow-400 to-transparent"></div>
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-colors duration-700 ease-in-out"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent-gold to-yellow-600 flex items-center justify-center text-4xl font-black text-background shadow-[0_0_40px_rgba(234,179,8,0.15)] ring-4 ring-white/5 group-hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all duration-500">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-safe rounded-full border-4 border-background shadow-lg"></div>
                        <button className="absolute bottom-0 left-0 bg-background border border-white/10 p-2 rounded-full text-primary-gray hover:text-accent-gold hover:border-accent-gold/50 transition-colors shadow-lg">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                {isEditing ? (
                                    <input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="bg-black/20 border border-accent-gold/50 text-white text-3xl font-black uppercase tracking-tighter p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all w-full md:w-auto text-center md:text-left"
                                        autoFocus
                                    />
                                ) : (
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                        {profile.name}
                                    </h2>
                                )}
                                <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
                                    <Shield className="w-4 h-4 text-accent-gold" />
                                    <span className="text-xs font-bold text-accent-gold tracking-widest uppercase py-1 px-3 bg-accent-gold/10 rounded-full border border-accent-gold/20">
                                        {user?.role || 'Citizen'} Account
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`py-3 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                    isEditing 
                                    ? "bg-safe text-background shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-transparent" 
                                    : "bg-accent-gold text-background shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] border border-transparent"
                                }`}
                            >
                                {isEditing ? "Save & Apply" : "Edit Profile"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 relative z-10 pt-8 border-t border-white/5">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-primary-gray/70">Email Access</label>
                        <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-black/20 border-accent-gold/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            <Mail className={`w-4 h-4 ${isEditing ? 'text-accent-gold' : 'text-primary-gray'}`} />
                            {isEditing ? (
                                <input
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="bg-transparent flex-1 text-white focus:outline-none text-sm w-full"
                                />
                            ) : (
                                <span className="text-sm font-medium text-white truncate">{profile.email}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-primary-gray/70">Comm Link</label>
                        <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-black/20 border-accent-gold/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            <Phone className={`w-4 h-4 ${isEditing ? 'text-accent-gold' : 'text-primary-gray'}`} />
                            {isEditing ? (
                                <input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="bg-transparent flex-1 text-white focus:outline-none text-sm w-full"
                                />
                            ) : (
                                <span className="text-sm font-medium text-white truncate">{profile.phone}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-primary-gray/70">Assigned Sector</label>
                        <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-black/20 border-accent-gold/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            <MapPin className={`w-4 h-4 ${isEditing ? 'text-accent-gold' : 'text-primary-gray'}`} />
                            {isEditing ? (
                                <input
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    className="bg-transparent flex-1 text-white focus:outline-none text-sm w-full"
                                />
                            ) : (
                                <span className="text-sm font-medium text-white truncate">{profile.location}</span>
                            )}
                        </div>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Change Password Section */}
                <GlassCard className="p-8 border-white/5 md:col-span-2 space-y-6">
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-widest">Security Credentials</h4>
                        <p className="text-xs text-primary-gray mt-1">Update your access key to maintain system security.</p>
                    </div>

                    <div className="space-y-4 max-w-lg">
                        {/* Dummy fields to absorb aggressive browser autofill */}
                        <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
                            <input type="text" autoComplete="username" defaultValue="dummy@email.com" />
                            <input type="password" autoComplete="current-password" defaultValue="dummy-password" />
                        </div>

                        <div className="relative group">
                            <input
                                autoComplete="new-password"
                                type={showPasswords.current ? "text" : "password"}
                                placeholder="Current Access Key"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                className="w-full p-4 pl-5 pr-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('current')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-gray hover:text-accent-gold transition-colors focus:outline-none"
                            >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    autoComplete="new-password"
                                    type={showPasswords.newPass ? "text" : "password"}
                                    placeholder="New Access Key"
                                    value={passwordData.newPass}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                                    className="w-full p-4 pl-5 pr-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('newPass')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-gray hover:text-accent-gold transition-colors focus:outline-none"
                                >
                                    {showPasswords.newPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    autoComplete="new-password"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    placeholder="Confirm Key"
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    className="w-full p-4 pl-5 pr-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('confirm')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-gray hover:text-accent-gold transition-colors focus:outline-none"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handlePasswordUpdate}
                            className="w-full sm:w-auto mt-2 py-3 px-8 rounded-xl bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-accent-gold hover:text-background border border-white/10 hover:border-transparent transition-all duration-300 shadow-md hover:shadow-accent-gold/20"
                        >
                            Update Credentials
                        </button>
                    </div>
                </GlassCard>

                {/* System Settings & Logout */}
                <div className="space-y-6">
                    <GlassCard className="p-6 border-white/5 space-y-4">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">System Prefs</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-sm text-primary-gray">Notifications</span>
                                <div className="w-10 h-5 bg-accent-gold/30 rounded-full relative cursor-pointer pt-[2px]">
                                    <div className="w-4 h-4 bg-accent-gold rounded-full absolute right-1 shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-sm text-primary-gray">Data Sync</span>
                                <div className="w-10 h-5 bg-accent-gold/30 rounded-full relative cursor-pointer pt-[2px]">
                                    <div className="w-4 h-4 bg-accent-gold rounded-full absolute right-1 shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-2 border-critical/20 bg-critical/5 hover:bg-critical/10 transition-colors group">
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="w-full p-4 rounded-xl flex items-center justify-between group-hover:scale-[0.98] transition-transform"
                        >
                            <span className="flex items-center text-sm font-bold text-critical">
                                <LogOut className="w-5 h-5 mr-3" />
                                Terminate Session
                            </span>
                            <ChevronRight className="w-4 h-4 text-critical opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </button>
                    </GlassCard>
                </div>
            </div>

        </div>
    );
};

export default Profile;