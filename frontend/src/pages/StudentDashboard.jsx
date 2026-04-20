import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getMatches, sendRequest, getStudentRequests, getOpportunities, getSessions, scheduleSession } from "../api";
import { FiBriefcase, FiUserPlus, FiCheckCircle, FiCalendar, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentDashboard() {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Student";
  
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Session Modal State
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [sessionData, setSessionData] = useState({ date: "", time: "", meetingLink: "" });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState('Career guidance');

  useEffect(() => { fetchData() }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchRes, reqRes, oppRes, sessRes] = await Promise.all([
        getMatches(userId), getStudentRequests(userId), getOpportunities(), getSessions(userId)
      ]);
      setMatches(matchRes.data);
      setRequests(reqRes.data);
      setOpportunities(oppRes.data);
      setSessions(sessRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (alumniId, topic) => {
    try {
      await sendRequest({ studentId: userId, alumniId, topic });
      alert("Mentorship request sent!");
      fetchData();
    } catch (err) {
      alert("Error sending request");
    }
  };

  const handleTopicRequestSubmit = (e) => {
    e.preventDefault();
    if(selectedMentor) {
      handleRequest(selectedMentor._id, requestTopic);
      setShowRequestModal(false);
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    try {
      await scheduleSession({
        studentId: userId,
        alumniId: activeRequest.alumniId._id,
        requestId: activeRequest._id,
        date: sessionData.date,
        time: sessionData.time,
        meetingLink: sessionData.meetingLink
      });
      setShowSessionModal(false);
      setSessionData({ date: "", time: "", meetingLink: "" });
      fetchData();
    } catch (err) {
      alert("Failed to schedule session.");
    }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"></motion.div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role="student" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <motion.div variants={containerVars} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-8">
            
            {/* Welcome Section */}
            <motion.header variants={itemVars} className="glass border border-primary-500/30 rounded-3xl p-8 relative overflow-hidden flex justify-between items-center bg-gradient-to-r from-dark-800 to-dark-900">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <h1 className="text-3xl md:text-5xl font-display font-bold">Welcome, {userName.split(' ')[0]}</h1>
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 text-sm font-bold rounded-full">
                     <FiStar /> Active Student
                   </motion.div>
                </div>
                <p className="text-gray-400">Here's what's happening with your mentorship journey today.</p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-full bg-primary-500/10 blur-3xl"></div>
            </motion.header>

            {/* KPI Cards */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Pending Mentors', count: requests.filter(r => r.status === 'pending').length, icon: <FiUserPlus />, color: 'primary' },
                { title: 'Active Mentors', count: requests.filter(r => r.status === 'accepted').length, icon: <FiCheckCircle />, color: 'accent' },
                { title: 'Opportunities', count: opportunities.length, icon: <FiBriefcase />, color: 'blue' },
                { title: 'Upcoming Sessions', count: sessions.length, icon: <FiCalendar />, color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className="glass-strong card-hover p-6 rounded-3xl relative overflow-hidden group shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] border border-white/5">
                  <div className={`absolute inset-0 bg-${stat.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <h3 className="text-gray-400 mb-2 font-medium">{stat.title}</h3>
                  <p className="text-4xl font-display font-bold text-white shadow-glow-sm">{stat.count}</p>
                  <div className={`absolute top-6 right-6 text-3xl text-${stat.color}-500/30 group-hover:text-${stat.color}-400 transition-colors`}>{stat.icon}</div>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              <div className="space-y-8">
                  {/* Sessions Map */}
                  {sessions.length > 0 && (
                    <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl"></div>
                      <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><FiCalendar className="text-purple-400"/> Scheduled Sessions</h2>
                      <div className="space-y-4 relative z-10">
                        {sessions.map(s => (
                          <div key={s._id} className="bg-dark-800 p-5 rounded-2xl flex justify-between items-center border border-white/10 hover:border-purple-500/30 transition">
                            <div>
                              <p className="font-bold text-lg">Meeting with {s.alumniId?.name}</p>
                              <p className="text-sm text-gray-400">{new Date(s.date).toLocaleDateString()} at {s.time}</p>
                            </div>
                            {s.meetingLink && (
                              <a href={s.meetingLink} target="_blank" rel="noreferrer" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-xl transition shadow-glow-sm tracking-wide text-sm">Join</a>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Mentor Matches */}
                  <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 relative">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 blur-2xl"></div>
                    <h2 className="text-2xl font-display font-bold mb-6 relative z-10">Recommended <span className="text-primary-400">Mentors</span></h2>
                    <div className="space-y-4 relative z-10">
                      {matches.slice(0, 3).map(m => (
                        <div key={m._id} className="bg-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition border border-transparent hover:border-primary-500/30">
                          <div>
                            <h3 className="font-bold text-lg">{m.name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{m.profession} at {m.company}</p>
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 flex items-center justify-center">
                                 <svg className="w-10 h-10 transform -rotate-90">
                                     <circle cx="20" cy="20" r="16" stroke="CurrentColor" strokeWidth="4" fill="transparent" className="text-dark-700" />
                                     <circle cx="20" cy="20" r="16" stroke="CurrentColor" strokeWidth="4" fill="transparent" strokeDasharray="100" strokeDashoffset={100 - m.matchPercentage} className="text-primary-500 transition-all duration-1000" />
                                 </svg>
                                 <span className="absolute text-[10px] font-bold">{m.matchPercentage}%</span>
                              </div>
                              <span className="text-xs font-semibold text-primary-300 bg-primary-500/10 px-2 py-1 rounded">Match</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => { setSelectedMentor(m); setShowRequestModal(true); }}
                            disabled={requests.some(r => r.alumniId?._id === m._id)}
                            className={`px-5 py-2 text-sm font-bold rounded-xl transition shadow-glow-sm ${requests.some(r => r.alumniId?._id === m._id) ? 'bg-dark-700 text-gray-400 cursor-not-allowed border border-white/10' : 'bg-primary-600 hover:bg-primary-500 text-white'}`}
                          >
                            {requests.some(r => r.alumniId?._id === m._id) ? "Requested" : "Connect"}
                          </button>
                        </div>
                      ))}
                      {matches.length === 0 && <p className="text-gray-400 text-center py-4">Complete your profile to get perfect mentor matches.</p>}
                    </div>
                  </motion.div>
              </div>

              {/* Sent Requests */}
              <div className="space-y-8">
                <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 h-full">
                  <h2 className="text-2xl font-display font-bold mb-6">Your Requests</h2>
                  <div className="space-y-4">
                    {requests.length === 0 ? (
                      <div className="bg-dark-800 p-8 rounded-2xl text-center text-gray-500 border border-white/5">
                        No requests sent yet. Start connecting!
                      </div>
                    ) : (
                      requests.map(r => (
                        <div key={r._id} className="bg-white/5 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/20 transition">
                          <div>
                            <p className="font-semibold text-lg">{r.alumniId?.name}</p>
                            <p className="text-sm text-gray-400">Mentorship Request</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              r.status === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              r.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {r.status}
                            </span>
                            {r.status === 'accepted' && (
                              <button onClick={() => { setActiveRequest(r); setShowSessionModal(true); }} className="bg-dark-700 hover:bg-dark-600 border border-white/10 text-white py-1 px-4 text-xs font-bold rounded-full transition">Schedule</button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {showSessionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-strong p-8 rounded-3xl w-full max-w-md border border-primary-500/30 shadow-card">
              <h2 className="text-2xl font-display font-bold mb-6 text-gradient">Schedule Session</h2>
              <p className="text-gray-400 text-sm mb-6">With {activeRequest?.alumniId?.name}</p>
              <form onSubmit={handleScheduleSession} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                  <input type="date" required value={sessionData.date} onChange={e => setSessionData({...sessionData, date: e.target.value})} className="input-glass [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Time</label>
                  <input type="time" required value={sessionData.time} onChange={e => setSessionData({...sessionData, time: e.target.value})} className="input-glass [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Meeting Link (Zoom/Meet)</label>
                  <input required type="url" value={sessionData.meetingLink} onChange={e => setSessionData({...sessionData, meetingLink: e.target.value})} className="input-glass" placeholder="https://" />
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setShowSessionModal(false)} className="flex-1 btn-secondary text-sm font-bold">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm font-bold">Schedule</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showRequestModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-strong p-8 rounded-3xl w-full max-w-md border border-primary-500/30 shadow-card">
              <h2 className="text-2xl font-display font-bold mb-2">Request Guidance</h2>
              <p className="text-gray-400 text-sm mb-6">Connect with {selectedMentor?.name}</p>
              
              <form onSubmit={handleTopicRequestSubmit} className="space-y-6">
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
                  <button type="submit" className="flex-1 btn-primary text-sm font-bold">
                    Send Request
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