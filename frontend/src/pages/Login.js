import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainBackground } from '../components/Background/MainBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { Shield, Lock, User, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(msg);
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
          transition={{ duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
          className="z-10 w-full max-w-md px-6"
        >
          <GlassCard className="flex flex-col items-center border-white/10 shadow-[0_0_50px_rgba(10,37,64,0.5)]">

            {/* Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-ocean-light/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-gold/5 rounded-full blur-[80px]" />

            {/* Logo Section */}
            <div className="mb-10 text-center relative">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
                className="inline-block mb-4 p-5 rounded-3xl bg-gradient-to-br from-ocean-light/10 to-transparent border border-white/10 relative"
              >
                <Shield className="w-12 h-12 text-accent-gold" />
                <div className="absolute inset-0 rounded-3xl animate-ripple bg-accent-gold/20 -z-10" />
              </motion.div>

              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">
                Water<span className="text-accent-gold">Watch</span>
              </h2>

              <div className="h-1 w-20 bg-accent-gold mx-auto rounded-full mb-4 opacity-80" />

              <p className="text-white text-sm font-medium leading-relaxed">
                Access your real-time water quality data <br />
                <span className="text-[10px] opacity-60">
                  Login to continue
                </span>
              </p>
            </div>

            {/* Error */}
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="space-y-4">

                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-light/30 group-focus-within:text-accent-gold transition-colors duration-300" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/20 transition-all duration-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-light/30 group-focus-within:text-accent-gold transition-colors duration-300" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[18px] py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/20 transition-all duration-500"
                    required
                    disabled={loading}
                  />
                </div>

              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                className="w-full relative group/btn overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
              >

                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-[#B89830] transition-all duration-500 group-hover/btn:scale-105" />

                <div className="relative py-4 px-6 flex items-center justify-center gap-2 text-ocean-deep font-black uppercase tracking-widest text-sm z-10">
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>LOG-IN</span>
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </>
                  )}
                </div>

              </motion.button>
            </form>

            {/* Bottom Section */}
            <div className="mt-10 flex flex-col items-center gap-4 w-full">

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <p className="text-xs text-white">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate('/signup')}
                  className="text-white cursor-pointer hover:underline font-semibold"
                >
                  Sign Up
                </span>
              </p>

            </div>

          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;