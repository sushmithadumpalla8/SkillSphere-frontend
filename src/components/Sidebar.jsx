import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const studentLinks = [
    { to: '/student', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { to: '/my-courses', icon: 'bi-journal-bookmark-fill', label: 'My Courses' },
    { to: '/progress', icon: 'bi-graph-up-arrow', label: 'My Progress' },
    { to: '/certificates', icon: 'bi-award-fill', label: 'Certificates' },
    { to: '/courses', icon: 'bi-search', label: 'Browse Courses' },
  ];

  const instructorLinks = [
    { to: '/instructor', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { to: '/instructor/courses', icon: 'bi-collection-play-fill', label: 'My Courses' },
    { to: '/instructor/courses/create', icon: 'bi-plus-circle-fill', label: 'Create Course' },
  ];

  const adminLinks = [
    { to: '/admin', icon: 'bi-grid-1x2-fill', label: 'Overview' },
    { to: '/admin/users', icon: 'bi-people-fill', label: 'Manage Users' },
    { to: '/admin/courses', icon: 'bi-journal-stack', label: 'Manage Courses' },
    { to: '/admin/reports', icon: 'bi-bar-chart-line-fill', label: 'Reports & Analytics' },
  ];

  const getLinks = () => {
    if (user?.role === 'ADMIN') return adminLinks;
    if (user?.role === 'INSTRUCTOR') return instructorLinks;
    return studentLinks;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header d-flex align-items-center justify-content-between">
        <Link to="/" className="navbar-brand-logo fs-5">
          <div className="brand-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <span>SkillSphere</span>
        </Link>
      </div>

      <div className="px-3 py-3 border-bottom bg-light mx-3 my-2 rounded-3">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36 }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h6 className="mb-0 text-truncate font-heading fs-6">{user?.fullName}</h6>
            <span className="badge bg-primary-subtle text-primary rounded-pill small" style={{ fontSize: '0.7rem' }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li className="px-3 mb-2 text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
          Menu
        </li>
        {getLinks().map((link) => (
          <li key={link.to} className="sidebar-item">
            <NavLink
              to={link.to}
              end={link.to === '/student' || link.to === '/instructor' || link.to === '/admin'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${link.icon}`}></i>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="p-3 border-top mt-auto">
        <button onClick={logout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3">
          <i className="bi bi-box-arrow-right"></i>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
