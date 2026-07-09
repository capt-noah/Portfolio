import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert, X, Eye, EyeOff } from 'lucide-react';
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
      {/* Page technical grid background */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 tech-dot-bg opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-bg border-2 border-fg p-10 md:p-12 relative overflow-hidden shadow-[4px_4px_0px_#0B0D11] rounded-none"
      >
        {/* Corner Tech Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent" />

        {/* Top telemetry lines */}
        <div className="absolute top-3 right-4 font-mono text-[8px] text-fg/30 tracking-widest">[CMS_GATEWAY // SECURE]</div>

        <div className="relative z-10">
          <div className="w-16 h-16 bg-fg text-bg border-2 border-fg flex items-center justify-center mb-8 mx-auto rounded-none">
            <Lock size={28} />
          </div>

          <h1 className="text-3xl font-display font-black uppercase text-fg mb-2 text-center tracking-tight leading-none">
            Security Check
          </h1>
          <p className="text-muted text-[10px] mb-10 text-center font-bold tracking-[0.25em] uppercase font-mono">
            [ ARCHIVE CMS ACCESS ]
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-fg/60 ml-0.5">
                // ENTER ACCESS KEY
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-fg/[0.02] border-2 border-fg/30 rounded-none px-5 py-4 text-fg placeholder:text-fg/20 focus:outline-none focus:border-accent transition-all font-mono pr-14 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-fg/40 hover:text-accent transition-colors cursor-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-accent-red/5 border border-accent-red text-accent-red rounded-none p-4 flex items-center gap-3 text-xs font-mono font-bold uppercase"
                >
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fg text-bg py-4 border-2 border-fg hover:bg-accent hover:border-accent hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed h-[58px] rounded-none font-bold cursor-none"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  AUTHORIZE_SESSION
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-fg/10 pt-6">
            <button
              onClick={() => navigate('/')}
              className="font-mono text-[9px] uppercase tracking-widest text-fg/50 hover:text-accent transition-colors flex items-center justify-center gap-2 mx-auto cursor-none font-bold"
            >
              <X size={10} />
              [ Return to Public Interface ]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
