import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileSetup() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Split states by role
  const [data, setData] = useState({
    branch: '', year: '', cgpa: '', domain: '', careerGoal: '',
    company: '', experience: '', profession: '', careerJourney: '',
    skills: '', interests: ''
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate fields
    if (user?.role === 'student') {
      const gpa = parseFloat(data.cgpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        setError("CGPA must be a valid number between 0 and 10.");
        setLoading(false);
        return;
      }
      if (!data.skills.trim()) {
        setError("Please enter at least one skill.");
        setLoading(false);
        return;
      }
    } else {
      const exp = parseFloat(data.experience);
      if (isNaN(exp) || exp < 0) {
        setError("Experience must be a valid positive number.");
        setLoading(false);
        return;
      }
      if (!data.skills.trim()) {
        setError("Please enter at least one skill.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...data,
      role: user.role, // pass role to trigger backend validation properly
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: data.interests ? data.interests.split(',').map(i => i.trim()).filter(Boolean) : [],
    };

    try {
      const res = await updateProfile(user._id, payload);
      // Re-hydrate context with new user data showing profileCompleted = true
      login(localStorage.getItem('token'), res.data);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data || "Error saving profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const shakeVariants = { shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div initial="hidden" animate="visible" variants={containerVars} className="glass-strong p-10 rounded-[2rem] w-full max-w-2xl border border-white/10 relative z-10 shadow-card">
        <h1 className="text-3xl font-display font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-400 mb-8 border-b border-white/10 pb-6">
          We need a few more details to set up your account and power the AI Matching engine.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div variants={shakeVariants} initial="shake" animate="shake" exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm overflow-hidden">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {user?.role === 'student' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Branch / Course</label>
                  <input type="text" name="branch" required value={data.branch} onChange={handleChange} className="input-glass" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Year</label>
                  <select name="year" required value={data.year} onChange={handleChange} className="input-glass appearance-none [&>option]:bg-dark-900">
                    <option value="" disabled>Select Year</option>
                    <option value="FE">First Year (FE)</option>
                    <option value="SE">Second Year (SE)</option>
                    <option value="TE">Third Year (TE)</option>
                    <option value="BE">Final Year (BE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Domain of Interest</label>
                  <input type="text" name="domain" required value={data.domain} onChange={handleChange} className="input-glass" placeholder="e.g. Artificial Intelligence" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Current CGPA</label>
                  <input type="number" step="0.01" name="cgpa" required value={data.cgpa} onChange={handleChange} className="input-glass" placeholder="e.g. 8.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Skills (Comma separated)</label>
                <input type="text" name="skills" required value={data.skills} onChange={handleChange} className="input-glass" placeholder="Python, React, Machine Learning" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Career Goal</label>
                <textarea name="careerGoal" rows="2" required value={data.careerGoal} onChange={handleChange} className="input-glass" placeholder="Where do you see yourself after graduation?"></textarea>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Job Role</label>
                  <input type="text" name="profession" required value={data.profession} onChange={handleChange} className="input-glass" placeholder="e.g. Senior Software Engineer" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Company Name</label>
                  <input type="text" name="company" required value={data.company} onChange={handleChange} className="input-glass" placeholder="e.g. Google" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Experience (Years)</label>
                  <input type="number" name="experience" required value={data.experience} onChange={handleChange} className="input-glass" placeholder="e.g. 4" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Domain Expertise</label>
                  <input type="text" name="domain" required value={data.domain} onChange={handleChange} className="input-glass" placeholder="e.g. Web Development" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Skills (Comma separated)</label>
                <input type="text" name="skills" required value={data.skills} onChange={handleChange} className="input-glass" placeholder="Node.js, AWS, System Design" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Brief Career Journey</label>
                <textarea name="careerJourney" rows="3" required value={data.careerJourney} onChange={handleChange} className="input-glass" placeholder="Briefly describe how you got to where you are."></textarea>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg mt-4 shadow-glow-sm transition-all disabled:opacity-70">
            {loading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
