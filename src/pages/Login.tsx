import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert, X, Eye, EyeOff, Terminal, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';

export default function Login() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        setError('Verification failed. Invalid access key.');
      }
    } catch (err) {
      setError('System communication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center p-6 relative select-none">
      {/* Page technical drafting background */}
      <div className="absolute inset-0 tech-grid-bg opacity-35 pointer-events-none" />
      <div className="absolute inset-0 tech-dot-bg opacity-25 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-surface/95 border border-fg/20 p-8 sm:p-10 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] hud-plate-a"
      >
        {/* Top Tactical Window Bar */}
        <div className="flex items-center justify-between border-b border-fg/10 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span className="font-mono text-[10px] text-fg uppercase tracking-widest font-bold">
              [CMS_GATEWAY // AUTH_PORT]
            </span>
          </div>
          <span className="font-mono text-[9px] text-accent font-bold">
            380/AC002 // 09
          </span>
        </div>

        <div className="relative z-10">
          <div className="w-14 h-14 bg-fg text-surface flex items-center justify-center mb-6 mx-auto hud-pill">
            <Lock size={22} className="text-accent" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-fg mb-1 text-center tracking-tight leading-none">
            SECURITY CHECK
          </h1>
          <p className="text-muted text-[9.5px] mb-8 text-center font-bold tracking-[0.25em] uppercase font-mono">
            [ ARCHIVE CMS ACCESS PORTAL ]
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-mono text-[9.5px] uppercase tracking-[0.2em] text-accent font-bold">
                // ENTER ACCESS KEY
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-fg/[0.02] border border-fg/20 px-4 py-3.5 text-fg placeholder:text-fg/20 focus:outline-none focus:border-accent transition-all font-mono pr-12 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-fg/40 hover:text-accent transition-colors cursor-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-accent/10 border border-accent text-accent p-3 flex items-center gap-2 text-xs font-mono font-bold uppercase"
                >
                  <ShieldAlert size={15} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white py-3.5 font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group disabled:opacity-50 h-[50px] font-bold shadow-[0_4px_16px_rgba(255,85,0,0.3)] transition-all cursor-none hud-pill"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <span>AUTHORIZE SESSION</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-fg/10 pt-4">
            <button
              onClick={() => navigate('/')}
              className="font-mono text-[9px] uppercase tracking-widest text-fg/50 hover:text-accent transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-none font-bold"
            >
              <X size={10} />
              <span>RETURN TO PUBLIC INTERFACE</span>
            </button>
          </div>
        </div>

        {/* Diagonal zebra hatch corner */}
        <div className="absolute top-0 right-0 w-8 h-8 hazard-hatch-dark opacity-10" />
      </motion.div>
    </div>
  );
}

