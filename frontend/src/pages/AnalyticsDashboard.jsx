import React from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiUsers } from 'react-icons/fi';

const skillData = [
  { name: 'Jan', React: 40, Python: 24, Design: 24 },
  { name: 'Feb', React: 30, Python: 13, Design: 22 },
  { name: 'Mar', React: 20, Python: 38, Design: 22 },
  { name: 'Apr', React: 27, Python: 39, Design: 20 },
  { name: 'May', React: 18, Python: 48, Design: 21 },
  { name: 'Jun', React: 23, Python: 38, Design: 25 },
  { name: 'Jul', React: 34, Python: 43, Design: 21 },
];

const companyData = [
  { name: 'Google', Placements: 4000 },
  { name: 'Microsoft', Placements: 3000 },
  { name: 'Amazon', Placements: 2000 },
  { name: 'Meta', Placements: 2780 },
  { name: 'Apple', Placements: 1890 },
];

export default function AnalyticsDashboard() {
  const role = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "student";

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white font-sans">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 mix-blend-overlay pointer-events-none"></div>
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <motion.div initial="hidden" animate="visible" variants={containerVars} className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
              <div>
                 <h1 className="text-4xl font-display font-bold">Network <span className="text-gradient">Analytics</span></h1>
                 <p className="text-gray-400 mt-2">Macro-level intelligence on AlumNetX trends.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-strong rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 <h3 className="text-gray-400 mb-2 font-medium flex items-center gap-2"><FiActivity/> Network Traffic</h3>
                 <p className="text-4xl font-display font-bold text-white shadow-glow-sm">1.4M</p>
                 <span className="text-green-400 text-sm font-bold mt-2 inline-block">+12% from last month</span>
              </div>
              <div className="glass-strong rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-accent-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 <h3 className="text-gray-400 mb-2 font-medium flex items-center gap-2"><FiUsers/> Mentorship Pairs</h3>
                 <p className="text-4xl font-display font-bold text-white shadow-glow-sm">8,204</p>
                 <span className="text-green-400 text-sm font-bold mt-2 inline-block">+5% from last month</span>
              </div>
              <div className="glass-strong rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 <h3 className="text-gray-400 mb-2 font-medium flex items-center gap-2"><FiTrendingUp/> Job Placements</h3>
                 <p className="text-4xl font-display font-bold text-white shadow-glow-sm">1,402</p>
                 <span className="text-green-400 text-sm font-bold mt-2 inline-block">+34% from last month</span>
              </div>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <motion.div variants={itemVars} className="glass-strong rounded-3xl p-8 border border-white/5">
                 <h2 className="text-xl font-bold mb-6 font-display">In-Demand Skills Trends</h2>
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={skillData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorReact" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPython" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="React" stroke="#6366f1" fillOpacity={1} fill="url(#colorReact)" />
                        <Area type="monotone" dataKey="Python" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPython)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </motion.div>

               <motion.div variants={itemVars} className="glass-strong rounded-3xl p-8 border border-white/5">
                 <h2 className="text-xl font-bold mb-6 font-display">Top Alumni Destinations</h2>
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={companyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                        <Bar dataKey="Placements" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               </motion.div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
