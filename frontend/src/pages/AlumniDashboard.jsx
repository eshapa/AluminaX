import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getAlumniRequests, updateRequestStatus, createOpportunity } from "../api";
import { FiCheck, FiX, FiBriefcase, FiPlus, FiUsers, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function AlumniDashboard() {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Alumni";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // Tabs: pending, accepted, rejected

  // Modal State
  const [showOppModal, setShowOppModal] = useState(false);
  const [oppData, setOppData] = useState({ title: "", company: "", description: "", type: "job", link: "", domain: "" });

  useEffect(() => { fetchData() }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAlumniRequests(userId);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (reqId, status) => {
    try {
      await updateRequestStatus(reqId, status);
      fetchData();
    } catch (err) {
      alert("Error updating request");
    }
  };

  const handleCreateOpp = async (e) => {
    e.preventDefault();
    try {
      await createOpportunity({ ...oppData, postedBy: userId });
      setShowOppModal(false);
      setOppData({ title: "", company: "", description: "", type: "job", link: "", domain: "" });
      alert("Opportunity Posted!");
    } catch (err) {
      alert("Error posting opportunity");
    }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full"></motion.div>
    </div>
  );

  const filteredRequests = requests.filter(r => r.status === activeTab);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role="alumni" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <motion.div variants={containerVars} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-8">
            
            <motion.header variants={itemVars} className="glass border border-accent-500/30 rounded-3xl p-8 relative overflow-hidden flex justify-between items-center bg-gradient-to-r from-dark-800 to-dark-900">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <h1 className="text-3xl md:text-5xl font-display font-bold">Welcome, {userName.split(' ')[0]}</h1>
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow-glow-sm">
                     <FiAward /> Top Mentor
                   </motion.div>
                </div>
                <p className="text-gray-400">Manage your mentorship requests and post opportunities.</p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-full bg-accent-500/10 blur-3xl"></div>
            </motion.header>

            {/* Quick Actions & Stats */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-strong card-hover p-6 rounded-3xl relative overflow-hidden border border-white/5">
                 <h3 className="text-gray-400 mb-2 font-medium">Pending Requests</h3>
                 <p className="text-4xl font-display font-bold text-white shadow-glow-sm">{requests.filter(r => r.status === 'pending').length}</p>
                 <FiUsers className="absolute top-6 right-6 text-3xl text-primary-500/50" />
              </div>
              <div className="glass-strong card-hover p-6 rounded-3xl relative overflow-hidden border border-white/5">
                 <h3 className="text-gray-400 mb-2 font-medium">Active Students</h3>
                 <p className="text-4xl font-display font-bold text-white shadow-glow-sm">{requests.filter(r => r.status === 'accepted').length}</p>
                 <FiCheck className="absolute top-6 right-6 text-3xl text-accent-500/50" />
              </div>
              <div onClick={() => setShowOppModal(true)} className="glass-strong card-hover p-6 rounded-3xl relative overflow-hidden cursor-pointer bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-primary-500/30 group">
                 <div className="flex h-full items-center justify-center gap-3">
                   <div className="p-3 bg-white/10 rounded-full group-hover:scale-110 transition-transform"><FiPlus className="text-2xl" /></div>
                   <h3 className="text-xl font-display font-bold">Post Opportunity</h3>
                 </div>
              </div>
            </motion.div>

            {/* Tabbed Mentorship Requests */}
            <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 min-h-[400px]">
              <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-display font-bold">Mentorship Queue</h2>
                <div className="flex gap-2">
                  {['pending', 'accepted', 'rejected'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-primary-600 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredRequests.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 text-gray-400">
                      No {activeTab} requests found.
                    </motion.div>
                  ) : (
                    filteredRequests.map(r => (
                      <motion.div 
                        key={r._id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-dark-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between border border-white/5 hover:border-white/20 transition-colors gap-4"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
                            {r.studentId?.name?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{r.studentId?.name}</p>
                            <p className="text-sm text-gray-400">Mentorship Request</p>
                          </div>
                        </div>

                        {r.status === 'pending' && (
                          <div className="flex gap-3">
                            <button onClick={() => handleStatus(r._id, 'rejected')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition font-bold text-sm">
                              <FiX /> Reject
                            </button>
                            <button onClick={() => handleStatus(r._id, 'accepted')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition font-bold text-sm">
                              <FiCheck /> Accept
                            </button>
                          </div>
                        )}
                        {r.status === 'accepted' && (
                          <div className="flex items-center gap-3">
                            <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/30">Active Student</span>
                            <button onClick={() => window.location.href = "/messages"} className="bg-accent-600/20 hover:bg-accent-600/40 border border-accent-500/30 text-accent-400 py-1.5 px-6 rounded-xl font-bold text-sm transition">Chat</button>
                          </div>
                        )}
                        {r.status === 'rejected' && <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Declined</span>}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {showOppModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-strong p-8 rounded-3xl w-full max-w-xl border border-primary-500/30 shadow-card">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-display font-bold text-gradient">Post Opportunity</h2>
                 <button onClick={() => setShowOppModal(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
              </div>
              <form onSubmit={handleCreateOpp} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job Title</label>
                    <input type="text" required value={oppData.title} onChange={e => setOppData({...oppData, title: e.target.value})} className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company</label>
                    <input type="text" required value={oppData.company} onChange={e => setOppData({...oppData, company: e.target.value})} className="input-glass" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Domain (e.g. Engineering, Marketing)</label>
                  <input type="text" required value={oppData.domain} onChange={e => setOppData({...oppData, domain: e.target.value})} className="input-glass" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                    <select value={oppData.type} onChange={e => setOppData({...oppData, type: e.target.value})} className="input-glass appearance-none [&>option]:bg-dark-900">
                      <option value="job">Job</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Application Link</label>
                    <input type="url" required value={oppData.link} onChange={e => setOppData({...oppData, link: e.target.value})} className="input-glass" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea rows="3" required value={oppData.description} onChange={e => setOppData({...oppData, description: e.target.value})} className="input-glass"></textarea>
                </div>
                <button type="submit" className="w-full btn-primary text-sm font-bold py-4">Publish Opportunity</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}