import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCourseById,
  createModule,
  createMaterial,
  createQuiz,
  getQuizzesByCourse,
  getEnrolledStudentsForCourse,
} from '../services/api';

const ManageCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');

  // New Module Form State
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modOrder, setModOrder] = useState(1);

  // New Material Form State
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState('TEXT');
  const [matContent, setMatContent] = useState('');
  const [matUrl, setMatUrl] = useState('');

  // New Quiz Form State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizPass, setQuizPass] = useState(50);
  const [q1Text, setQ1Text] = useState('');
  const [q1OptA, setQ1OptA] = useState('');
  const [q1OptB, setQ1OptB] = useState('');
  const [q1OptC, setQ1OptC] = useState('');
  const [q1OptD, setQ1OptD] = useState('');
  const [q1CorrectIdx, setQ1CorrectIdx] = useState(1); // 0 for A, 1 for B...

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseRes, quizRes, studRes] = await Promise.all([
        getCourseById(id),
        getQuizzesByCourse(id),
        getEnrolledStudentsForCourse(id),
      ]);
      setCourse(courseRes.data);
      setQuizzes(quizRes.data);
      setStudents(studRes.data);
      if (courseRes.data.modules?.length > 0) {
        setSelectedModuleId(courseRes.data.modules[0].id);
        setModOrder(courseRes.data.modules.length + 1);
      }
    } catch (err) {
      console.error('Failed to load course details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await createModule(id, { title: modTitle, description: modDesc, moduleOrder: Number(modOrder) });
      setMessage({ type: 'success', text: 'Module added successfully!' });
      setModTitle('');
      setModDesc('');
      fetchCourseData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to add module' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!selectedModuleId) {
      setMessage({ type: 'danger', text: 'Please select a target module first.' });
      return;
    }
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await createMaterial(selectedModuleId, {
        title: matTitle,
        materialType: matType,
        textContent: matContent,
        contentUrl: matUrl,
        orderIndex: 1,
      });
      setMessage({ type: 'success', text: 'Learning material added!' });
      setMatTitle('');
      setMatContent('');
      setMatUrl('');
      fetchCourseData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to add material' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const questionsPayload = [
      {
        questionText: q1Text,
        marks: 1,
        orderIndex: 1,
        options: [
          { optionText: q1OptA, isCorrect: q1CorrectIdx === 0 },
          { optionText: q1OptB, isCorrect: q1CorrectIdx === 1 },
          { optionText: q1OptC, isCorrect: q1CorrectIdx === 2 },
          { optionText: q1OptD, isCorrect: q1CorrectIdx === 3 },
        ],
      },
    ];

    try {
      await createQuiz(id, {
        title: quizTitle,
        description: quizDesc,
        passingScorePercentage: Number(quizPass),
        timeLimitMinutes: 20,
        questions: questionsPayload,
      });
      setMessage({ type: 'success', text: 'Quiz created successfully!' });
      setQuizTitle('');
      setQuizDesc('');
      setQ1Text('');
      setQ1OptA('');
      setQ1OptB('');
      setQ1OptC('');
      setQ1OptD('');
      fetchCourseData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to create quiz.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5 my-5"><div className="spinner-border text-primary"></div></div>;
  if (!course) return <div className="alert alert-danger my-5">Course not found.</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary mb-1">{course.category}</span>
          <h3 className="font-heading fw-bold text-dark mb-0">Manage: {course.title}</h3>
        </div>
        <Link to="/instructor/courses" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to Courses
        </Link>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 mb-4 alert-dismissible fade show`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link fw-semibold ${activeTab === 'modules' ? 'active text-primary' : 'text-muted'}`} onClick={() => setActiveTab('modules')}>
            <i className="bi bi-journal-text me-1"></i> Modules & Materials ({course.modules?.length || 0})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link fw-semibold ${activeTab === 'quizzes' ? 'active text-primary' : 'text-muted'}`} onClick={() => setActiveTab('quizzes')}>
            <i className="bi bi-patch-question me-1"></i> Quizzes ({quizzes.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link fw-semibold ${activeTab === 'students' ? 'active text-primary' : 'text-muted'}`} onClick={() => setActiveTab('students')}>
            <i className="bi bi-people me-1"></i> Enrolled Students ({students.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Modules & Materials */}
      {activeTab === 'modules' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card card-custom border-0 p-4 mb-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Existing Modules</h5>
              {course.modules?.length === 0 ? (
                <p className="text-muted small">No modules created yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="p-3 bg-light rounded-3 border">
                      <h6 className="font-heading fw-bold text-dark mb-1">Module {mod.moduleOrder}: {mod.title}</h6>
                      <p className="small text-muted mb-2">{mod.description}</p>
                      <small className="fw-semibold text-primary d-block mb-1">Materials ({mod.materials?.length || 0}):</small>
                      <ul className="list-group list-group-flush rounded-2">
                        {mod.materials?.map((mat) => (
                          <li key={mat.id} className="list-group-item bg-white py-1.5 small d-flex justify-content-between">
                            <span><i className="bi bi-file-earmark me-1"></i> {mat.title}</span>
                            <span className="badge bg-light text-muted border">{mat.materialType}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card card-custom border-0 p-4 mb-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Add New Module</h5>
              <form onSubmit={handleAddModule}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Module Title</label>
                  <input type="text" className="form-control" value={modTitle} onChange={(e) => setModTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea className="form-control" rows="2" value={modDesc} onChange={(e) => setModDesc(e.target.value)}></textarea>
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary-custom btn-sm px-4">
                  {saving ? 'Adding...' : 'Add Module'}
                </button>
              </form>
            </div>

            <div className="card card-custom border-0 p-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Add Learning Material</h5>
              <form onSubmit={handleAddMaterial}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Select Target Module</label>
                  <select className="form-select" value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)} required>
                    {course.modules?.map((m) => (
                      <option key={m.id} value={m.id}>Module {m.moduleOrder}: {m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Material Title</label>
                  <input type="text" className="form-control" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Material Type</label>
                  <select className="form-select" value={matType} onChange={(e) => setMatType(e.target.value)}>
                    <option value="TEXT">TEXT / Document Notes</option>
                    <option value="VIDEO">VIDEO (YouTube / MP4 Link)</option>
                    <option value="PDF">PDF File Link</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Content Text / Notes</label>
                  <textarea className="form-control" rows="3" value={matContent} onChange={(e) => setMatContent(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Content URL (Video/PDF)</label>
                  <input type="url" className="form-control" value={matUrl} onChange={(e) => setMatUrl(e.target.value)} />
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary-custom btn-sm px-4">
                  {saving ? 'Saving...' : 'Add Material'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card card-custom border-0 p-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Course Quizzes</h5>
              {quizzes.length === 0 ? (
                <p className="text-muted small">No quizzes created for this course yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {quizzes.map((q) => (
                    <div key={q.id} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="font-heading fw-bold text-dark mb-0">{q.title}</h6>
                        <span className="badge bg-warning text-dark">Pass: {q.passingScorePercentage}%</span>
                      </div>
                      <p className="small text-muted mb-2">{q.description}</p>
                      <small className="fw-semibold text-primary">Questions: {q.questions?.length || 0}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card card-custom border-0 p-4">
              <h5 className="font-heading fw-bold text-dark mb-3">Create Quiz Assessment</h5>
              <form onSubmit={handleCreateQuiz}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Quiz Title</label>
                  <input type="text" className="form-control" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Description</label>
                  <input type="text" className="form-control" value={quizDesc} onChange={(e) => setQuizDesc(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Passing Score (%)</label>
                  <input type="number" min="10" max="100" className="form-control" value={quizPass} onChange={(e) => setQuizPass(e.target.value)} required />
                </div>

                <hr className="my-3" />
                <h6 className="font-heading fw-bold text-primary mb-3">Question #1 (MCQ)</h6>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="Enter question text..." value={q1Text} onChange={(e) => setQ1Text(e.target.value)} required />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <input type="text" className="form-control form-control-sm" placeholder="Option A" value={q1OptA} onChange={(e) => setQ1OptA(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <input type="text" className="form-control form-control-sm" placeholder="Option B" value={q1OptB} onChange={(e) => setQ1OptB(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <input type="text" className="form-control form-control-sm" placeholder="Option C" value={q1OptC} onChange={(e) => setQ1OptC(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <input type="text" className="form-control form-control-sm" placeholder="Option D" value={q1OptD} onChange={(e) => setQ1OptD(e.target.value)} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Correct Option</label>
                  <select className="form-select form-select-sm" value={q1CorrectIdx} onChange={(e) => setQ1CorrectIdx(Number(e.target.value))}>
                    <option value={0}>Option A</option>
                    <option value={1}>Option B (Correct)</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary-custom btn-sm px-4">
                  {saving ? 'Creating...' : 'Create Quiz'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Enrolled Students */}
      {activeTab === 'students' && (
        <div className="card card-custom border-0 p-4">
          <h5 className="font-heading fw-bold text-dark mb-3">Enrolled Student List</h5>
          {students.length === 0 ? (
            <p className="text-muted small">No students enrolled in this course yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Enrollment Date</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr key={st.id}>
                      <td className="fw-semibold text-dark">{st.studentName}</td>
                      <td className="text-muted">{st.studentEmail}</td>
                      <td>{st.enrollmentDate}</td>
                      <td className="fw-bold text-primary">{st.progressPercentage || 0}%</td>
                      <td><span className="badge bg-success-subtle text-success">{st.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCourse;
