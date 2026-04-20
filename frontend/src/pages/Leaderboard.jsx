import { useEffect, useState } from "react";
import { getLeaderboard } from "../api";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { FiBriefcase, FiMessageSquare, FiVideo } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard();
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  const getTrophyColor = (index) => {
    switch(index) {
      case 0: return "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"; // Gold
      case 1: return "text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.8)]"; // Silver
      case 2: return "text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]"; // Bronze
      default: return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 animate-fade-in max-w-6xl mx-auto">
      <div className="mb-10 text-center relative z-10 block">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-md">
          Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Leaderboard</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Honoring our most active alumni who are shaping the future of students through mentorship, opportunities, and endless support.
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-white/5">
          <p className="text-gray-400">No alumni data available yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative z-10">
          
          {/* Top 3 Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
            {/* Rank 2 */}
            {leaderboard[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-dark border border-gray-300/30 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden order-2 md:order-1 h-[90%]"
              >
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <FaMedal className={`text-5xl mb-4 ${getTrophyColor(1)}`} />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-500 to-gray-300 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg border-2 border-dark-900">
                  {leaderboard[1].name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white">{leaderboard[1].name}</h3>
                <p className="text-gray-400 text-sm mb-4">{leaderboard[1].profession} @ {leaderboard[1].company}</p>
                <div className="bg-white/5 py-2 px-6 rounded-full font-bold text-gray-200 shadow-inner">
                  {leaderboard[1].score} PTR
                </div>
              </motion.div>
            )}

            {/* Rank 1 */}
            {leaderboard[0] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5 }}
                className="glass-strong border-2 border-yellow-400/50 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_40px_rgba(250,204,21,0.15)] relative overflow-hidden order-1 md:order-2"
              >
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                <FaTrophy className={`text-6xl mb-4 ${getTrophyColor(0)}`} />
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-[0_0_20px_rgba(250,204,21,0.4)] border-4 border-dark-900">
                  {leaderboard[0].name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-white">{leaderboard[0].name}</h3>
                <p className="text-gray-400 text-sm mb-6">{leaderboard[0].profession} @ {leaderboard[0].company}</p>
                <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 py-3 px-8 rounded-full font-bold text-yellow-400 text-lg shadow-inner border border-yellow-500/30">
                  {leaderboard[0].score} PTR
                </div>
              </motion.div>
            )}

            {/* Rank 3 */}
            {leaderboard[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-dark border border-amber-600/30 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden order-3 h-[85%]"
              >
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700"></div>
                <FaMedal className={`text-4xl mb-4 ${getTrophyColor(2)}`} />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg border-2 border-dark-900">
                  {leaderboard[2].name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-white">{leaderboard[2].name}</h3>
                <p className="text-gray-400 text-sm mb-4">{leaderboard[2].profession} @ {leaderboard[2].company}</p>
                <div className="bg-white/5 py-1.5 px-5 rounded-full font-bold text-amber-500 shadow-inner text-sm">
                  {leaderboard[2].score} PTR
                </div>
              </motion.div>
            )}
          </div>

          {/* The Rest of the List */}
          {leaderboard.slice(3).length > 0 && (
            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="py-5 px-6 font-medium">Rank</th>
                      <th className="py-5 px-6 font-medium">Alumni</th>
                      <th className="py-5 px-6 font-medium hidden md:table-cell">Contributions</th>
                      <th className="py-5 px-6 font-medium text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.slice(3).map((alumni, i) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * i }}
                        key={alumni._id} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-4 px-6 font-bold text-gray-500 group-hover:text-white transition-colors">
                          #{i + 4}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-dark-700 flex flex-shrink-0 items-center justify-center text-white font-bold border border-white/10 group-hover:border-primary-500/50 transition-colors">
                              {alumni.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{alumni.name}</p>
                              <p className="text-xs text-gray-500">{alumni.profession} @ {alumni.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5 tooltip-trigger relative group/tip cursor-default" title="Jobs Posted">
                              <FiBriefcase className="text-primary-400" /> {alumni.stats.jobsPosted}
                            </div>
                            <div className="flex items-center gap-1.5 tooltip-trigger relative group/tip cursor-default" title="Mentorship Sessions">
                              <FiVideo className="text-accent-400" /> {alumni.stats.sessions}
                            </div>
                            <div className="flex items-center gap-1.5 tooltip-trigger relative group/tip cursor-default" title="Messages & Requests">
                              <FiMessageSquare className="text-green-400" /> {alumni.stats.messages}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-primary-300">
                          {alumni.score}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}
