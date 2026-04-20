import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user.profileCompleted && location.pathname !== '/setup-profile' && user.role !== 'admin') {
    return <Navigate to="/setup-profile" replace />;
  }

  // Not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or to a generic unauthorized page
  }

  // Authorized
  return children;
}
