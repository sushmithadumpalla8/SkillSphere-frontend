import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorCourses } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    setLoading(true);
    try {
      const res = await getInstructorCourses();
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch instructor courses', err);
    } finally {
      setLoading(false);
    }
  };

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark">Instructor Portal</h3>
          <p className="text-muted mb-0">Manage your created courses, add modules & quizzes, and view enrolled students.</p>
        </div>
        <Link to="/instructor/courses/create" className="btn btn-primary-custom rounded-pill">
          <i className="bi bi-plus-circle me-1"></i> Create New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <StatCard icon="bi-journal-stack" title="My Courses" value={courses.length} color="primary" />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-people-fill" title="Total Enrolled Students" value={totalEnrollments} color="success" />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-check2-circle" title="Active Courses" value={courses.filter(c => c.status === 'PUBLISHED').length} color="info" />
        </div>
      </div>

      {/* My Created Courses */}
      <div className="card card-custom border-0 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="font-heading fw-bold text-dark mb-0">My Course Offerings</h5>
          <Link to="/instructor/courses" className="btn btn-sm btn-outline-custom">Manage All</Link>
        </div>

        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-2">You haven't created any courses yet.</p>
            <Link to="/instructor/courses/create" className="btn btn-primary-custom btn-sm">Create First Course</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Students</th>
                  <th>Price</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).map((course) => (
                  <tr key={course.id}>
                    <td className="fw-semibold text-dark">{course.title}</td>
                    <td><span className="badge bg-light text-dark border">{course.category}</span></td>
                    <td><span className="badge bg-primary-subtle text-primary">{course.level}</span></td>
                    <td className="fw-bold text-primary">{course.enrolledStudentsCount || 0}</td>
                    <td>{course.price > 0 ? `$${course.price}` : 'Free'}</td>
                    <td className="text-end">
                      <Link to={`/instructor/courses/${course.id}`} className="btn btn-sm btn-outline-primary me-2">
                        Manage Modules & Quizzes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
