import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'INSTRUCTOR') return '/instructor';
    return '/student';
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-custom">
      <div className="container">
        <Link to="/" className="navbar-brand-logo">
          <div className="brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <span>SkillSphere</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium">
            <li className="nav-item">
              <Link to="/" className={`nav-link px-3 ${location.pathname === '/' ? 'active text-primary fw-semibold' : ''}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/courses" className={`nav-link px-3 ${location.pathname === '/courses' ? 'active text-primary fw-semibold' : ''}`}>
                Courses
              </Link>
            </li>
            {isAuthenticated && user?.role === 'STUDENT' && (
              <li className="nav-item">
                <Link to="/my-courses" className={`nav-link px-3 ${location.pathname === '/my-courses' ? 'active text-primary fw-semibold' : ''}`}>
                  My Learning
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 rounded-pill px-3 py-2 border shadow-sm dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="fw-medium text-dark">{user?.fullName?.split(' ')[0]}</span>
                  <span className="badge bg-primary-subtle text-primary rounded-pill small ms-1">
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2">
                  <li className="px-3 py-2 border-bottom">
                    <p className="fw-semibold mb-0 text-dark">{user?.fullName}</p>
                    <small className="text-muted">{user?.email}</small>
                  </li>
                  <li>
                    <Link to={getDashboardLink()} className="dropdown-item py-2">
                      <i className="bi bi-speedometer2 me-2 text-primary"></i> Dashboard
                    </Link>
                  </li>
                  {user?.role === 'STUDENT' && (
                    <>
                      <li>
                        <Link to="/my-courses" className="dropdown-item py-2">
                          <i className="bi bi-journal-bookmark me-2 text-primary"></i> My Courses
                        </Link>
                      </li>
                      <li>
                        <Link to="/certificates" className="dropdown-item py-2">
                          <i className="bi bi-award me-2 text-primary"></i> Certificates
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger py-2">
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-custom">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary-custom">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
