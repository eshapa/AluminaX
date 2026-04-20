import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getAdminStats, getAdminUsers } from "../api";
import { FiUsers, FiUserCheck, FiBriefcase, FiMessageSquare, FiSearch } from "react-icons/fi";
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAlumni: 0,
    totalRequests: 0,
    totalOpportunities: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          getAdminStats(),
          getAdminUsers()
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <motion.div variants={containerVars} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <motion.header variants={itemVars} className="glass border border-red-500/30 rounded-3xl p-8 relative overflow-hidden flex justify-between items-center bg-gradient-to-r from-dark-800 to-dark-900">
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">System Overview</h1>
                <p className="text-gray-400">Welcome back, {userName}. Here is the current health of the AlumNetX ecosystem.</p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-full bg-red-500/10 blur-3xl"></div>
            </motion.header>

            {/* Top Stats */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', count: stats.totalUsers, icon: <FiUsers />, color: 'red' },
                { title: 'Total Students', count: stats.totalStudents, icon: <FiUserCheck />, color: 'primary' },
                { title: 'Total Alumni', count: stats.totalAlumni, icon: <FiBriefcase />, color: 'accent' },
                { title: 'Mentorship Requests', count: stats.totalRequests, icon: <FiMessageSquare />, color: 'yellow' }
              ].map((stat, i) => (
                <div key={i} className="glass-strong card-hover p-6 rounded-3xl relative overflow-hidden group shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] border border-white/5">
                  <div className={`absolute inset-0 bg-${stat.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <h3 className="text-gray-400 mb-2 font-medium">{stat.title}</h3>
                  <p className="text-4xl font-display font-bold text-white shadow-glow-sm">{stat.count}</p>
                  <div className={`absolute top-6 right-6 text-3xl text-${stat.color}-500/30 group-hover:text-${stat.color}-400 transition-colors`}>{stat.icon}</div>
                </div>
              ))}
            </motion.div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 relative h-64 flex flex-col items-center justify-center text-center group hover:border-red-500/30 transition-colors">
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FiBriefcase className="text-5xl text-red-500/50 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Live Opportunities</h3>
                  <p className="text-gray-400 mb-2">Total jobs and internships posted across the platform.</p>
                  <div className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">{stats.totalOpportunities}</div>
               </motion.div>
               <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 relative h-64 flex flex-col items-center justify-center text-center group hover:border-primary-500/30 transition-colors">
                  <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FiUsers className="text-5xl text-primary-500/50 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Network Growth</h3>
                  <p className="text-gray-400 mb-2">Ratio of Alumni to active Students.</p>
                  <div className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                    {stats.totalStudents > 0 ? (stats.totalAlumni / stats.totalStudents).toFixed(2) : 0} : 1
                  </div>
               </motion.div>
            </div>

            {/* User Details Table */}
            <motion.div variants={itemVars} className="glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden">
               <h2 className="text-2xl font-display font-bold mb-6">User Directory</h2>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                       <th className="pb-3 pr-4 font-semibold">Name</th>
                       <th className="pb-3 pr-4 font-semibold">Email</th>
                       <th className="pb-3 pr-4 font-semibold">Role</th>
                       <th className="pb-3 pr-4 font-semibold">Profile Status</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {users.map((u) => (
                       <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                         <td className="py-4 pr-4 font-bold">{u.name}</td>
                         <td className="py-4 pr-4 text-gray-400">{u.email}</td>
                         <td className="py-4 pr-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                             u.role === 'student' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                             'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                           }`}>
                             {u.role}
                           </span>
                         </td>
                         <td className="py-4 pr-4 flex items-center gap-2">
                           {u.profileCompleted ? (
                             <><div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-gray-300">Complete</span></>
                           ) : (
                             <><div className="w-2 h-2 rounded-full bg-yellow-500"></div> <span className="text-gray-400">Incomplete</span></>
                           )}
                         </td>
                       </tr>
                     ))}
                     {users.length === 0 && (
                       <tr>
                         <td colSpan="4" className="py-8 text-center text-gray-500">No users found in database.</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </motion.div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
