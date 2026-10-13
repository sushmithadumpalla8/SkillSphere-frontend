import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../services/api';
import StatCard from '../components/StatCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">Platform Administration</h3>
        <p className="text-muted">Real-time overview of users, active courses, total enrollments, and completion rate.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="row g-4 mb-4">
            <div className="col-md-3 col-sm-6">
              <StatCard icon="bi-people-fill" title="Total Platform Users" value={stats?.totalUsers || 0} color="primary" />
            </div>
            <div className="col-md-3 col-sm-6">
              <StatCard icon="bi-person-workspace" title="Students" value={stats?.totalStudents || 0} color="success" />
            </div>
            <div className="col-md-3 col-sm-6">
              <StatCard icon="bi-mortarboard-fill" title="Instructors" value={stats?.totalInstructors || 0} color="info" />
            </div>
            <div className="col-md-3 col-sm-6">
              <StatCard icon="bi-journal-stack" title="Courses Offered" value={stats?.totalCourses || 0} color="accent" />
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <StatCard icon="bi-bookmark-check-fill" title="Total Enrollments" value={stats?.totalEnrollments || 0} color="primary" />
            </div>
            <div className="col-md-4">
              <StatCard icon="bi-check-circle-fill" title="Completed Courses" value={stats?.completedEnrollments || 0} color="success" />
            </div>
            <div className="col-md-4">
              <StatCard icon="bi-award-fill" title="Certificates Issued" value={stats?.totalCertificates || 0} color="accent" />
            </div>
          </div>

          {/* Quick Action Navigation Cards */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card card-custom border-0 p-4 h-100">
                <div className="stat-icon bg-primary-subtle text-primary mb-3">
                  <i className="bi bi-people"></i>
                </div>
                <h5 className="font-heading fw-bold text-dark">User Management</h5>
                <p className="text-muted small">View all registered students and instructors, activate or deactivate accounts.</p>
                <Link to="/admin/users" className="btn btn-outline-primary mt-auto">Manage Users</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-custom border-0 p-4 h-100">
                <div className="stat-icon bg-success-subtle text-success mb-3">
                  <i className="bi bi-journal-check"></i>
                </div>
                <h5 className="font-heading fw-bold text-dark">Course Catalog Oversight</h5>
                <p className="text-muted small">Inspect platform course quality, remove inappropriate listings, and review structure.</p>
                <Link to="/admin/courses" className="btn btn-outline-success mt-auto">Manage Courses</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-custom border-0 p-4 h-100">
                <div className="stat-icon bg-info-subtle text-info mb-3">
                  <i className="bi bi-bar-chart-line"></i>
                </div>
                <h5 className="font-heading fw-bold text-dark">Reports & Analytics</h5>
                <p className="text-muted small">View enrollment distributions, category breakdowns, and top performing courses.</p>
                <Link to="/admin/reports" className="btn btn-outline-info mt-auto">View Analytics</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
