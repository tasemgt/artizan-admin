// src/routes/ProtectedRoute.jsx
// Port of FLC ProtectedRoute — guards routes by role.

import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their correct home
    const homeMap = {
      super_admin:        '/admin/dashboard',
      community_admin:    '/community/gate-verify',
      community_security: '/community/gate-verify',
    };
    return <Navigate to={homeMap[user.role] ?? '/login'} replace />;
  }

  return children;
}
