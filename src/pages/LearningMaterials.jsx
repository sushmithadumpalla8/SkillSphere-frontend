import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, getCourseMaterials, markMaterialComplete, getQuizzesByCourse } from '../services/api';

const LearningMaterials = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [materialsData, setMaterialsData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [completedMap, setCompletedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseAndMaterials();
  }, [courseId]);

  const fetchCourseAndMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const [courseRes, matRes, quizRes] = await Promise.all([
        getCourseById(courseId),
        getCourseMaterials(courseId),
        getQuizzesByCourse(courseId),
      ]);

      setCourse(courseRes.data);
      setMaterialsData(matRes.data);
      setQuizzes(quizRes.data);

      const initialMap = {};
      let firstMat = null;

      if (matRes.data && matRes.data.modules) {
        matRes.data.modules.forEach(mod => {
          if (mod.materials) {
            mod.materials.forEach(m => {
              if (m.completed) initialMap[m.id] = true;
              if (!firstMat) firstMat = m;
            });
          }
        });
      }

      setCompletedMap(initialMap);
      setSelectedMaterial(firstMat);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access Denied. You must be enrolled in this course to access learning materials.');
      } else {
        setError('Failed to load course materials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (materialId) => {
    setMarking(true);
    try {
      const res = await markMaterialComplete(materialId);
      setCompletedMap(prev => ({ ...prev, [materialId]: true }));
      setMaterialsData(prev => ({
        ...prev,
        progressPercentage: res.data.progressPercentage,
      }));
    } catch (err) {
      console.error('Failed to mark complete', err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5 my-5"><div className="spinner-border text-primary"></div></div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger py-3">{error}</div>
        <Link to={`/courses/${courseId}`} className="btn btn-primary-custom mt-3">Back to Course Details</Link>
      </div>
    );
  }

  const overallProgress = materialsData?.progressPercentage || 0;

  return (
    <div className="bg-main min-vh-100">
      {/* Top Header */}
      <div className="bg-white border-bottom py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 sticky-top shadow-sm" style={{ zIndex: 100 }}>
        <div>
          <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Course Workspace</small>
          <h4 className="font-heading fw-bold text-dark mb-0">{course?.title}</h4>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center gap-2" style={{ minWidth: 180 }}>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between small fw-semibold">
                <span className="text-muted">Progress</span>
                <span className="text-primary">{overallProgress}%</span>
              </div>
              <div className="progress progress-custom" style={{ height: 8 }}>
                <div className="progress-bar-inner" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>
          </div>

          {quizzes.length > 0 && (
            <Link to={`/quiz/${quizzes[0].id}`} className="btn btn-warning rounded-3 fw-bold px-3 text-dark">
              <i className="bi bi-question-circle-fill me-1"></i> Take Quiz
            </Link>
          )}

          <Link to="/my-courses" className="btn btn-outline-secondary btn-sm">
            Exit Viewer
          </Link>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="materials-layout">
        {/* Modules Sidebar */}
        <div className="materials-sidebar p-3">
          <h6 className="font-heading fw-bold text-uppercase text-muted px-2 mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            Modules & Materials
          </h6>

          {materialsData?.modules?.map((module) => (
            <div key={module.id} className="mb-3">
              <div className="fw-semibold text-dark small px-2 py-1 bg-light rounded-2 mb-2">
                Module {module.moduleOrder}: {module.title}
              </div>
              <div className="d-flex flex-column gap-1 ms-2">
                {module.materials?.map((material) => {
                  const isDone = !!completedMap[material.id];
                  const isSelected = selectedMaterial?.id === material.id;
                  return (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className={`btn btn-sm text-start py-2 px-2.5 rounded-2 d-flex align-items-center justify-content-between ${
                        isSelected ? 'btn-primary text-white' : 'btn-light border-0 text-dark'
                      }`}
                    >
                      <span className="text-truncate small">
                        <i className={`bi ${material.materialType === 'VIDEO' ? 'bi-play-circle-fill me-2' : 'bi-file-earmark-text-fill me-2'}`}></i>
                        {material.title}
                      </span>
                      {isDone && (
                        <i className={`bi bi-check-circle-fill ${isSelected ? 'text-white' : 'text-success'} ms-2`}></i>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Content Viewer Area */}
        <div className="materials-content">
          {selectedMaterial ? (
            <div className="card card-custom border-0 p-4">
              <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                <div>
                  <span className="badge bg-primary-subtle text-primary mb-2">{selectedMaterial.materialType}</span>
                  <h3 className="font-heading fw-bold text-dark mb-1">{selectedMaterial.title}</h3>
                  <p className="text-muted small mb-0">{selectedMaterial.description}</p>
                </div>
                <button
                  onClick={() => handleMarkComplete(selectedMaterial.id)}
                  disabled={marking || completedMap[selectedMaterial.id]}
                  className={`btn ${completedMap[selectedMaterial.id] ? 'btn-success disabled' : 'btn-primary-custom'}`}
                >
                  {completedMap[selectedMaterial.id] ? (
                    <span><i className="bi bi-check-circle-fill me-1"></i> Completed</span>
                  ) : marking ? (
                    <span><span className="spinner-border spinner-border-sm me-1"></span> Saving...</span>
                  ) : (
                    <span>Mark as Complete</span>
                  )}
                </button>
              </div>

              {/* Viewer rendering based on materialType */}
              <div className="my-4">
                {selectedMaterial.materialType === 'VIDEO' ? (
                  <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
                    <iframe
                      src={selectedMaterial.contentUrl?.replace('watch?v=', 'embed/') || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                      title={selectedMaterial.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-4 bg-light rounded-3 border">
                    <h6 className="font-heading fw-bold text-dark mb-3"><i className="bi bi-file-text me-2 text-primary"></i> Lecture Notes & Study Guide</h6>
                    <div className="text-dark small lh-lg" style={{ whitespace: 'pre-wrap' }}>
                      {selectedMaterial.textContent || 'Access material content URL below for additional reading files.'}
                    </div>
                    {selectedMaterial.contentUrl && (
                      <div className="mt-4 pt-3 border-top">
                        <a href={selectedMaterial.contentUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-box-arrow-up-right me-1"></i> Open External Document Link
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Select a material from the left sidebar to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningMaterials;
