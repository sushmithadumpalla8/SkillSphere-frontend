import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';

  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [qualification, setQualification] = useState('');
  const [title, setTitle] = useState('');
  const [expertise, setExpertise] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        password,
        fullName,
        role,
        bio,
        qualification,
        title,
        expertise,
        organization,
      };

      const user = await register(payload);
      if (user.role === 'INSTRUCTOR') navigate('/instructor');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check form details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-sidebar d-none d-lg-flex">
        <div>
          <Link to="/" className="navbar-brand-logo text-white fs-3 mb-4 d-inline-flex">
            <div className="brand-icon bg-white text-primary">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <span>SkillSphere</span>
          </Link>
          <h2 className="display-6 fw-bold font-heading text-white mt-4">Join SkillSphere Today</h2>
          <p className="lead opacity-90 text-light mt-2" style={{ maxWidth: '420px' }}>
            Create an account to enroll in computer science courses, complete quizzes, or share your knowledge as an instructor.
          </p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card" style={{ maxWidth: '540px' }}>
          <div className="text-center mb-4">
            <h3 className="font-heading fw-bold text-dark">Create Account</h3>
            <p className="text-muted small">Select your role and enter your details</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="nav nav-pills nav-justified bg-light p-1 rounded-3 mb-4">
            <button
              type="button"
              className={`nav-link rounded-3 py-2 fw-semibold ${role === 'STUDENT' ? 'active bg-primary text-white shadow-sm' : 'text-muted'}`}
              onClick={() => setRole('STUDENT')}
            >
              <i className="bi bi-person-workspace me-1"></i> Student
            </button>
            <button
              type="button"
              className={`nav-link rounded-3 py-2 fw-semibold ${role === 'INSTRUCTOR' ? 'active bg-primary text-white shadow-sm' : 'text-muted'}`}
              onClick={() => setRole('INSTRUCTOR')}
            >
              <i className="bi bi-mortarboard me-1"></i> Instructor
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              <i className="bi bi-exclamation-circle me-1"></i> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-medium small">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium small">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium small">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="At least 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {role === 'STUDENT' ? (
                <>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Qualification / Degree</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. B.Tech Computer Science & Engineering"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Short Bio</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Tell us about your learning goals..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Professional Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Java Architect"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Organization / Univ</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tech Academy"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Key Expertise</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Java, Spring Boot, React, Microservices"
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary-custom w-100 py-2.5 mt-4 mb-3">
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span> Creating Account...</span>
              ) : (
                `Register as ${role === 'INSTRUCTOR' ? 'Instructor' : 'Student'}`
              )}
            </button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <p className="text-muted small mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
