import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiHome, FiUser, FiBriefcase, FiLogOut, FiActivity, FiStar } from "react-icons/fi";

export default function Sidebar({ role }) {
  const nav = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: "Dashboard", path: role === "student" ? "/student" : "/alumni", icon: <FiHome size={20} /> },
    { name: "Opportunities", path: "/opportunities", icon: <FiBriefcase size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <FiActivity size={20} /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <FiStar size={20} /> },
    { name: "Profile", path: role === "student" ? "/student-profile" : "/alumni-profile", icon: <FiUser size={20} /> }
  ];

  return (
    <div className="w-64 glass-dark border-r border-white/10 hidden md:flex flex-col relative z-20">
      <div className="p-8">
        <h2 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400 tracking-tight">
          AlumNet<span className="text-white">X</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => nav(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium ${
                active 
                  ? "bg-primary-500/20 text-primary-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] border border-primary-500/30" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mb-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}