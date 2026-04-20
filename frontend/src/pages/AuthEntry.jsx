import { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { demoLogin } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

export default function AuthEntry() {
  const location = useLocation();
  const isLoginPath = location.pathname.includes('login');
  const [isLogin, setIsLogin] = useState(isLoginPath);
  
  const { login } = useContext(AuthContext);

  const pathRole = location.pathname.includes('admin') ? 'admin' :
                   location.pathname.includes('alumni') ? 'alumni' : 'student';

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [role, setRole] = useState(pathRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = () => {
    let score = 0;
    if (formData.password.length > 5) score++;
    if (formData.password.length > 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    return score; // Max 4
  };

  const getStrengthBarParams = () => {
    const score = getPasswordStrength();
    if (score === 0 && formData.password.length > 0) return { width: '20%', color: 'bg-red-500' };
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

    // Pre-flight validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
       return setError("Please enter a valid email address.");
    }
    if (formData.password.length < 6) {
       return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email: formData.email, password: formData.password });
        login(res.data.token, res.data.user);
      } else {
        const name = `${formData.firstName} ${formData.lastName}`.trim();
        const res = await axios.post('http://localhost:5000/api/auth/register', { name, email: formData.email, password: formData.password, role });
        login(res.data.token, res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const shakeVariants = {
    shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  return (
    <div className="flex min-h-screen bg-dark-900 overflow-hidden font-sans">
      
      {/* Left Split - Graphic */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-hero-gradient"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-lg text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_40px_rgba(139,92,246,0.5)] mb-8 tracking-tighter">
            AX
          </div>
          <h1 className="text-5xl font-display font-extrabold text-white mb-6 leading-tight">
            The bridge between <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Ambition</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-orange-400">Success</span>.
          </h1>
          <p className="text-xl text-gray-400">Join the smartest networking platform built exclusively for university ecosystems.</p>
        </motion.div>
      </div>

      {/* Right Split - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-[2rem] p-8 md:p-10 shadow-card border border-white/10"
          >
            <div className="flex bg-white/5 rounded-xl p-1 mb-8 relative">
              <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary-600 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform duration-300 ease-in-out ${isLogin ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'}`}></div>
              <button type="button" className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors ${isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => { setIsLogin(true); setError(''); }}>Sign In</button>
              <button type="button" className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</button>
            </div>

            <h2 className="text-3xl font-display font-bold text-white mb-6">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <AnimatePresence>
              {error && (
                <motion.div variants={shakeVariants} initial="shake" animate="shake" exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm overflow-hidden">
                  {typeof error === 'string' ? error : "Authentication failed."}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white/10" required />
                      <label htmlFor="firstName" className="absolute text-xs text-gray-400 left-4 top-4 transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-primary-400 peer-valid:text-[10px] peer-valid:top-2 uppercase font-semibold tracking-wider">First Name</label>
                    </div>
                    <div className="relative group">
                      <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white/10" required />
                      <label htmlFor="lastName" className="absolute text-xs text-gray-400 left-4 top-4 transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-primary-400 peer-valid:text-[10px] peer-valid:top-2 uppercase font-semibold tracking-wider">Last Name</label>
                    </div>
                    <div className="col-span-2 mt-2">
                       <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">I am a</label>
                       <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          <button type="button" onClick={() => setRole('student')} className={`w-full py-2 sm:py-3 text-sm rounded-xl border transition-all ${role === 'student' ? 'border-primary-500 bg-primary-500/20 text-primary-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>Student</button>
                          <button type="button" onClick={() => setRole('alumni')} className={`w-full py-2 sm:py-3 text-sm rounded-xl border transition-all ${role === 'alumni' ? 'border-accent-500 bg-accent-500/20 text-accent-300 shadow-[0_0_15px_rgba(2ec4b6,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>Alumni / Mentor</button>
                          <button type="button" onClick={() => setRole('admin')} className={`w-full py-2 sm:py-3 text-sm rounded-xl border transition-all ${role === 'admin' ? 'border-red-500 bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>Admin</button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white/10" required />
                <label htmlFor="email" className="absolute text-xs text-gray-400 left-4 top-4 transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-primary-400 peer-valid:text-[10px] peer-valid:top-2 uppercase font-semibold tracking-wider pointer-events-none">Email Address</label>
              </div>

              <div className="relative group">
                <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 pr-10 text-white text-sm outline-none transition-colors focus:border-primary-500 focus:bg-white/10" required />
                <label htmlFor="password" className="absolute text-xs text-gray-400 left-4 top-4 transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-primary-400 peer-valid:text-[10px] peer-valid:top-2 uppercase font-semibold tracking-wider pointer-events-none">Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors" tabIndex="-1">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              
              {!isLogin && (
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                   <motion.div initial={{ width: 0 }} animate={{ width: strParams.width }} className={`h-full ${strParams.color} transition-all duration-300 ease-out`}></motion.div>
                </div>
              )}

              {isLogin && (
                <div className="text-right mt-2">
                   <a href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">Forgot Password?</a>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold justify-center py-4 mt-8 rounded-xl disabled:opacity-70 text-lg transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.4)]">
                {loading ? (
                  <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing</span>
                ) : (isLogin ? "Sign In" : "Create Account")}
             </button>
            </form>

            {/* Quick Demo Switcher - Dev Only */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
               <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Quick Switcher (Presentation Mode)</p>
               <div className="flex gap-2 justify-center">
                  <button onClick={async () => login((await demoLogin('admin')).data.token, (await demoLogin('admin')).data.user)} className="bg-dark-800 hover:bg-red-500/20 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-gray-400 text-xs py-2 px-3 rounded-lg transition-all">
                    Admin
                  </button>
                  <button onClick={async () => login((await demoLogin('student')).data.token, (await demoLogin('student')).data.user)} className="bg-dark-800 hover:bg-primary-500/20 hover:text-primary-400 border border-white/5 hover:border-primary-500/30 text-gray-400 text-xs py-2 px-3 rounded-lg transition-all">
                    Student
                  </button>
                  <button onClick={async () => login((await demoLogin('alumni')).data.token, (await demoLogin('alumni')).data.user)} className="bg-dark-800 hover:bg-accent-500/20 hover:text-accent-400 border border-white/5 hover:border-accent-500/30 text-gray-400 text-xs py-2 px-3 rounded-lg transition-all">
                    Alumni
                  </button>
               </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
