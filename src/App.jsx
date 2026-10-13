import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './pages/MyCourses';
import LearningMaterials from './pages/LearningMaterials';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Progress from './pages/Progress';
import Certificates from './pages/Certificates';

// Instructor Pages
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourses from './pages/InstructorCourses';
import CreateCourse from './pages/CreateCourse';
import ManageCourse from './pages/ManageCourse';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Pages (Standalone Fullscreen Split) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Learning Materials & Quiz Pages (Full Workspace) */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/materials/:courseId" element={<LearningMaterials />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/quiz-result/:attemptId" element={<QuizResult />} />
          </Route>

          {/* Student Dashboard Portal */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<DashboardLayout title="Student Dashboard" />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/certificates" element={<Certificates />} />
            </Route>
          </Route>

          {/* Instructor Portal */}
          <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} />}>
            <Route element={<DashboardLayout title="Instructor Portal" />}>
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/instructor/courses" element={<InstructorCourses />} />
              <Route path="/instructor/courses/create" element={<CreateCourse />} />
              <Route path="/instructor/courses/:id" element={<ManageCourse />} />
            </Route>
          </Route>

          {/* Admin Portal */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout title="Admin Control Center" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
