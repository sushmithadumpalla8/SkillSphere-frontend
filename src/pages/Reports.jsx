import React, { useState, useEffect } from 'react';
import { getAdminReports } from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getAdminReports();
      setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">Platform Analytics & Reports</h3>
        <p className="text-muted mb-0">Detailed insights into course popularity, category breakdown, and completion statistics.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row g-4">
          {/* Top Courses Leaderboard */}
          <div className="col-lg-6">
            <div className="card card-custom border-0 p-4 h-100">
              <h5 className="font-heading fw-bold text-dark mb-3">Top Courses by Enrollment</h5>
              <div className="d-flex flex-column gap-3">
                {reports?.topCourses?.map((tc, idx) => (
                  <div key={tc.courseId} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="fw-bold text-primary font-heading fs-5" style={{ width: 24 }}>#{idx + 1}</div>
                      <div>
                        <h6 className="font-heading fw-semibold mb-0 text-dark">{tc.courseTitle}</h6>
                        <small className="text-muted">Instructor: {tc.instructorName}</small>
                      </div>
                    </div>
                    <span className="badge bg-primary rounded-pill fs-6 px-3 py-1.5">{tc.enrolledCount} Enrolled</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="col-lg-6">
            <div className="card card-custom border-0 p-4 h-100">
              <h5 className="font-heading fw-bold text-dark mb-3">Category Distribution</h5>
              <div className="d-flex flex-column gap-3">
                {reports?.categoryCourseCount && Object.entries(reports.categoryCourseCount).map(([cat, count]) => (
                  <div key={cat} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-dark">{cat}</span>
                      <span className="badge bg-secondary">{count} Courses</span>
                    </div>
                    <div className="progress progress-custom" style={{ height: 8 }}>
                      <div className="progress-bar-inner" style={{ width: `${Math.min(count * 25, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
