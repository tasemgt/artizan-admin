// src/components/layout/TopNavbar.jsx
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// Derive a readable page title from the current path
function getTitle(pathname) {
  const map = {
    '/admin/dashboard':      'Dashboard',
    '/admin/users':          'Users',
    '/admin/artisans':       'Artisans',
    '/admin/communities':    'Communities',
    '/admin/requests':       'Service Requests',
    '/admin/wallets':        'Wallets',
    '/admin/fees':           'Fee Transactions',
    '/admin/xp':             'XP Management',
    '/admin/strikes':        'Cancellation Strikes',
    '/admin/categories':     'Categories',
    '/admin/notifications':  'Notifications',
    '/admin/settings':       'Platform Settings',
    '/community/gate-verify':'Gate Verification',
    '/community/artisans':   'Artisan Network',
    '/community/jobs':       'Job Activity',
    '/community/points':     'Points Ledger',
    '/community/profile':    'Community Profile',
  };
  return map[pathname] ?? 'Artizan Admin';
}

export default function TopNavbar() {
  const { pathname } = useLocation();
  const { user }     = useAuthStore();

  return (
    <div className="top-navbar">
      <span className="top-navbar-title">{getTitle(pathname)}</span>
      <div className="top-navbar-right">
        <span style={{ fontSize: 14, color: '#555' }}>
          {user?.name ?? user?.email}
        </span>
      </div>
    </div>
  );
}
