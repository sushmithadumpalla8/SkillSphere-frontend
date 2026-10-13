import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon bg-primary text-white rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <span className="h4 mb-0 font-heading text-white fw-bold">SkillSphere</span>
            </div>
            <p className="text-secondary-light text-muted fs-6 mb-3">
              Learn • Practice • Grow. Empowering students and professionals with cutting-edge tech skills, interactive courses, hands-on quizzes, and verified certification.
            </p>
            <div className="d-flex gap-3 text-white fs-5">
              <a href="#twitter" className="text-muted text-hover-white"><i className="bi bi-twitter-x"></i></a>
              <a href="#linkedin" className="text-muted text-hover-white"><i className="bi bi-linkedin"></i></a>
              <a href="#github" className="text-muted text-hover-white"><i className="bi bi-github"></i></a>
              <a href="#youtube" className="text-muted text-hover-white"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-semibold text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/courses" className="text-muted hover-link">Browse Courses</Link></li>
              <li><Link to="/register" className="text-muted hover-link">Student Sign Up</Link></li>
              <li><Link to="/register?role=INSTRUCTOR" className="text-muted hover-link">Become Instructor</Link></li>
              <li><Link to="/login" className="text-muted hover-link">Account Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-semibold text-white mb-3">Popular Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/courses?category=Computer+Science" className="text-muted hover-link">Computer Science</Link></li>
              <li><Link to="/courses?category=Web+Development" className="text-muted hover-link">Web Development</Link></li>
              <li><Link to="/courses?category=Data+Science" className="text-muted hover-link">Data Science & AI</Link></li>
              <li><Link to="/courses?category=Software+Engineering" className="text-muted hover-link">Software Engineering</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-semibold text-white mb-3">SkillSphere Academic Project</h6>
            <p className="text-muted small mb-2">
              Built as a comprehensive B.Tech Computer Science & Engineering Capstone Project.
            </p>
            <div className="bg-secondary p-3 rounded-3 border border-secondary">
              <small className="text-light d-block"><i className="bi bi-shield-check text-success me-1"></i> Spring Boot 3 + React 19</small>
              <small className="text-light d-block"><i className="bi bi-database text-info me-1"></i> MySQL Database Integrated</small>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <small className="text-muted">© {new Date().getFullYear()} SkillSphere Platform. All rights reserved.</small>
          <small className="text-muted">Tagline: Learn • Practice • Grow</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
