import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
    Mail,
    Phone,
    MapPin,
    LogOut,
    ChevronRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || "User",
        email: user?.email || "",
        phone: user?.phone || "+1 (555) 000-0000",
        location: user?.location || "Not specified"
    });

    // Update profile if user changes
    React.useEffect(() => {
        if (user) {
            setProfile({
                name: user.name,
                email: user.email,
                phone: user.phone || "+1 (555) 000-0000",
                location: user.location || "Not specified"
            });
        }
    }, [user]);

    const [passwordData, setPasswordData] = useState({
        current: "",
        newPass: "",
        confirm: ""
    });

    // ✅ FIXED LOGOUT
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
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Profile Header */}
            <GlassCard className="p-8 border-accent-gold/20 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent-gold"></div>

                <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                        <input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="bg-transparent border border-white/10 text-white p-2 rounded-lg"
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            {profile.name}
                        </h2>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-lg mx-auto md:mx-0">

                        <div className="flex items-center space-x-3 text-primary-gray">
                            <Mail className="w-4 h-4 text-accent-gold" />
                            {isEditing ? (
                                <input
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="bg-transparent border border-white/10 text-white p-1 rounded-lg"
                                />
                            ) : (
                                <span className="text-sm font-medium">{profile.email}</span>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 text-primary-gray">
                            <Phone className="w-4 h-4 text-accent-gold" />
                            {isEditing ? (
                                <input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="bg-transparent border border-white/10 text-white p-1 rounded-lg"
                                />
                            ) : (
                                <span className="text-sm font-medium">{profile.phone}</span>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 text-primary-gray">
                            <MapPin className="w-4 h-4 text-accent-gold" />
                            {isEditing ? (
                                <input
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    className="bg-transparent border border-white/10 text-white p-1 rounded-lg"
                                />
                            ) : (
                                <span className="text-sm font-medium">{profile.location}</span>
                            )}
                        </div>

                    </div>
                </div>

                <div className="flex flex-col space-y-3 w-full md:w-auto">
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="py-3 px-6 rounded-xl bg-accent-gold text-background font-black text-xs uppercase tracking-widest"
                    >
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                </div>
            </GlassCard>

            {/* Change Password Section */}
            <GlassCard className="p-8 border-white/5 space-y-4">
                <h4 className="text-lg font-black text-white uppercase tracking-widest">
                    Change Password
                </h4>

                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPass}
                    onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <button
                    onClick={handlePasswordUpdate}
                    className="py-3 px-6 rounded-xl bg-accent-gold text-background font-black text-xs uppercase tracking-widest"
                >
                    Update Password
                </button>
            </GlassCard>

            {/* Logout Section */}
            <GlassCard className="p-8 border-white/5">
                <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-critical/30 flex items-center justify-between"
                >
                    <span className="flex items-center text-sm font-bold text-critical">
                        <LogOut className="w-4 h-4 mr-3 text-critical" />
                        Logout System
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary-gray" />
                </button>
            </GlassCard>

        </div>
    );
};

export default Profile;