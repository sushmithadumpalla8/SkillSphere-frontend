import React, { useState, useEffect } from 'react';
import { getAllCoursesAdmin, deleteCourse } from '../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCoursesAdmin();
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this course from the platform?')) {
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
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">Course Catalog Oversight</h3>
        <p className="text-muted mb-0">Oversee all published courses across instructors and remove non-compliant content.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card card-custom border-0 p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Course Title</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Enrolled</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="fw-semibold text-dark">{course.title}</td>
                    <td>{course.instructorName}</td>
                    <td><span className="badge bg-light text-dark border">{course.category}</span></td>
                    <td><span className="badge bg-primary-subtle text-primary">{course.level}</span></td>
                    <td className="fw-bold text-primary">{course.enrolledStudentsCount || 0}</td>
                    <td className="text-end">
                      <button onClick={() => handleDelete(course.id)} className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash me-1"></i> Remove Course
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

export default AdminCourses;
