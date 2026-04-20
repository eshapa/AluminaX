import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getProfile, updateProfile } from "../api";
import { FiEdit2, FiSave, FiMap, FiBriefcase, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function AlumniProfile() {
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState({ name: "", bio: "", company: "", profession: "", skills: [], experience: [] });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [tempSkill, setTempSkill] = useState("");
  const [tempExp, setTempExp] = useState({ role: "", company: "", year: "" });

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

  const addSkill = () => {
    if(tempSkill && !profile.skills.includes(tempSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, tempSkill] });
      setTempSkill("");
    }
  };

  const addExp = () => {
    if(tempExp.role && tempExp.company) {
      setProfile({ ...profile, experience: [...(profile.experience || []), tempExp] });
      setTempExp({ role: "", company: "", year: "" });
    }
  };

  if (loading) return <div className="min-h-screen bg-dark-900" />;

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role="alumni" />
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
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 blur-[100px] rounded-full pointer-events-none"></div>

               <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-600 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-[0_0_40px_rgba(249,115,22,0.4)]">
                   {profile.name?.charAt(0) || "A"}
                 </div>
                 <div className="flex-1">
                    {editMode ? (
                      <div className="space-y-2 max-w-sm">
                        <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="input-glass text-xl font-bold p-2" placeholder="Name" />
                        <div className="flex gap-2">
                           <input type="text" value={profile.profession} onChange={e => setProfile({...profile, profession: e.target.value})} className="input-glass p-2 text-sm flex-1" placeholder="Profession (e.g. Engineer)" />
                           <input type="text" value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className="input-glass p-2 text-sm flex-1" placeholder="Company" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-3xl font-display font-bold mb-1">{profile.name}</h2>
                        <p className="text-lg text-accent-400 font-medium">{profile.profession} @ <span className="text-white">{profile.company}</span></p>
                      </>
                    )}
                 </div>
               </div>

               {/* Mentorship Offerings */}
               <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-8">
                  <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4 flex items-center gap-2"><FiBriefcase /> Key Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {profile.skills?.map(s => (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={s} className="bg-dark-800 text-gray-300 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                          {s} {editMode && <button onClick={() => setProfile({...profile, skills: profile.skills.filter(i=>i!==s)})} className="text-gray-500 hover:text-red-400"><FiX size={14}/></button>}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  {editMode && (
                    <div className="flex gap-2 mt-4 max-w-xs">
                       <input type="text" value={tempSkill} onChange={e => setTempSkill(e.target.value)} onKeyDown={e => e.key==='Enter' && addSkill()} className="input-glass py-2 text-sm" placeholder="Add expertise..." />
                       <button onClick={addSkill} className="bg-white/10 hover:bg-white/20 px-3 rounded-lg">+</button>
                    </div>
                  )}
               </div>

               {/* Visual Profile Timeline */}
               <div>
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><FiMap className="text-accent-500" /> Career Roadmap</h3>
                 </div>
                 
                 <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {(!profile.experience || profile.experience.length === 0) && !editMode && (
                      <p className="text-gray-500 text-center py-8">No career history uploaded.</p>
                    )}
                    
                    {profile.experience?.map((exp, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-dark-800 text-accent-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)] absolute left-0 md:left-1/2 z-10">
                            <div className="w-2 h-2 rounded-full bg-accent-500 shadow-glow-sm"></div>
                         </div>
                         <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 ml-12 md:ml-0">
                            <div className="glass-strong p-5 rounded-2xl border border-white/5 shadow-card hover:border-accent-500/30 transition-colors">
                                <div className="text-accent-400 font-bold text-xs mb-1 tracking-widest uppercase">{exp.year}</div>
                                <h4 className="font-bold text-lg">{exp.role}</h4>
                                <p className="text-gray-400 text-sm">{exp.company}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 {editMode && (
                   <div className="mt-8 bg-dark-800/80 p-6 rounded-2xl border border-white/5">
                      <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Add Milestone</h4>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <input type="text" placeholder="Year (e.g. 2023)" value={tempExp.year} onChange={e=>setTempExp({...tempExp, year: e.target.value})} className="input-glass py-2 text-sm" />
                        <input type="text" placeholder="Role (e.g. Senior Dev)" value={tempExp.role} onChange={e=>setTempExp({...tempExp, role: e.target.value})} className="input-glass py-2 text-sm" />
                        <input type="text" placeholder="Company" value={tempExp.company} onChange={e=>setTempExp({...tempExp, company: e.target.value})} className="input-glass py-2 text-sm" />
                      </div>
                      <button onClick={addExp} className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition">Add to Roadmap</button>
                   </div>
                 )}
               </div>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}