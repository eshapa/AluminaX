import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess("If an account with that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const shakeVariants = {
    shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  return (
    <div className="flex min-h-screen bg-dark-900 overflow-hidden font-sans relative justify-center items-center">
      <div className="absolute inset-0 bg-hero-gradient opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-[2rem] p-8 md:p-10 shadow-card border border-white/10 w-full max-w-md z-10"
      >
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div variants={shakeVariants} initial="shake" animate="shake" exit={{ opacity: 0, height: 0 }} className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm overflow-hidden">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm overflow-hidden">
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white/10" required />
            <label htmlFor="email" className="absolute text-xs text-gray-400 left-4 top-4 transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-primary-400 peer-valid:text-[10px] peer-valid:top-2 uppercase font-semibold tracking-wider pointer-events-none">Email Address</label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold justify-center py-4 mt-8 rounded-xl disabled:opacity-70 text-lg transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.4)]">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-4">
             <a href="/login" className="text-xs text-gray-400 hover:text-white transition-colors">Back to Sign In</a>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
