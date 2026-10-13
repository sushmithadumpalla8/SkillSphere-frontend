import React, { useState, useEffect } from 'react';
import { getMyProgress, getMyQuizAttempts } from '../services/api';
import StatCard from '../components/StatCard';

const Progress = () => {
  const [progressList, setProgressList] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [progRes, attRes] = await Promise.all([
        getMyProgress(),
        getMyQuizAttempts(),
      ]);
      setProgressList(progRes.data);
      setAttempts(attRes.data);
    } catch (err) {
      console.error('Failed to load progress', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">Learning Progress & Quiz History</h3>
        <p className="text-muted">Detailed completion breakdown per enrolled course and test scores.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card card-custom border-0 p-4 mb-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Course Progress Tracker</h5>
              {progressList.length === 0 ? (
                <p className="text-muted small">No active course progress recorded yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {progressList.map((item) => (
                    <div key={item.id} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="font-heading fw-semibold text-dark mb-0">{item.courseTitle}</h6>
                        <span className="badge bg-primary-subtle text-primary">{item.progressPercentage}% Complete</span>
                      </div>
                      <div className="progress progress-custom mb-2">
                        <div className="progress-bar-inner" style={{ width: `${item.progressPercentage}%` }}></div>
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span>Completed Materials: {item.completedMaterialsCount}</span>
                        <span>Status: <strong className="text-dark">{item.status}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card card-custom border-0 p-4 mb-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Quiz Attempts Log</h5>
              {attempts.length === 0 ? (
                <p className="text-muted small">No quiz attempts submitted yet.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {attempts.map((att) => (
                    <div key={att.id} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="small font-heading fw-bold mb-0 text-dark">{att.quizTitle}</h6>
                        <small className="text-muted">Score: {att.score}/{att.totalQuestions} ({att.percentage.toFixed(0)}%)</small>
                      </div>
                      <span className={`badge rounded-pill ${att.passed ? 'bg-success' : 'bg-danger'}`}>
                        {att.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
