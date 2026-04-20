import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getMatches, sendRequest, getStudentRequests } from "../api";
import { FiSearch, FiFilter, FiUserPlus, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function ExploreAlumni() {
  const userId = localStorage.getItem("userId");
  
  const [alumni, setAlumni] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [skillFilter, setSkillFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  // Request Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState('Career guidance');
  const [sendingTopic, setSendingTopic] = useState(false);

  useEffect(() => { fetchAlumni() }, []);
  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchAlumni();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [skillFilter, domainFilter]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const [alumniRes, reqRes] = await Promise.all([
        getMatches(userId, skillFilter, domainFilter), // Reuse matches route for all filtered alumni
        getStudentRequests(userId)
      ]);
      setAlumni(alumniRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRequest = (mentor) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSendingTopic(true);
    try {
      await sendRequest({ studentId: userId, alumniId: selectedMentor._id, topic: requestTopic });
      setShowRequestModal(false);
      fetchAlumni(); // Re-fetch to update button states
    } catch (err) {
      alert("Error sending request");
    } finally {
      setSendingTopic(false);
    }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role="student" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 mix-blend-overlay pointer-events-none"></div>
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl font-display font-bold mb-4">Explore Alumni Network</h1>
              <p className="text-gray-400">Search for mentors by specific skillsets, programming languages, or domain expertise.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                  <FiSearch />
                </div>
                <input 
                  type="text" 
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Search skills (e.g. React, Python)"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent-500 transition-colors">
                  <FiFilter />
                </div>
                <input 
                  type="text" 
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-accent-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Filter by Domain"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <motion.div variants={containerVars} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumni.map(a => {
                  const isRequested = requests.some(r => r.alumniId?._id === a._id);
                  return (
                    <motion.div key={a._id} variants={itemVars} className="glass-strong rounded-3xl p-6 border border-white/5 hover:border-white/20 transition group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-2xl font-bold border-2 border-white/10 group-hover:scale-105 transition-transform">
                          {a.name.charAt(0)}
                        </div>
                        <div className="flex items-center gap-2 bg-dark-800 px-3 py-1.5 rounded-full border border-white/5">
                           <span className="text-primary-400 font-bold text-sm">{a.matchPercentage}%</span>
                           <span className="text-gray-400 text-xs">Match</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">{a.name}</h3>
                      <p className="text-accent-400 font-medium text-sm mb-4">{a.profession} at {a.company}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {a.skills?.slice(0, 4).map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">{s}</span>
                        ))}
                        {a.skills?.length > 4 && <span className="px-3 py-1 bg-white/5 text-gray-500 text-xs rounded-full">+{a.skills.length - 4}</span>}
                      </div>

                      <button 
                        onClick={() => handleOpenRequest(a)}
                        disabled={isRequested}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                          isRequested 
                            ? 'bg-dark-700 text-gray-400 border border-white/10 cursor-not-allowed' 
                            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-glow-sm'
                        }`}
                      >
                        {isRequested ? <><FiCheck /> Requested</> : <><FiUserPlus /> Request Mentorship</>}
                      </button>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {!loading && alumni.length === 0 && (
              <div className="bg-dark-800 border border-white/10 p-12 rounded-3xl text-center">
                <FiSearch className="text-5xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">No mentors found</h3>
                <p className="text-gray-500">Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mentorship Topic Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-strong p-8 rounded-3xl w-full max-w-md border border-primary-500/30 shadow-card">
              <h2 className="text-2xl font-display font-bold mb-2">Request Guidance</h2>
              <p className="text-gray-400 text-sm mb-6">Connect with {selectedMentor?.name}</p>
              
              <form onSubmit={handleSendRequest} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Topic of Discussion</label>
                  <select 
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none appearance-none"
                  >
                    <option value="Career guidance">Career Guidance</option>
                    <option value="Resume review">Resume Review</option>
                    <option value="Internship help">Internship / Job Help</option>
                    <option value="General networking">General Networking</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowRequestModal(false)} className="flex-1 btn-secondary text-sm font-bold">Cancel</button>
                  <button type="submit" disabled={sendingTopic} className="flex-1 btn-primary text-sm font-bold disabled:opacity-70">
                    {sendingTopic ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
