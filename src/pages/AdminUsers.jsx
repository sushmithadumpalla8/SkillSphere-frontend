import React, { useState, useEffect } from 'react';
import { getAllUsersAdmin, toggleUserActiveStatus, deleteUserAdmin } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAdmin();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const res = await toggleUserActiveStatus(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, active: res.data.active } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserAdmin(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesSearch = searchTerm ? (
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">User Management</h3>
        <p className="text-muted mb-0">View registered platform users, activate/deactivate accounts, or delete accounts.</p>
      </div>

      {/* Filter Bar */}
      <div className="card card-custom border-0 p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card card-custom border-0 p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td className="fw-semibold text-dark">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : u.role === 'INSTRUCTOR' ? 'bg-primary' : 'bg-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${u.active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {u.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="text-end">
                      {u.role !== 'ADMIN' && (
                        <>
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className={`btn btn-sm me-2 ${u.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
