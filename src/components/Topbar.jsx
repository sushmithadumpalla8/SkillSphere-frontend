import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Topbar = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="dashboard-topbar">
      <div className="d-flex align-items-center gap-3">
        <h4 className="mb-0 font-heading fw-bold text-dark">{title}</h4>
      </div>

      <div className="d-flex align-items-center gap-3">
        <Link to="/courses" className="btn btn-sm btn-light border rounded-pill px-3 d-none d-md-inline-flex align-items-center gap-2">
          <i className="bi bi-compass text-primary"></i> Browse Catalog
        </Link>

        <div className="dropdown">
          <button className="btn btn-light rounded-pill p-1 pe-3 d-flex align-items-center gap-2 border shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="fw-medium text-dark small">{user?.fullName?.split(' ')[0]}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
            <li className="px-3 py-2 border-bottom">
              <p className="fw-semibold mb-0 small">{user?.fullName}</p>
              <small className="text-muted">{user?.email}</small>
            </li>
            <li><Link to="/" className="dropdown-item py-2 small"><i className="bi bi-house me-2"></i> Home Page</Link></li>
            <li><Link to="/courses" className="dropdown-item py-2 small"><i className="bi bi-journal-text me-2"></i> Courses</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
