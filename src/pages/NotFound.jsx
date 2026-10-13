import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center py-5 my-5">
      <h1 className="display-1 fw-bold text-primary font-heading">404</h1>
      <h3 className="font-heading fw-bold text-dark mb-3">Page Not Found</h3>
      <p className="text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary-custom px-4 py-2">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
