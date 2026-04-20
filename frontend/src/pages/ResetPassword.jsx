import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    return score; // Max 4
  };

  const getStrengthBarParams = () => {
    const score = getPasswordStrength();
    if (score === 0 && password.length > 0) return { width: '20%', color: 'bg-red-500' };
    if (score === 1) return { width: '40%', color: 'bg-orange-500' };
    if (score === 2) return { width: '60%', color: 'bg-yellow-500' };
    if (score === 3) return { width: '80%', color: 'bg-green-400' };
    if (score === 4) return { width: '100%', color: 'bg-green-500' };
    return { width: '0%', color: 'bg-transparent' };
  };

  const strParams = getStrengthBarParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      setSuccess("Password has been reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to process request. Token may be expired.");
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
          New Password
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Please enter your new password below.
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
            <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 pr-10 text-white text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white/10" required />
            <label htmlFor="password" className="absolute text-xs text-gray-400 left-4 top-4 transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-primary-400 peer-valid:text-[10px] peer-valid:top-2 uppercase font-semibold tracking-wider pointer-events-none">New Password</label>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors" tabIndex="-1">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
             <motion.div initial={{ width: 0 }} animate={{ width: strParams.width }} className={`h-full ${strParams.color} transition-all duration-300 ease-out`}></motion.div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold justify-center py-4 mt-8 rounded-xl disabled:opacity-70 text-lg transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.4)]">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
