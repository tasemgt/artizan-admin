// src/pages/superadmin/Placeholder.jsx
// Stub for remaining Super Admin sections - deferred for v1 (see CLAUDE.md).
// Users/Artisans/Categories moved to their own real page files.
export function AdminCommunities()   { return <PlaceholderPage title="Communities"          phase={9} />; }
export function AdminRequests()      { return <PlaceholderPage title="Service Requests"     phase={9} />; }
export function AdminWallets()       { return <PlaceholderPage title="Wallets"              phase={9} />; }
export function AdminFees()          { return <PlaceholderPage title="Fee Transactions"     phase={9} />; }
export function AdminXP()            { return <PlaceholderPage title="XP Management"        phase={9} />; }
export function AdminStrikes()       { return <PlaceholderPage title="Cancellation Strikes" phase={9} />; }
export function AdminNotifications() { return <PlaceholderPage title="Notifications"        phase={9} />; }
export function AdminSettings()      { return <PlaceholderPage title="Platform Settings"    phase={9} />; }

// Community stubs — built in Phase 8
export function CommunityArtisans()  { return <PlaceholderPage title="Artisan Network"     phase={8} />; }
export function CommunityJobs()      { return <PlaceholderPage title="Job Activity"         phase={8} />; }
export function CommunityPoints()    { return <PlaceholderPage title="Points Ledger"        phase={8} />; }
export function CommunityProfile()   { return <PlaceholderPage title="Community Profile"    phase={8} />; }

function PlaceholderPage({ title, phase }) {
  return (
    <div>
      <div className="card">
        <div className="card-header-primary" style={{ margin: 0, borderRadius: '6px 6px 0 0', padding: '16px 20px' }}>
          <h4 className="card-title-white">{title}</h4>
          <p className="card-subtitle-white">Phase {phase} — coming soon</p>
        </div>
        <div className="card-body" style={{ textAlign: 'center', padding: '60px 40px', color: '#bbb' }}>
          <span className="material-icons" style={{ fontSize: 64 }}>construction</span>
          <p style={{ marginTop: 12 }}>
            This section will be built in Phase {phase}. The routing and navigation are already wired — implementation coming next.
          </p>
        </div>
      </div>
    </div>
  );
}
