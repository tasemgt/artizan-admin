// src/components/layout/Sidebar.jsx
// Port of FLC Sidebar — role-based nav trees for Artizan admin roles.
// Roles: super_admin (full platform) | community_admin (community mgmt) | community_security (gate only)

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

function Logo() {
  return (
    <NavLink to="/" className="sidebar-logo">
      <span style={{ fontSize: 24, color: '#fff' }}>🔧</span>
      <span className="sidebar-logo-text">Artizan</span>
    </NavLink>
  );
}

function NavCollapse({ icon, label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button className="nav-item-link" onClick={() => setOpen(o => !o)}>
        <span className="material-icons">{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        <span className={`material-icons nav-collapse-icon${open ? ' open' : ''}`}>
          keyboard_arrow_down
        </span>
      </button>
      {open && <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{children}</ul>}
    </li>
  );
}

function SubLink({ to, label }) {
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => `nav-sub-item${isActive ? ' active' : ''}`}>
        {label}
      </NavLink>
    </li>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`}>
        <span className="material-icons">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

// ── Role-based nav trees ──────────────────────────────────────────────

function SuperAdminNav() {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <NavItem to="/admin/dashboard"       icon="dashboard"      label="Dashboard" />
      <NavCollapse icon="people"           label="Users">
        <SubLink to="/admin/users"         label="All Users" />
      </NavCollapse>
      <NavCollapse icon="construction"     label="Artisans">
        <SubLink to="/admin/artisans"      label="All Artisans" />
      </NavCollapse>
      <NavCollapse icon="apartment"        label="Communities">
        <SubLink to="/admin/communities"   label="All Communities" />
        <SubLink to="/admin/communities/new" label="Add Community" />
      </NavCollapse>
      <NavItem to="/admin/requests"        icon="receipt_long"   label="Service Requests" />
      <NavCollapse icon="account_balance_wallet" label="Wallets & Fees">
        <SubLink to="/admin/wallets"       label="All Wallets" />
        <SubLink to="/admin/fees"          label="Fee Transactions" />
      </NavCollapse>
      <NavItem to="/admin/xp"              icon="star"           label="XP Management" />
      <NavItem to="/admin/strikes"         icon="warning"        label="Cancellation Strikes" />
      <NavItem to="/admin/categories"      icon="grid_view"      label="Categories" />
      <NavItem to="/admin/notifications"   icon="notifications"  label="Notifications" />
      <NavItem to="/admin/settings"        icon="settings"       label="Platform Settings" />
    </ul>
  );
}

function CommunityAdminNav() {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <NavItem to="/community/gate-verify"  icon="verified_user"   label="Gate Verify" />
      <NavItem to="/community/artisans"     icon="construction"    label="Artisan Network" />
      <NavItem to="/community/jobs"         icon="receipt_long"    label="Job Activity" />
      <NavItem to="/community/points"       icon="star"            label="Points Ledger" />
      <NavItem to="/community/profile"      icon="apartment"       label="Community Profile" />
    </ul>
  );
}

function CommunitySecurityNav() {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <NavItem to="/community/gate-verify" icon="verified_user" label="Gate Verify" />
    </ul>
  );
}

// ── Sidebar component ─────────────────────────────────────────────────
export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = `${user.name?.[0] ?? user.email?.[0] ?? 'A'}`.toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <Logo />

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initials}</div>
        <div>
          <div className="sidebar-user-name">{user.name ?? user.email}</div>
          <div className="sidebar-user-role">{user.role?.replace('_', ' ')}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user.role === 'super_admin'          && <SuperAdminNav />}
        {user.role === 'community_admin'      && <CommunityAdminNav />}
        {user.role === 'community_security'   && <CommunitySecurityNav />}
      </nav>

      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <button className="nav-item-link" onClick={handleLogout} style={{ width: '100%' }}>
          <span className="material-icons">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
