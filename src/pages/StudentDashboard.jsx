import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments, getMyCertificates } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [enrollRes, certRes] = await Promise.all([
        getMyEnrollments(),
        getMyCertificates(),
      ]);
      setEnrollments(enrollRes.data);
      setCertificates(certRes.data);
    } catch (err) {
      console.error('Failed to load student dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = enrollments.filter(e => e.status === 'COMPLETED' || e.progressPercentage >= 100).length;
  const inProgressCount = enrollments.length - completedCount;

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">Welcome Back, {user?.fullName?.split(' ')[0]}! 👋</h3>
        <p className="text-muted">Track your enrolled courses, module completion progress, and certificates.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <StatCard icon="bi-journal-bookmark-fill" title="Enrolled Courses" value={enrollments.length} color="primary" />
        </div>
        <div className="col-md-3 col-sm-6">
          <StatCard icon="bi-clock-history" title="In Progress" value={inProgressCount} color="info" />
        </div>
        <div className="col-md-3 col-sm-6">
          <StatCard icon="bi-check-circle-fill" title="Completed" value={completedCount} color="success" />
        </div>
        <div className="col-md-3 col-sm-6">
          <StatCard icon="bi-award-fill" title="Certificates Earned" value={certificates.length} color="accent" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card card-custom border-0 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-heading fw-bold text-dark mb-0">Recent Enrolled Courses</h5>
              <Link to="/my-courses" className="btn btn-sm btn-outline-custom">View All</Link>
            </div>

            {loading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mb-2">You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="btn btn-primary-custom btn-sm">Explore Courses</Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {enrollments.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-light rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div>
                      <h6 className="font-heading fw-semibold mb-1 text-dark">{item.courseTitle}</h6>
                      <small className="text-muted">Instructor: {item.instructorName}</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-end" style={{ minWidth: 100 }}>
                        <small className="fw-semibold text-primary d-block">{item.progressPercentage || 0}%</small>
                        <div className="progress progress-custom" style={{ width: 80, height: 6 }}>
                          <div className="progress-bar-inner" style={{ width: `${item.progressPercentage || 0}%` }}></div>
                        </div>
                      </div>
                      <Link to={`/materials/${item.courseId}`} className="btn btn-sm btn-primary-custom px-3">
                        Continue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certificates & Quick Actions */}
        <div className="col-lg-4">
          <div className="card card-custom border-0 p-4 mb-4">
            <h5 className="font-heading fw-bold text-dark mb-3">Recent Certificates</h5>
            {certificates.length === 0 ? (
              <div className="text-center py-3">
                <i className="bi bi-award text-muted opacity-50 display-6 d-block mb-2"></i>
                <small className="text-muted d-block">Complete all course materials and pass the quiz to earn your first certificate!</small>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {certificates.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                    <div className="overflow-hidden">
                      <h6 className="small fw-bold mb-0 text-truncate font-heading">{cert.courseTitle}</h6>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Issued: {cert.issueDate}</small>
                    </div>
                    <Link to="/certificates" className="btn btn-sm btn-light border text-primary">View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
