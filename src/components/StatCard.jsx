import React from 'react';

const StatCard = ({ icon, title, value, color = 'primary', subtext }) => {
  const bgClasses = {
    primary: 'bg-primary-subtle text-primary',
    success: 'bg-success-subtle text-success',
    accent: 'bg-warning-subtle text-warning',
    danger: 'bg-danger-subtle text-danger',
    info: 'bg-info-subtle text-info',
  };

  return (
    <div className="stat-card">
      <div className={`stat-icon ${bgClasses[color] || bgClasses.primary}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <h3 className="mb-0 font-heading fw-bold text-dark">{value}</h3>
        <p className="text-muted mb-0 small fw-medium">{title}</p>
        {subtext && <small className="text-muted" style={{ fontSize: '0.75rem' }}>{subtext}</small>}
      </div>
    </div>
  );
};

export default StatCard;
