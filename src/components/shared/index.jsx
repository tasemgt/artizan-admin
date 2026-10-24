// src/components/shared/index.jsx
// Shared UI components — port and extension of FLC shared components.

import { Link } from 'react-router-dom';

// ── Spinner ───────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}

// ── StatCard (KPI tile) ───────────────────────────────────────────────
// Port of FLC StatCard — used on dashboard overview pages.
export function StatCard({ color = 'primary', icon, category, value, footerIcon, footerText, footerLink, loading }) {
  return (
    <div className="card card-stats-wrap">
      <div style={{ padding: '0 15px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div className={`card-icon card-header-${color}`} style={{ margin: '-20px 0 0 15px' }}>
            <span className="material-icons">{icon}</span>
          </div>
          <div style={{ textAlign: 'right', padding: '10px 10px 0' }}>
            <p className="card-category">{category}</p>
            <h3 className="card-title-lg">
              {loading ? <span style={{ fontSize: 16, color: '#ccc' }}>…</span> : (value ?? 0)}
            </h3>
          </div>
        </div>
      </div>
      <div className="card-footer">
        {footerIcon && <span className="material-icons">{footerIcon}</span>}
        {footerLink
          ? <Link to={footerLink}>{footerText}</Link>
          : <span>{footerText}</span>
        }
      </div>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────
const STATUS_CLASS = {
  PENDING:           'badge-pending',
  ARTISAN_ACCEPTED:  'badge-active',
  ARTISAN_ARRIVED:   'badge-arrived',
  ARTISAN_COMPLETED: 'badge-primary',
  USER_COMPLETED:    'badge-primary',
  COMPLETED:         'badge-completed',
  USER_CANCELLED:    'badge-cancelled',
  ARTISAN_CANCELLED: 'badge-cancelled',
  ARTISAN_REJECTED:  'badge-cancelled',
  ACTIVE:            'badge-approved',
  APPROVED:          'badge-approved',
  REJECTED:          'badge-rejected',
  SUCCESS:           'badge-completed',
  FAILED:            'badge-cancelled',
};

export function StatusBadge({ status }) {
  const cls = STATUS_CLASS[status] ?? 'badge-primary';
  const label = status?.replace(/_/g, ' ') ?? '—';
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ── PageHeader ────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h4 style={{ margin: 0, color: '#3c4858', fontWeight: 400, fontSize: 20 }}>{title}</h4>
        {subtitle && <p style={{ margin: '4px 0 0', color: '#999', fontSize: 13 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────
export function EmptyState({ icon = 'inbox', message = 'No data found.' }) {
  return (
    <div className="empty-state">
      <span className="material-icons">{icon}</span>
      <p>{message}</p>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ‹
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            className={`page-btn${page === p ? ' active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        );
      })}
      <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        ›
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer, width }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={width ? { maxWidth: width } : undefined} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>{title}</h4>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── MiniTable (dashboard recent activity) ────────────────────────────
export function MiniTable({ title, color = 'primary', rows, emptyMsg = 'No recent activity.' }) {
  return (
    <div className="card">
      <div className={`card-header-${color}`} style={{ margin: 0, borderRadius: '6px 6px 0 0', padding: '14px 20px' }}>
        <h4 className="card-title-white" style={{ fontSize: 15 }}>{title}</h4>
      </div>
      <div className="card-body" style={{ padding: '8px 0' }}>
        {!rows?.length ? (
          <p style={{ color: '#aaa', fontSize: 13, padding: '16px 20px', margin: 0 }}>{emptyMsg}</p>
        ) : rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}
