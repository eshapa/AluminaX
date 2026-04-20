import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const demoLogin = (role) => api.get(`/auth/demo/${role}`);
export const getProfile = (id) => api.get(`/auth/profile/${id}`);
export const updateProfile = (id, data) => api.post(`/auth/update-profile/${id}`, data);

// Match
export const getMatches = (studentId, params) => api.get(`/match/${studentId}`, { params });

// Request
export const sendRequest = (data) => api.post('/request/send', data);
export const getAlumniRequests = (alumniId) => api.get(`/request/${alumniId}`);
export const getStudentRequests = (studentId) => api.get(`/request/student/${studentId}`);
export const updateRequestStatus = (id, status) => api.post(`/request/update/${id}`, { status });

// Opportunity
export const createOpportunity = (data) => api.post('/opportunity/create', data);
export const getOpportunities = (params) => api.get('/opportunity', { params });

// Session
export const scheduleSession = (data) => api.post('/session/schedule', data);
export const getSessions = (userId) => api.get(`/session/${userId}`);

// Notification
export const getNotifications = (userId) => api.get(`/notification/${userId}`);
export const markNotificationsRead = (userId) => api.post(`/notification/mark-read/${userId}`);

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');

// Chat
export const getConversations = () => api.get('/chat/conversations');
export const getMessages = (convoId) => api.get(`/chat/messages/${convoId}`);
export const sendMessage = (data) => api.post('/chat/message', data);

export default api;
