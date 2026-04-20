import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getOpportunities } from "../api";
import { FiBriefcase, FiExternalLink, FiSearch, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function OpportunityBoard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "student";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("All");

  useEffect(() => {
    getOpportunities().then(res => {
      setOpportunities(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const domains = ["All", ...new Set(opportunities.map(o => o.domain).filter(Boolean))];

  const filteredData = opportunities.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDomain === "All" || o.domain === filterDomain)
  );

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
            
            <motion.header variants={itemVars} className="glass-strong border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-dark-800 to-dark-900">
               <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
                 <div>
                    <h1 className="text-4xl font-display font-bold flex items-center gap-3"><FiBriefcase className="text-blue-500"/> Opportunity Vault</h1>
                    <p className="text-gray-400 mt-2">Exclusive internships and jobs posted by the AlumNetX network.</p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                       <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input type="text" placeholder="Search titles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-glass pl-10" />
                    </div>
                    <div className="relative w-full sm:w-48">
                       <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)} className="input-glass pl-10 appearance-none [&>option]:bg-dark-900">
                         {domains.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                 </div>
               </div>
               <div className="absolute right-0 top-0 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
            </motion.header>

            {loading ? (
               <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredData.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-12 text-gray-500 glass-strong rounded-3xl border border-white/5">
                      No opportunities match your search.
                    </motion.div>
                  ) : (
                    filteredData.map(o => (
                      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={o._id} className="glass-strong card-hover rounded-3xl p-6 border border-white/5 flex flex-col justify-between group">
                         <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${o.type === 'job' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                                {o.type}
                              </span>
                              {o.domain && <span className="text-xs font-medium text-gray-500 bg-dark-800 px-2 py-1 rounded">{o.domain}</span>}
                            </div>
                            <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{o.title}</h3>
                            <p className="text-gray-400 font-medium mb-4">{o.company}</p>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">{o.description}</p>
                         </div>
                         
                         <a href={o.link} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-dark-800 hover:bg-blue-600 text-white border border-white/10 py-3 rounded-xl transition duration-300 shadow-sm hover:shadow-glow-sm font-bold text-sm group-hover:border-blue-500/50">
                            Apply Now <FiExternalLink />
                         </a>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
