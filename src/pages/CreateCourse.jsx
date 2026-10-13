import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../services/api';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [level, setLevel] = useState('BEGINNER');
  const [price, setPrice] = useState(0);
  const [durationHours, setDurationHours] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await createCourse({
        title,
        description,
        category,
        level,
        price: Number(price),
        durationHours: Number(durationHours),
        imageUrl: imageUrl.trim() || undefined,
        learningObjectives,
      });

      navigate(`/instructor/courses/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="mb-4">
        <h3 className="font-heading fw-bold text-dark">Create New Course</h3>
        <p className="text-muted">Fill in course details to create your new curriculum offering.</p>
      </div>

      <div className="card card-custom border-0 p-4 p-md-5">
        {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Course Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Masterclass in Data Structures & Algorithms"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Description *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Provide a comprehensive summary of what students will learn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Computer Science">Computer Science</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Difficulty Level *</label>
              <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Price ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                placeholder="0 for free course"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Estimated Duration (Hours) *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Cover Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <small className="text-muted">Leave empty to use high quality default cover.</small>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Learning Objectives</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Key takeaways, e.g. Understand recursion, binary trees, dynamic programming..."
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline-secondary px-4">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary-custom px-5">
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span> Creating...</span>
              ) : (
                'Create Course & Add Modules'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
