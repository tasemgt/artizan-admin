// src/pages/superadmin/AdminCategories.jsx
// Real category CRUD - GET (public, ?includeInactive=true for this screen),
// POST/PATCH/DELETE (admin-only). DELETE soft-deletes (isActive=false);
// re-enabling is a PATCH, not a separate endpoint.

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { PageHeader, Spinner, EmptyState, Modal } from '../../components/shared';

const EMPTY_FORM = { name: '', icon: '', sortOrder: 0 };

function CategoryFormModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(initial ? { name: initial.name, icon: initial.icon ?? '', sortOrder: initial.sortOrder ?? 0 } : EMPTY_FORM);
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { name: form.name.trim(), icon: form.icon.trim() || null, sortOrder: Number(form.sortOrder) || 0 };
      return isEdit
        ? axiosClient.patch(`/categories/${initial.id}`, payload)
        : axiosClient.post('/categories', payload);
    },
    onSuccess: onSaved,
    onError: (err) => setError(err.response?.data?.error?.message ?? 'Could not save category.'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  };

  return (
    <Modal title={isEdit ? 'Edit Category' : 'Add Category'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Icon key</label>
          <input
            className="form-control"
            placeholder="e.g. tailor, plumber"
            value={form.icon}
            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Sort order</label>
          <input
            className="form-control"
            type="number"
            value={form.sortOrder}
            onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);   // null | {} (add) | category (edit)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await axiosClient.get('/categories', { params: { includeInactive: 'true' } })).data.data,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      isActive
        ? axiosClient.delete(`/categories/${id}`)
        : axiosClient.patch(`/categories/${id}`, { isActive: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const categories = data ?? [];

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Trade categories shown in the artisan picker and the user home grid"
        action={<button className="btn btn-primary" onClick={() => setEditing({})}>+ Add Category</button>}
      />

      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <EmptyState icon="error_outline" message="Could not load categories." />
          ) : categories.length === 0 ? (
            <EmptyState icon="grid_view" message="No categories yet." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Icon key</th>
                    <th>Sort order</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} style={{ opacity: cat.isActive ? 1 : 0.5 }}>
                      <td>{cat.name}</td>
                      <td>{cat.icon ?? '—'}</td>
                      <td>{cat.sortOrder}</td>
                      <td>
                        <span className={`badge ${cat.isActive ? 'badge-approved' : 'badge-cancelled'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm btn-outline" onClick={() => setEditing(cat)}>Edit</button>
                        <button
                          className={`btn btn-sm ${cat.isActive ? 'btn-danger' : 'btn-success'}`}
                          disabled={toggleActiveMutation.isPending}
                          onClick={() => toggleActiveMutation.mutate({ id: cat.id, isActive: cat.isActive })}
                        >
                          {cat.isActive ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing !== null && (
        <CategoryFormModal initial={editing.id ? editing : null} onClose={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
