// src/pages/superadmin/AdminDashboard.jsx
// Platform overview dashboard - v1, real data only. The original draft of
// this screen also showed Active Requests / Fees Today KPIs and a Recent
// Service Requests table, but ServiceRequest/fee capture aren't real yet
// (still client-simulated in the mobile app per CLAUDE.md) and
// /admin/analytics/fees never existed - rather than ship permanently-404ing
// calls and a KPI tile that's quietly wrong (it was reading
// data.length from a limit=5 fetch, not an actual count), those were
// dropped for v1. Pending Verifications replaces them since it's real and
// actionable (links straight to the Artisans review queue).

import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { StatCard } from '../../components/shared';

function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await axiosClient.get('/admin/analytics/overview')).data.data,
    staleTime: 30000,
  });
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div>
      <div className="row">
        <div className="col-4">
          <StatCard loading={isLoading} color="primary" icon="people"
            category="Total Users"     value={stats?.totalUsers}
            footerIcon="arrow_forward" footerText="View all users"   footerLink="/admin/users" />
        </div>
        <div className="col-4">
          <StatCard loading={isLoading} color="info" icon="construction"
            category="Total Artisans"  value={stats?.totalArtisans}
            footerIcon="arrow_forward" footerText="View artisans"    footerLink="/admin/artisans" />
        </div>
        <div className="col-4">
          <StatCard loading={isLoading} color="warning" icon="fact_check"
            category="Pending Verifications" value={stats?.pendingVerifications}
            footerIcon="arrow_forward" footerText="Review queue"     footerLink="/admin/artisans" />
        </div>
      </div>
    </div>
  );
}
