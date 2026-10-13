import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitQuiz } from '../services/api';

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await getQuizById(quizId);
      setQuiz(res.data);
    } catch (err) {
      setError('Quiz not found or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError('');

    const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
      questionId: Number(qId),
      selectedOptionId: Number(oId),
    }));

    try {
      const res = await submitQuiz(quizId, { answers: formattedAnswers });
      navigate(`/quiz-result/${res.data.id}`, { state: { attempt: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5 my-5"><div className="spinner-border text-primary"></div></div>;

  if (error || !quiz) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  return (
    <div className="bg-main min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Quiz Header */}
        <div className="card card-custom border-0 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-warning text-dark font-heading fw-bold">Assessment Quiz</span>
            <span className="small text-muted fw-semibold">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
          <h3 className="font-heading fw-bold text-dark mb-1">{quiz.title}</h3>
          <p className="text-muted small mb-0">{quiz.description}</p>
        </div>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {/* Question Card */}
        {currentQuestion && (
          <div className="card card-custom border-0 p-4 p-md-5 mb-4">
            <h5 className="font-heading fw-bold text-dark mb-4">
              Q{currentIdx + 1}. {currentQuestion.questionText}
            </h5>

            <div className="d-flex flex-column gap-3 mb-4">
              {currentQuestion.options?.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                    className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center gap-3 transition-all ${
                      isSelected ? 'border-primary bg-primary-subtle text-primary fw-semibold' : 'bg-white hover-bg-light'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(currentQuestion.id, opt.id)}
                      className="form-check-input"
                    />
                    <span>{opt.optionText}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="btn btn-outline-secondary px-4"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="btn btn-success px-5 py-2.5 font-heading fw-bold"
                >
                  {submitting ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span> Submitting...</span>
                  ) : (
                    <span>Submit Quiz Answers</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="btn btn-primary-custom px-4"
                >
                  Next Question <i className="bi bi-arrow-right ms-1"></i>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
