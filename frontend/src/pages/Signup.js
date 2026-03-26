import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MainBackground } from '../components/Background/MainBackground';
import { GlassCard } from '../components/ui/GlassCard';
import {
  User, Mail, Lock, Droplets, ChevronDown,
  ArrowLeft, ArrowRight, ShieldPlus, AlertCircle, Loader, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: '', location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-sans tracking-tight">
      <MainBackground />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 w-full max-w-md px-6"
        >
          <GlassCard className="flex flex-col items-center border-white/10 shadow-[0_0_50px_rgba(10,37,64,0.5)]">

            {/* Back */}
            <button
              onClick={() => navigate('/login')}
              className="absolute top-6 left-6 text-ocean-light/40 hover:text-accent-gold flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>

            {/* Header */}
            <div className="mb-8 text-center pt-4 w-full px-2">
              <motion.div
                animate={{ rotate: 5 }}
                transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
                className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-ocean-light/10 border border-white/10"
              >
                <ShieldPlus className="w-10 h-10 text-accent-gold" />
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-2 uppercase italic">
                Water<span className="text-accent-gold">Monitor</span>
              </h2>
            </div>

            {/* Success Banner */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-2xl px-4 py-3 text-green-400 text-xs"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Account created! Redirecting to login…
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-red-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM */}
            <form onSubmit={handleSignup} className="w-full space-y-4">

              {/* Full Name */}
              <div>
                <p className="text-xs text-ocean-light/60 mb-1 font-semibold">Full Name</p>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/30" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={set('name')}
                    required
                    disabled={loading}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-3.5 pl-11 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-ocean-light/60 mb-1 font-semibold">Email Address</p>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/30" />
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={set('email')}
                    required
                    disabled={loading}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-3.5 pl-11 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <p className="text-xs text-ocean-light/60 mb-1 font-semibold">Password</p>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/30" />
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={set('password')}
                    required
                    disabled={loading}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-3.5 pl-11 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <p className="text-xs text-ocean-light/60 mb-1 font-semibold">Your Role</p>
                <div className="relative">
                  <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/30" />
                  <select
                    value={formData.role}
                    onChange={set('role')}
                    required
                    disabled={loading}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-3.5 pl-11 pr-10 text-white text-sm appearance-none focus:outline-none focus:border-accent-gold/40"
                  >
                    <option value="">Select your role</option>
                    <option value="citizen">Citizen</option>
                    <option value="ngo">NGO</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/30 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs text-ocean-light/60 mb-1 font-semibold">Location</p>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-light/30" />
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={set('location')}
                    disabled={loading}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-3.5 pl-11 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading || success}
                className="w-full relative overflow-hidden mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-[#B89830]" />
                <div className="relative py-3.5 text-ocean-deep font-black uppercase text-[11px] flex justify-center gap-2">
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </div>
              </motion.button>
            </form>

            <p className="mt-6 text-[10px] text-ocean-light/40">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="text-accent-gold cursor-pointer hover:underline">
                Log In
              </span>
            </p>

          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Signup;