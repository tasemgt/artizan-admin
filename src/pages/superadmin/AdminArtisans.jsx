// src/pages/superadmin/AdminArtisans.jsx
// Real artisan list + verification review - GET /artisans (admin-only),
// GET /artisans/:id (incl. uploaded ArtisanDocuments), PATCH
// /artisans/:id/verification (approve/reject). Closes the "nothing reads
// ArtisanDocument rows yet" gap noted in CLAUDE.md.

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { PageHeader, Spinner, EmptyState, Pagination, StatusBadge, Modal } from '../../components/shared';

function VerificationModal({ artisanId, onClose }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-artisan-detail', artisanId],
    queryFn: async () => (await axiosClient.get(`/artisans/${artisanId}`)).data.data,
  });

  const verifyMutation = useMutation({
    mutationFn: (status) => axiosClient.patch(`/artisans/${artisanId}/verification`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artisans'] });
      onClose();
    },
  });

  return (
    <Modal title="Artisan Verification" onClose={onClose} width={560}>
      {isLoading || !data ? (
        <Spinner />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            {data.profileImageUrl ? (
              <img src={data.profileImageUrl} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-faded)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons" style={{ color: 'var(--color-primary)' }}>construction</span>
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{data.firstName} {data.lastName}</div>
              <div style={{ color: '#999', fontSize: 13 }}>{data.email} · {data.phoneNumber}</div>
              <div style={{ marginTop: 4 }}><StatusBadge status={data.verificationStatus} /></div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            <strong>Category:</strong> {data.category?.name ?? '—'}<br />
            <strong>Username:</strong> {data.username}
          </div>

          <div className="form-label" style={{ marginBottom: 8 }}>Uploaded Documents ({data.documents?.length ?? 0})</div>
          {!data.documents?.length ? (
            <p style={{ color: '#aaa', fontSize: 13 }}>No documents were uploaded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {data.documents.map(doc => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  <span className="material-icons" style={{ fontSize: 18 }}>
                    {doc.fileType === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                  </span>
                  {doc.fileName ?? 'Document'}
                </a>
              ))}
            </div>
          )}

          {verifyMutation.isError && (
            <div className="alert alert-danger" style={{ marginTop: 12 }}>
              Could not update verification status. Try again.
            </div>
          )}
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
        <button
          className="btn btn-danger"
          disabled={verifyMutation.isPending || isLoading}
          onClick={() => verifyMutation.mutate('REJECTED')}
        >
          Reject
        </button>
        <button
          className="btn btn-primary"
          disabled={verifyMutation.isPending || isLoading}
          onClick={() => verifyMutation.mutate('APPROVED')}
        >
          Approve
        </button>
      </div>
    </Modal>
  );
}

export default function AdminArtisans() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewingId, setReviewingId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-artisans', page, search, statusFilter],
    queryFn: async () => {
      const { data } = await axiosClient.get('/artisans', {
        params: { page, limit: 20, search: search || undefined, verificationStatus: statusFilter || undefined },
      });
      return data;
    },
    placeholderData: (prev) => prev,
  });

  const artisans = data?.data ?? [];
  const meta = data?.meta;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div>
      <PageHeader title="Artisans" subtitle="All registered artisans and their verification status" />

      <div className="card">
        <div className="card-body">
          <form className="filter-bar" onSubmit={handleSearchSubmit}>
            <input
              className="form-control"
              type="text"
              placeholder="Search by name, email, or username…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <select
              className="form-control"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button type="submit" className="btn btn-outline">Search</button>
          </form>

          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <EmptyState icon="error_outline" message="Could not load artisans." />
          ) : artisans.length === 0 ? (
            <EmptyState icon="construction" message="No artisans found." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Email</th>
                    <th>Verification</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {artisans.map(a => (
                    <tr key={a.id}>
                      <td>{a.firstName} {a.lastName}</td>
                      <td>{a.category?.name ?? '—'}</td>
                      <td>{a.email}</td>
                      <td><StatusBadge status={a.verificationStatus} /></td>
                      <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => setReviewingId(a.id)}>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta && (
            <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>

      {reviewingId && (
        <VerificationModal artisanId={reviewingId} onClose={() => setReviewingId(null)} />
      )}
    </div>
  );
}
