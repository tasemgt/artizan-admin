// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout    from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login        from './pages/public/Login';

// Super Admin pages
import AdminDashboard  from './pages/superadmin/AdminDashboard';
import AdminUsers      from './pages/superadmin/AdminUsers';
import AdminArtisans   from './pages/superadmin/AdminArtisans';
import AdminCategories from './pages/superadmin/AdminCategories';
import AdminSecurity   from './pages/superadmin/AdminSecurity';
import {
  AdminCommunities, AdminRequests,
  AdminWallets, AdminFees, AdminXP, AdminStrikes,
  AdminNotifications, AdminSettings,
} from './pages/superadmin/Placeholder';

// Community pages
import GateVerify from './pages/community/GateVerify';
import {
  CommunityArtisans, CommunityJobs, CommunityPoints, CommunityProfile,
} from './pages/superadmin/Placeholder';

import useAuthStore from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

// Smart root redirect based on role
function RootRedirect() {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/community/gate-verify" replace />;
}

const SUPER_ADMIN        = ['super_admin'];
const COMMUNITY_STAFF    = ['community_admin', 'community_security'];
const COMMUNITY_ADMIN    = ['community_admin'];

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/"      element={<RootRedirect />} />

          {/* ── Super Admin ──────────────────────────────── */}
          <Route element={
            <ProtectedRoute allowedRoles={SUPER_ADMIN}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard"    element={<AdminDashboard />} />
            <Route path="/admin/users"        element={<AdminUsers />} />
            <Route path="/admin/artisans"     element={<AdminArtisans />} />
            <Route path="/admin/communities"  element={<AdminCommunities />} />
            <Route path="/admin/communities/new" element={<AdminCommunities />} />
            <Route path="/admin/requests"     element={<AdminRequests />} />
            <Route path="/admin/wallets"      element={<AdminWallets />} />
            <Route path="/admin/fees"         element={<AdminFees />} />
            <Route path="/admin/xp"           element={<AdminXP />} />
            <Route path="/admin/strikes"      element={<AdminStrikes />} />
            <Route path="/admin/categories"   element={<AdminCategories />} />
            <Route path="/admin/notifications"element={<AdminNotifications />} />
            <Route path="/admin/settings"     element={<AdminSettings />} />
            <Route path="/admin/security"     element={<AdminSecurity />} />
          </Route>

          {/* ── Community Dashboard (Admin + Security) ───── */}
          <Route element={
            <ProtectedRoute allowedRoles={COMMUNITY_STAFF}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/community/gate-verify" element={<GateVerify />} />
          </Route>

          {/* ── Community Dashboard (Admin only) ─────────── */}
          <Route element={
            <ProtectedRoute allowedRoles={COMMUNITY_ADMIN}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/community/artisans" element={<CommunityArtisans />} />
            <Route path="/community/jobs"     element={<CommunityJobs />} />
            <Route path="/community/points"   element={<CommunityPoints />} />
            <Route path="/community/profile"  element={<CommunityProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
