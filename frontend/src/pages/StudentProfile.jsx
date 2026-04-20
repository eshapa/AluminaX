import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getProfile, updateProfile } from "../api";
import { FiEdit2, FiSave, FiAward, FiTarget, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentProfile() {
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState({ name: "", bio: "", skills: [], interests: [], careerGoal: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [tempSkill, setTempSkill] = useState("");
  const [tempInterest, setTempInterest] = useState("");

  useEffect(() => {
    getProfile(userId).then(res => {
      if(res.data) setProfile(res.data);
      setLoading(false);
    });
  }, [userId]);

  const handleUpdate = async () => {
    try {
      await updateProfile(userId, profile);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const addPill = (field, value, setter) => {
    if(value && !profile[field].includes(value)) {
      setProfile({ ...profile, [field]: [...profile[field], value] });
      setter("");
    }
  };

  const removePill = (field, value) => {
    setProfile({ ...profile, [field]: profile[field].filter(v => v !== value) });
  };

  if (loading) return <div className="min-h-screen bg-dark-900" />;

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role="student" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 mix-blend-overlay pointer-events-none"></div>
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
            
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-display font-bold">Your <span className="text-gradient">Profile</span></h1>
              <button 
                onClick={() => editMode ? handleUpdate() : setEditMode(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-card ${editMode ? 'bg-primary-600 text-white shadow-glow-sm' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                {editMode ? <><FiSave /> Save Changes</> : <><FiEdit2 /> Edit Profile</>}
              </button>
            </div>

            <div className="glass-strong rounded-3xl p-8 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px] rounded-full pointer-events-none"></div>
               
               <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-3xl font-bold shadow-glow">
                   {profile.name?.charAt(0) || "S"}
                 </div>
                 <div>
                    {editMode ? (
                      <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="input-glass text-2xl font-bold mb-2 p-2 w-full max-w-xs" />
                    ) : (
                      <h2 className="text-3xl font-display font-bold mb-1">{profile.name}</h2>
                    )}
                    <span className="bg-primary-500/20 text-primary-400 border border-primary-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Student</span>
                 </div>
               </div>

               <div className="space-y-8 relative z-10">
                 <div>
                   <h3 className="text-lg font-bold text-gray-300 mb-2 flex items-center gap-2"><FiTarget className="text-accent-400"/> Career Goal</h3>
                   {editMode ? (
                     <textarea rows="2" value={profile.careerGoal} onChange={e => setProfile({...profile, careerGoal: e.target.value})} className="input-glass" placeholder="What are you trying to achieve?" />
                   ) : (
                     <p className="text-gray-400 text-lg">{profile.careerGoal || "Set a career goal to help mentors understand your ambition."}</p>
                   )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Skills */}
                   <div className="bg-dark-800/80 p-6 rounded-2xl border border-white/5">
                     <h3 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2"><FiAward /> Top Skills</h3>
                     
                     <div className="flex flex-wrap gap-2 mb-4">
                       <AnimatePresence>
                         {profile.skills.map(s => (
                           <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={s} className="bg-primary-600/20 text-primary-300 border border-primary-500/30 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                             {s} {editMode && <button onClick={() => removePill('skills', s)} className="text-primary-500 hover:text-red-400"><FiX size={14}/></button>}
                           </motion.span>
                         ))}
                       </AnimatePresence>
                     </div>

                     {editMode && (
                       <div className="flex gap-2">
                         <input type="text" value={tempSkill} onChange={e => setTempSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPill('skills', tempSkill, setTempSkill)} className="input-glass py-2" placeholder="Add skill" />
                         <button onClick={() => addPill('skills', tempSkill, setTempSkill)} className="btn-secondary px-4 py-2 text-sm">+</button>
                       </div>
                     )}
                   </div>

                   {/* Interests */}
                   <div className="bg-dark-800/80 p-6 rounded-2xl border border-white/5">
                     <h3 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2"><FiStar /> Interests</h3>
                     
                     <div className="flex flex-wrap gap-2 mb-4">
                       <AnimatePresence>
                         {profile.interests.map(i => (
                           <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={i} className="bg-accent-600/20 text-accent-300 border border-accent-500/30 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                             {i} {editMode && <button onClick={() => removePill('interests', i)} className="text-accent-500 hover:text-red-400"><FiX size={14}/></button>}
                           </motion.span>
                         ))}
                       </AnimatePresence>
                     </div>

                     {editMode && (
                       <div className="flex gap-2">
                         <input type="text" value={tempInterest} onChange={e => setTempInterest(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPill('interests', tempInterest, setTempInterest)} className="input-glass py-2" placeholder="Add interest" />
                         <button onClick={() => addPill('interests', tempInterest, setTempInterest)} className="btn-secondary px-4 py-2 text-sm">+</button>
                       </div>
                     )}
                   </div>
                 </div>

                 <div>
                    <h3 className="text-lg font-bold text-gray-300 mb-2">Short Bio</h3>
                    {editMode ? (
                     <textarea rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="input-glass" placeholder="Tell mentors about yourself" />
                   ) : (
                     <p className="text-gray-400 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">{profile.bio || "No bio updated."}</p>
                   )}
                 </div>
               </div>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
import { FiX } from "react-icons/fi";