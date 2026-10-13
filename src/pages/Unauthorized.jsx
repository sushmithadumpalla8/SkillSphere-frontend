import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container text-center py-5 my-5">
      <div className="stat-icon bg-danger-subtle text-danger mx-auto mb-3" style={{ width: 80, height: 80, fontSize: '2.5rem' }}>
        <i className="bi bi-shield-slash-fill"></i>
      </div>
      <h2 className="font-heading fw-bold text-dark mb-2">403 - Access Denied</h2>
      <p className="text-muted mb-4">You do not have the required permissions or role to view this page.</p>
      <Link to="/" className="btn btn-primary-custom px-4 py-2">
        Return to Home Page
      </Link>
    </div>
  );
};

export default Unauthorized;
