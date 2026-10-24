// src/pages/superadmin/AdminUsers.jsx
// Real user list - GET /users (admin-only, paginated, searchable).

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { PageHeader, Spinner, EmptyState, Pagination } from '../../components/shared';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const { data } = await axiosClient.get('/users', { params: { page, limit: 20, search: search || undefined } });
      return data;
    },
    placeholderData: (prev) => prev,
  });

  const users = data?.data ?? [];
  const meta  = data?.meta;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Everyone registered on the platform" />

      <div className="card">
        <div className="card-body">
          <form className="filter-bar" onSubmit={handleSearchSubmit}>
            <input
              className="form-control"
              type="text"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-outline">Search</button>
          </form>

          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <EmptyState icon="error_outline" message="Could not load users." />
          ) : users.length === 0 ? (
            <EmptyState icon="people" message="No users found." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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
    </div>
  );
}
