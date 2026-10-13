import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorCourses, deleteCourse } from '../services/api';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getInstructorCourses();
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load instructor courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark">Course Management</h3>
          <p className="text-muted mb-0">View, edit, or manage content for your courses.</p>
        </div>
        <Link to="/instructor/courses/create" className="btn btn-primary-custom rounded-pill">
          <i className="bi bi-plus-lg me-1"></i> Add New Course
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : courses.length === 0 ? (
        <div className="card card-custom border-0 p-5 text-center my-4">
          <h4 className="font-heading fw-bold text-dark">No Courses Created</h4>
          <p className="text-muted">Start creating your curriculum and publishing learning materials.</p>
          <Link to="/instructor/courses/create" className="btn btn-primary-custom mx-auto mt-2">Create Course</Link>
        </div>
      ) : (
        <div className="card card-custom border-0 p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Enrolled Students</th>
                  <th>Price</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="fw-bold text-dark">{course.title}</td>
                    <td><span className="badge bg-light text-dark border">{course.category}</span></td>
                    <td><span className="badge bg-primary-subtle text-primary">{course.level}</span></td>
                    <td className="fw-bold text-primary">{course.enrolledStudentsCount || 0}</td>
                    <td>{course.price > 0 ? `$${course.price}` : 'Free'}</td>
                    <td className="text-end">
                      <Link to={`/instructor/courses/${course.id}`} className="btn btn-sm btn-primary-custom me-2">
                        Manage Content
                      </Link>
                      <button onClick={() => handleDelete(course.id)} className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
