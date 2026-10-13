import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments } from '../services/api';
import CourseCard from '../components/CourseCard';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await getMyEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      console.error('Failed to load enrolled courses', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">My Enrolled Courses</h3>
        <p className="text-muted">Pick up right where you left off in your active learning paths.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : enrollments.length === 0 ? (
        <div className="card card-custom border-0 p-5 text-center my-4">
          <i className="bi bi-journal-plus display-1 text-muted mb-3 opacity-50"></i>
          <h4 className="font-heading fw-bold text-dark">No Enrolled Courses</h4>
          <p className="text-muted">Explore our catalog and start learning computer science today.</p>
          <Link to="/courses" className="btn btn-primary-custom mx-auto mt-2">Browse Courses</Link>
        </div>
      ) : (
        <div className="row g-4">
          {enrollments.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <CourseCard
                course={{
                  id: item.courseId,
                  title: item.courseTitle,
                  description: item.courseDescription || 'Enrolled course module content.',
                  instructorName: item.instructorName,
                  level: item.level || 'INTERMEDIATE',
                  category: item.category || 'Computer Science',
                  imageUrl: item.imageUrl,
                }}
                isEnrolled={true}
                progressPercentage={item.progressPercentage || 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
