// src/pages/superadmin/AdminSecurity.jsx
// Self-service "change my password" - PATCH /auth/admin/change-password.
// Not in the main Sidebar nav (that's platform-management sections); reached
// via the admin's own name in TopNavbar, same "my account" convention as
// most admin dashboards use.

import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { PageHeader, PasswordInput } from '../../components/shared';

export default function AdminSecurity() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: null, message: null });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: null });

    if (newPassword.length < 8) {
      setStatus({ type: 'danger', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'danger', message: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      await axiosClient.patch('/auth/admin/change-password', { currentPassword, newPassword });
      setStatus({ type: 'success', message: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus({ type: 'danger', message: err.response?.data?.error?.message ?? 'Could not change password.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Security" subtitle="Change your admin account password" />

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-body">
          {status.type && (
            <div className={`alert alert-${status.type}`}>{status.message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <PasswordInput
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <PasswordInput
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 28 }}>
              <label className="form-label">Confirm New Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
