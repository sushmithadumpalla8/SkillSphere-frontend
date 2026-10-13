import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user on 401
      localStorage.removeItem('skillsphere_token');
      localStorage.removeItem('skillsphere_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth APIs ---
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const registerApi = (userData) => API.post('/auth/register', userData);

// --- Student APIs ---
export const getStudentProfile = () => API.get('/students/me');
export const updateStudentProfile = (id, data) => API.put(`/students/${id}`, data);
export const getMyEnrollments = () => API.get('/enrollments/my-courses');
export const getMyProgress = () => API.get('/progress/my-progress');

// --- Instructor APIs ---
export const getInstructorProfile = () => API.get('/instructors/me');
export const updateInstructorProfile = (id, data) => API.put(`/instructors/${id}`, data);
export const getInstructorCourses = () => API.get('/courses/instructor/my-courses');

// --- Course APIs ---
export const getAllCourses = (params) => API.get('/courses', { params });
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// --- Modules & Materials ---
export const createModule = (courseId, data) => API.post(`/courses/${courseId}/modules`, data);
export const updateModule = (moduleId, data) => API.put(`/courses/modules/${moduleId}`, data);
export const deleteModule = (moduleId) => API.delete(`/courses/modules/${moduleId}`);
export const createMaterial = (moduleId, data) => API.post(`/materials/module/${moduleId}`, data);
export const getCourseMaterials = (courseId) => API.get(`/materials/course/${courseId}`);
export const markMaterialComplete = (materialId) => API.post(`/materials/${materialId}/complete`);

// --- Enrollments ---
export const enrollCourse = (courseId) => API.post(`/enrollments/course/${courseId}`);
export const getEnrollmentStatus = (courseId) => API.get(`/enrollments/course/${courseId}/status`);
export const getEnrolledStudentsForCourse = (courseId) => API.get(`/enrollments/course/${courseId}/students`);

// --- Quizzes & Attempts ---
export const getQuizzesByCourse = (courseId) => API.get(`/quizzes/course/${courseId}`);
export const getQuizById = (quizId) => API.get(`/quizzes/${quizId}`);
export const createQuiz = (courseId, data) => API.post(`/quizzes/course/${courseId}`, data);
export const submitQuiz = (quizId, data) => API.post(`/quizzes/${quizId}/submit`, data);
export const getMyQuizAttempts = () => API.get('/quiz-attempts/my-attempts');

// --- Certificates ---
export const getMyCertificates = () => API.get('/certificates/my-certificates');
export const getCertificateById = (id) => API.get(`/certificates/${id}`);
export const downloadCertificatePdfUrl = (id) => `http://localhost:8080/api/certificates/${id}/download`;

// --- Admin APIs ---
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminReports = () => API.get('/admin/reports');
export const getAllUsersAdmin = () => API.get('/admin/users');
export const toggleUserActiveStatus = (userId) => API.put(`/admin/users/${userId}/toggle-active`);
export const deleteUserAdmin = (userId) => API.delete(`/admin/users/${userId}`);
export const getAllCoursesAdmin = () => API.get('/admin/courses');

export default API;
