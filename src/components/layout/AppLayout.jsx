// src/components/layout/AppLayout.jsx
// Port of FLC AppLayout — Sidebar + TopNavbar + scrollable content area.

import { Outlet } from 'react-router-dom';
import Sidebar    from './Sidebar';
import TopNavbar  from './TopNavbar';

export default function AppLayout() {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <TopNavbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
