import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/api';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-5 position-relative overflow-hidden">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-2 mb-3 font-heading fw-semibold">
                <i className="bi bi-stars text-warning me-1"></i> Tagline: Learn • Practice • Grow
              </span>

              <h1 className="display-4 fw-extrabold font-heading text-white mb-3 lh-sm">
                Master Modern Tech Skills & Elevate Your Engineering Career
              </h1>

              <p className="lead text-light opacity-90 mb-4 fs-5" style={{ maxWidth: '640px' }}>
                SkillSphere is an interactive online learning platform offering structured computer science courses, hands-on module materials, automated quizzes, and verified completion certificates.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="bg-white p-2 rounded-4 shadow-lg d-flex align-items-center gap-2" style={{ maxWidth: '580px' }}>
                  <i className="bi bi-search text-muted fs-5 ms-3"></i>
                  <input
                    type="text"
                    className="form-borderless form-control fs-6 border-0 shadow-none"
                    placeholder="Search courses (Java, Python, Web Dev, React)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary-custom rounded-3 px-4 py-2">
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Category Badges */}
              <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center justify-content-lg-start">
                <span className="text-light small opacity-75 me-2">Popular:</span>
                {['Java', 'Web Development', 'Python', 'Machine Learning', 'Data Structures'].map((cat) => (
                  <Link key={cat} to={`/courses?search=${cat}`} className="badge bg-white bg-opacity-10 text-white text-decoration-none rounded-pill px-3 py-1.5 hover-lift">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Learning Platform"
                  className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20"
                />
                <div className="position-absolute bottom-0 start-0 m-3 bg-white text-dark p-3 rounded-3 shadow-lg d-flex align-items-center gap-3 text-start">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                    <i className="bi bi-award fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold font-heading">Verified Certificates</h6>
                    <small className="text-muted">Earn accredited completion certificates</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-4 border-bottom shadow-sm">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3 col-6">
              <h2 className="fw-bold font-heading text-primary mb-0">6+</h2>
              <p className="text-muted small mb-0">Core Engineering Courses</p>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-bold font-heading text-success mb-0">100%</h2>
              <p className="text-muted small mb-0">Interactive Quizzes</p>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-bold font-heading text-warning mb-0">Instant</h2>
              <p className="text-muted small mb-0">Certificate Generation</p>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-bold font-heading text-info mb-0">Role-Based</h2>
              <p className="text-muted small mb-0">Student, Instructor & Admin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-5 bg-main">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Featured Curriculum</span>
              <h2 className="font-heading fw-bold text-dark mb-0">Explore Popular Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-outline-custom mt-3 mt-md-0">
              View All Courses <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <div key={course.id} className="col-lg-4 col-md-6">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Step-by-Step Learning</span>
            <h2 className="font-heading fw-bold text-dark">How SkillSphere Works</h2>
            <p className="text-muted">Simple, structured, and effective learning path designed for engineering students.</p>
          </div>

          <div className="row g-4">
            {[
              { step: '01', icon: 'bi-journal-plus', title: 'Enroll in Courses', desc: 'Browse our computer science catalog and enroll with one click.' },
              { step: '02', icon: 'bi-play-circle', title: 'Access Learning Materials', desc: 'Study video lectures, PDFs, code snippets, and documentation.' },
              { step: '03', icon: 'bi-check2-square', title: 'Practice & Take Quizzes', desc: 'Test your concept comprehension with module quizzes and instant scoring.' },
              { step: '04', icon: 'bi-award', title: 'Get Certified', desc: 'Complete all modules, pass the quiz, and download your printable certificate.' },
            ].map((item) => (
              <div key={item.step} className="col-lg-3 col-md-6">
                <div className="card card-custom h-100 p-4 border-0 text-center position-relative">
                  <span className="position-absolute top-0 end-0 m-3 text-muted opacity-25 fw-bold font-heading fs-3">
                    {item.step}
                  </span>
                  <div className="stat-icon bg-primary-subtle text-primary mx-auto mb-3" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h5 className="font-heading fw-bold text-dark mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Showcase */}
      <section className="py-5 bg-main">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="font-heading fw-bold text-dark">Tailored Portals for Every Role</h2>
            <p className="text-muted">Built for students, educators, and platform administrators.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card card-custom h-100 p-4 border-0 text-center">
                <div className="stat-icon bg-success-subtle text-success mx-auto mb-3" style={{ width: 64, height: 64, fontSize: '2rem' }}>
                  <i className="bi bi-person-workspace"></i>
                </div>
                <h4 className="font-heading fw-bold text-dark mb-2">For Students</h4>
                <p className="text-muted small mb-4">Enroll in courses, track progress percentage, attempt quizzes with instant results, and download certificates.</p>
                <Link to="/register?role=STUDENT" className="btn btn-outline-success mt-auto rounded-pill">Student Portal</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-custom h-100 p-4 border-0 text-center">
                <div className="stat-icon bg-primary-subtle text-primary mx-auto mb-3" style={{ width: 64, height: 64, fontSize: '2rem' }}>
                  <i className="bi bi-mortarboard"></i>
                </div>
                <h4 className="font-heading fw-bold text-dark mb-2">For Instructors</h4>
                <p className="text-muted small mb-4">Create & manage courses, upload video/PDF materials, create custom quizzes, and monitor enrolled student performance.</p>
                <Link to="/register?role=INSTRUCTOR" className="btn btn-outline-primary mt-auto rounded-pill">Instructor Portal</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-custom h-100 p-4 border-0 text-center">
                <div className="stat-icon bg-warning-subtle text-warning mx-auto mb-3" style={{ width: 64, height: 64, fontSize: '2rem' }}>
                  <i className="bi bi-shield-lock"></i>
                </div>
                <h4 className="font-heading fw-bold text-dark mb-2">For Admins</h4>
                <p className="text-muted small mb-4">Manage users, activate/deactivate accounts, oversee platform courses, view overall enrollment analytics and system reports.</p>
                <Link to="/login" className="btn btn-outline-warning mt-auto rounded-pill">Admin Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
