import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById, enrollCourse, getEnrollmentStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const res = await getCourseById(id);
      setCourse(res.data);

      if (isAuthenticated && isStudent) {
        try {
          const statusRes = await getEnrollmentStatus(id);
          setIsEnrolled(statusRes.data.enrolled);
        } catch (e) {
          // Ignore 404/not enrolled status error
        }
      }
    } catch (err) {
      setError('Course not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isStudent) {
      setError('Only student accounts can enroll in courses.');
      return;
    }

    setEnrolling(true);
    setError('');
    try {
      await enrollCourse(id);
      setIsEnrolled(true);
      navigate(`/materials/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-primary-custom mt-3">Back to Courses</Link>
      </div>
    );
  }

  const defaultImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-main py-5">
      <div className="container">
        {/* Banner Card */}
        <div className="card card-custom border-0 overflow-hidden mb-5">
          <div className="row g-0">
            <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary rounded-pill px-3 py-1.5">{course.category}</span>
                <span className="badge bg-secondary rounded-pill px-3 py-1.5">{course.level}</span>
              </div>

              <h1 className="display-6 font-heading fw-bold text-dark mb-3">{course.title}</h1>
              <p className="lead text-muted fs-6 mb-4">{course.description}</p>

              <div className="d-flex flex-wrap align-items-center gap-4 text-muted small mb-4">
                <div>
                  <i className="bi bi-person-circle text-primary me-1"></i>
                  Instructor: <strong>{course.instructorName}</strong>
                </div>
                <div>
                  <i className="bi bi-clock text-primary me-1"></i>
                  Duration: <strong>{course.durationHours || 12} Hours</strong>
                </div>
                <div>
                  <i className="bi bi-journal-text text-primary me-1"></i>
                  Modules: <strong>{course.modules?.length || 0} Modules</strong>
                </div>
              </div>

              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div>
                {isEnrolled ? (
                  <Link to={`/materials/${id}`} className="btn btn-success rounded-3 px-4 py-2.5 fw-bold fs-6">
                    <i className="bi bi-play-circle-fill me-2"></i> Go to Learning Materials
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-primary-custom rounded-3 px-5 py-2.5 fs-6"
                  >
                    {enrolling ? (
                      <span><span className="spinner-border spinner-border-sm me-2"></span> Enrolling...</span>
                    ) : (
                      <span>Enroll Now • {course.price > 0 ? `$${course.price}` : 'Free'}</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-5 position-relative min-vh-30">
              <img
                src={course.imageUrl || defaultImg}
                alt={course.title}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => { e.target.src = defaultImg; }}
              />
            </div>
          </div>
        </div>

        {/* Modules & Syllabus */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card card-custom border-0 p-4 mb-4">
              <h4 className="font-heading fw-bold text-dark mb-3">Course Modules & Syllabus</h4>
              <p className="text-muted small mb-4">Comprehensive breakdown of topics, lectures, and quizzes in this course.</p>

              {course.modules && course.modules.length > 0 ? (
                <div className="accordion" id="modulesAccordion">
                  {course.modules.map((module, idx) => (
                    <div key={module.id} className="accordion-item border-0 mb-3 rounded-3 shadow-sm overflow-hidden">
                      <h2 className="accordion-header" id={`heading${module.id}`}>
                        <button
                          className={`accordion-button fw-semibold ${idx !== 0 ? 'collapsed' : ''}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${module.id}`}
                        >
                          Module {module.moduleOrder}: {module.title}
                        </button>
                      </h2>
                      <div
                        id={`collapse${module.id}`}
                        className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                        data-bs-parent="#modulesAccordion"
                      >
                        <div className="accordion-body bg-light">
                          <p className="small text-muted mb-3">{module.description}</p>
                          <ul className="list-group list-group-flush rounded-3">
                            {module.materials && module.materials.map((mat) => (
                              <li key={mat.id} className="list-group-item d-flex justify-content-between align-items-center bg-white py-2">
                                <span className="small font-heading text-dark">
                                  <i className={`bi ${mat.materialType === 'VIDEO' ? 'bi-play-btn text-danger' : 'bi-file-earmark-text text-primary'} me-2`}></i>
                                  {mat.title}
                                </span>
                                <span className="badge bg-light text-muted border small">{mat.materialType}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No modules created yet for this course.</p>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="col-lg-4">
            <div className="card card-custom border-0 p-4 mb-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Instructor Profile</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 50, height: 50 }}>
                  {course.instructorName?.charAt(0) || 'I'}
                </div>
                <div>
                  <h6 className="mb-0 fw-bold font-heading">{course.instructorName}</h6>
                  <small className="text-muted">SkillSphere Educator</small>
                </div>
              </div>
              <p className="small text-muted mb-0">Expert Computer Science instructor dedicated to guiding students through practical coding and concept mastery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
