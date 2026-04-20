import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { getConversations, getMessages } from "../api";
import { io } from "socket.io-client";
import { FiSend, FiSearch, FiMessageSquare } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const socket = useRef();
  const scrollRef = useRef();

  // Initialize socket
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    
    if (user) {
      socket.current.emit("addUser", user._id);
    }

    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  const fetchConversations = async () => {
    try {
      setError(null);
      const res = await getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchChatMessages = async () => {
    try {
      const res = await getMessages(currentChat._id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentChat) {
      fetchChatMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const receiverId = currentChat.participants.find(p => p._id !== user._id)._id;

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      conversationId: currentChat._id
    });

    const localMsg = {
      sender: { _id: user._id, name: user.name },
      text: newMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, localMsg]);
    setNewMessage("");
    
    // Update sidebar last message locally
    setConversations(prev => prev.map(c => 
      c._id === currentChat._id ? { ...c, lastMessage: { text: newMessage } } : c
    ));
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans text-gray-100">
      <Sidebar role={user?.role} />
      
      <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full max-w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className={`w-full md:w-80 lg:w-96 glass-dark border-r border-white/5 flex flex-col h-full z-10 sm:border-t-0 border-t border-white/10 md:static absolute inset-y-0 left-0 transition-transform ${currentChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
          <div className="p-6 border-b border-white/5">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">Messages</h2>
            <div className="mt-4 relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-gray-200"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Loading chats...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400 text-sm">{error}</div>
            ) : conversations.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm">
                 No conversations yet. Connect with someone to start chatting!
               </div>
            ) : (
              conversations.map(c => {
                const friend = c.participants.find(p => p._id !== user._id);
                const isActive = currentChat?._id === c._id;
                const isOnline = onlineUsers.includes(friend?._id);
                
                return (
                  <motion.div 
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    key={c._id} 
                    onClick={() => setCurrentChat(c)}
                    className={`p-4 cursor-pointer flex items-center gap-4 border-b border-white/5 transition-all ${isActive ? 'bg-primary-500/10 border-l-4 border-l-primary-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        {friend?.name?.charAt(0) || "U"}
                      </div>
                      {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-semibold text-gray-200 truncate">{friend?.name || "Unknown User"}</h4>
                      <p className="text-sm text-gray-400 truncate">{c.lastMessage?.text || "New conversation started"}</p>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col h-full bg-black/20 backdrop-blur-sm relative z-10 w-full transition-transform ${!currentChat ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
          {currentChat ? (
            <>
              <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/5 backdrop-blur-md shadow-sm">
                <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setCurrentChat(null)}>
                  &larr; Back
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {currentChat.participants.find(p => p._id !== user._id)?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {currentChat.participants.find(p => p._id !== user._id)?.name || "Unknown User"}
                  </h3>
                  <p className="text-[10px] text-primary-400 uppercase tracking-widest font-bold">
                    {onlineUsers.includes(currentChat.participants.find(p => p._id !== user._id)?._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                <AnimatePresence>
                  {messages.map((m, i) => {
                    const isOwn = m.sender._id === user._id || m.sender === user._id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        key={m._id || i} 
                        ref={i === messages.length - 1 ? scrollRef : null}
                        className={`flex flex-col max-w-[75%] ${isOwn ? "self-end items-end" : "self-start items-start"}`}
                      >
                        <div 
                          className={`px-5 py-3 rounded-2xl shadow-lg ${
                            isOwn 
                            ? "bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-br-sm" 
                            : "bg-white/10 text-gray-100 rounded-bl-sm border border-white/5 backdrop-blur-md"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{m.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 px-1">
                          {format(new Date(m.createdAt || Date.now()), "p")}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex gap-3 relative max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-full py-3 px-6 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all font-medium"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="w-12 h-12 rounded-full min-w-[3rem] bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
                  >
                    <FiSend size={18} className="ml-1" />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10 w-full hidden md:flex">
              <div className="w-24 h-24 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <FiMessageSquare size={40} className="text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 font-display">AlumNetX Chat</h2>
              <p className="text-gray-400 max-w-md">
                Select a conversation to start networking, discussing opportunities, and sharing insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
