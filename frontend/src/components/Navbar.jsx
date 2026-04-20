import { useEffect, useState, useContext } from "react";
import { FiBell } from "react-icons/fi";
import { getNotifications, markNotificationsRead, demoLogin } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, login } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const userId = user?._id || localStorage.getItem("userId");
  const userName = user?.name || localStorage.getItem("userName") || "User";
  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll every 10 seconds for real-time feel
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleOpenDropdown = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      try {
        await markNotificationsRead(userId);
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between glass sticky top-0 z-50">
      <div className="md:hidden font-display font-bold text-2xl text-gradient">
        AlumNetX
      </div>
      <div className="hidden md:block text-gray-400">
        Welcome back, <span className="text-white font-semibold">{userName}</span>
      </div>

      <div className="flex items-center gap-6">

        {/* Fast Action Switcher */}
        <div className="hidden lg:flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mr-2">Switch:</span>
          <button onClick={async () => login((await demoLogin('admin')).data.token, (await demoLogin('admin')).data.user)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${user?.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-dark-800 text-gray-400 hover:text-white border-white/5 hover:border-white/20'}`}>Admin</button>
          <button onClick={async () => login((await demoLogin('student')).data.token, (await demoLogin('student')).data.user)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${user?.role === 'student' ? 'bg-primary-500/20 text-primary-400 border-primary-500/50' : 'bg-dark-800 text-gray-400 hover:text-white border-white/5 hover:border-white/20'}`}>Student</button>
          <button onClick={async () => login((await demoLogin('alumni')).data.token, (await demoLogin('alumni')).data.user)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${user?.role === 'alumni' ? 'bg-accent-500/20 text-accent-400 border-accent-500/50' : 'bg-dark-800 text-gray-400 hover:text-white border-white/5 hover:border-white/20'}`}>Alumni</button>
        </div>

        <div className="relative">
          <button
            onClick={handleOpenDropdown}
            className="p-2 rounded-full bg-dark-700/50 hover:bg-dark-600 transition-colors relative border border-white/10"
          >
            <FiBell size={22} className={unreadCount > 0 ? "text-accent-400 animate-pulse-slow" : "text-gray-400"} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-4 w-80 glass-strong rounded-2xl shadow-premium border border-white/10 py-2 overflow-hidden animate-fade-up">
              <h3 className="px-4 py-2 border-b border-white/10 font-bold text-sm text-gray-300">Notifications</h3>
              <div className="max-h-80 overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500">No new notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className={`p-4 border-b border-white/5 text-sm ${!n.isRead ? 'bg-primary-500/10' : ''}`}>
                      <p className={!n.isRead ? "text-white" : "text-gray-400"}>{n.message}</p>
                      <span className="text-xs text-primary-500 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold shadow-glow-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}