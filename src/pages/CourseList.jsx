import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllCourses } from '../services/api';
import CourseCard from '../components/CourseCard';

const CourseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');

  useEffect(() => {
    fetchCourses();
  }, [searchParams]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('category')) params.category = searchParams.get('category');
      if (searchParams.get('level')) params.level = searchParams.get('level');

      const res = await getAllCourses(params);
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (search.trim()) newParams.search = search;
    if (category) newParams.category = category;
    if (level) newParams.level = level;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setLevel('');
    setSearchParams({});
  };

  return (
    <div className="py-5 bg-main min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="font-heading fw-bold text-dark mb-1">Explore Courses</h2>
          <p className="text-muted">Master skills in Java, Web Development, Data Structures, Python, and Machine Learning.</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="card card-custom border-0 p-3 mb-4">
          <form onSubmit={handleFilterSubmit} className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Search course title or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
            </div>

            <div className="col-md-2">
              <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary-custom w-100 py-2">Filter</button>
              {(search || category || level) && (
                <button type="button" onClick={clearFilters} className="btn btn-light border py-2">
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="card card-custom border-0 p-5 text-center my-4">
            <i className="bi bi-journal-x display-1 text-muted mb-3 opacity-50"></i>
            <h4 className="font-heading fw-bold text-dark">No Courses Found</h4>
            <p className="text-muted">Try adjusting your search query or filter options.</p>
            <button onClick={clearFilters} className="btn btn-outline-custom mx-auto mt-2">Clear Filters</button>
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
    </div>
  );
};

export default CourseList;
