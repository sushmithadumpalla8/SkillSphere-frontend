import React, { useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const QuizResult = () => {
  const location = useLocation();
  const attempt = location.state?.attempt;

  useEffect(() => {
    if (attempt?.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [attempt]);

  if (!attempt) {
    return (
      <div className="container py-5 text-center">
        <h4>No quiz result details found.</h4>
        <Link to="/my-courses" className="btn btn-primary-custom mt-3">Go to My Courses</Link>
      </div>
    );
  }

  return (
    <div className="bg-main min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="card card-custom border-0 p-4 p-md-5 text-center">
          <div className={`stat-icon mx-auto mb-3 ${attempt.passed ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ width: 80, height: 80, fontSize: '2.5rem' }}>
            <i className={`bi ${attempt.passed ? 'bi-trophy-fill' : 'bi-x-circle-fill'}`}></i>
          </div>

          <span className={`badge mx-auto mb-2 px-3 py-1.5 rounded-pill ${attempt.passed ? 'bg-success' : 'bg-danger'}`}>
            {attempt.passed ? 'PASSED' : 'FAILED'}
          </span>

          <h2 className="font-heading fw-bold text-dark mb-1">Quiz Completed!</h2>
          <p className="text-muted small mb-4">{attempt.quizTitle}</p>

          {/* Score Card */}
          <div className="bg-light p-4 rounded-3 mb-4 border">
            <div className="row text-center g-3">
              <div className="col-4">
                <h3 className="fw-bold font-heading text-primary mb-0">{attempt.score} / {attempt.totalQuestions}</h3>
                <small className="text-muted">Correct Answers</small>
              </div>
              <div className="col-4 border-start border-end">
                <h3 className="fw-bold font-heading text-dark mb-0">{attempt.percentage.toFixed(0)}%</h3>
                <small className="text-muted">Percentage</small>
              </div>
              <div className="col-4">
                <h3 className={`fw-bold font-heading mb-0 ${attempt.passed ? 'text-success' : 'text-danger'}`}>
                  {attempt.passingPercentage}%
                </h3>
                <small className="text-muted">Required to Pass</small>
              </div>
            </div>
          </div>

          {attempt.passed ? (
            <div className="alert alert-success p-3 text-center mb-4">
              <i className="bi bi-patch-check-fill me-2 fs-5"></i>
              <strong>Congratulations!</strong> You passed the quiz assessment and earned your course certificate!
            </div>
          ) : (
            <div className="alert alert-warning p-3 text-center mb-4">
              <i className="bi bi-info-circle me-2"></i>
              You did not meet the passing score threshold. You can review course materials and re-attempt the quiz.
            </div>
          )}

          <div className="d-flex flex-wrap justify-content-center gap-3">
            {attempt.passed && (
              <Link to="/certificates" className="btn btn-primary-custom px-4 py-2.5">
                <i className="bi bi-award-fill me-2"></i> View Certificate
              </Link>
            )}
            <Link to="/my-courses" className="btn btn-outline-secondary px-4 py-2.5">
              Back to My Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
