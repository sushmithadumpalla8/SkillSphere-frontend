import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'INSTRUCTOR') navigate('/instructor');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="auth-wrapper">
      {/* Branded Sidebar */}
      <div className="auth-sidebar d-none d-lg-flex">
        <div>
          <Link to="/" className="navbar-brand-logo text-white fs-3 mb-4 d-inline-flex">
            <div className="brand-icon bg-white text-primary">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <span>SkillSphere</span>
          </Link>
          <h2 className="display-6 fw-bold font-heading text-white mt-4">Welcome Back!</h2>
          <p className="lead opacity-90 text-light mt-2" style={{ maxWidth: '420px' }}>
            Log in to continue your learning journey, access course materials, submit quizzes, and view completion certificates.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-20 text-white">
          <small className="fw-bold d-block mb-2 text-warning"><i className="bi bi-key-fill me-1"></i> Quick Test Credentials:</small>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" onClick={() => quickFill('student@skillsphere.com', 'Student@123')} className="btn btn-sm btn-outline-light py-1 px-2 text-start">
              Student Demo
            </button>
            <button type="button" onClick={() => quickFill('instructor@skillsphere.com', 'Instructor@123')} className="btn btn-sm btn-outline-light py-1 px-2 text-start">
              Instructor Demo
            </button>
            <button type="button" onClick={() => quickFill('admin@skillsphere.com', 'Admin@123')} className="btn btn-sm btn-outline-light py-1 px-2 text-start">
              Admin Demo
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="auth-form-container">
        <div className="auth-card">
          {searchParams.get('session') === 'expired' && (
            <div className="alert alert-warning py-2 small mb-3">
              <i className="bi bi-exclamation-triangle me-1"></i> Your session has expired. Please log in again.
            </div>
          )}

          <div className="text-center mb-4">
            <h3 className="font-heading fw-bold text-dark">Sign In</h3>
            <p className="text-muted small">Enter your email and password to access your dashboard</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              <i className="bi bi-exclamation-circle me-1"></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-medium small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-medium small mb-0">Password</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary-custom w-100 py-2.5 mb-3">
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2" role="status"></span> Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <p className="text-muted small mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
