import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import SuccessStories from "./pages/SuccessStories";
import RoleSelection from "./pages/RoleSelection";
import AuthEntry from "./pages/AuthEntry";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Dashboard Pages
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import AlumniProfile from "./pages/AlumniProfile";
import ProfileSetup from "./pages/ProfileSetup";
import ExploreAlumni from "./pages/ExploreAlumni";
import OpportunityBoard from "./pages/OpportunityBoard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/stories" element={<SuccessStories />} />
          
          {/* Onboarding & Auth Routes */}
          <Route path="/roles" element={<RoleSelection />} />
          
          {/* Unified Auth Route */}
          <Route path="/auth/login" element={<AuthEntry />} />
          <Route path="/auth/student" element={<AuthEntry />} />
          <Route path="/auth/alumni" element={<AuthEntry />} />
          <Route path="/auth/admin" element={<AuthEntry />} />
          
          {/* Backward Compatibility mappings */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/roles" replace />} />

          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route path="/setup-profile" element={<ProtectedRoute allowedRoles={['student', 'alumni']}><ProfileSetup /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute allowedRoles={['student']}><ExploreAlumni /></ProtectedRoute>} />
          
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/alumni" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="/student-profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
          <Route path="/alumni-profile" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniProfile /></ProtectedRoute>} />
          
          <Route path="/opportunities" element={<ProtectedRoute allowedRoles={['student', 'alumni', 'admin']}><OpportunityBoard /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute allowedRoles={['student', 'alumni', 'admin']}><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['student', 'alumni', 'admin']}><Leaderboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;