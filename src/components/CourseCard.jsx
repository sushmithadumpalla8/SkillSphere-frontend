import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, isEnrolled = false, progressPercentage = 0 }) => {
  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'BEGINNER': return 'badge-beginner';
      case 'INTERMEDIATE': return 'badge-intermediate';
      case 'ADVANCED': return 'badge-advanced';
      default: return 'bg-secondary text-white';
    }
  };

  const defaultImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="card card-custom h-100 border-0 overflow-hidden d-flex flex-column">
      <div className="position-relative">
        <img
          src={course.imageUrl || defaultImg}
          alt={course.title}
          className="w-100 course-card-img"
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className={`badge rounded-pill ${getLevelBadgeClass(course.level)} px-2.5 py-1`}>
            {course.level}
          </span>
          <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-2.5 py-1">
            {course.category}
          </span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
          <i className="bi bi-person-circle text-primary"></i>
          <span>{course.instructorName || 'Expert Instructor'}</span>
        </div>

        <h5 className="card-title font-heading fw-semibold mb-2 text-dark line-clamp-2" style={{ minHeight: '3rem' }}>
          {course.title}
        </h5>

        <p className="card-text text-muted small line-clamp-2 mb-3 flex-grow-1">
          {course.description}
        </p>

        {isEnrolled ? (
          <div className="mt-auto pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-1 small fw-medium">
              <span className="text-muted">Progress</span>
              <span className="text-primary">{progressPercentage}%</span>
            </div>
            <div className="progress progress-custom mb-3">
              <div className="progress-bar-inner" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <Link to={`/materials/${course.id}`} className="btn btn-primary-custom w-100 text-center py-2">
              <i className="bi bi-play-circle-fill me-1"></i> Continue Learning
            </Link>
          </div>
        ) : (
          <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
            <div>
              <span className="fs-5 fw-bold text-primary">
                {course.price > 0 ? `$${course.price}` : 'Free'}
              </span>
              {course.durationHours && (
                <span className="text-muted small ms-2">
                  • {course.durationHours} hrs
                </span>
              )}
            </div>

            <Link to={`/courses/${course.id}`} className="btn btn-outline-custom btn-sm rounded-pill px-3">
              View Details <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
