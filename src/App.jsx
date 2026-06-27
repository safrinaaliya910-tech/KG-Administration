// Main App component with routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import HODLogin from './pages/HODLogin';
import FacultyLogin from './pages/FacultyLogin';
import Register from './pages/Register';
import SetupUsers from './pages/SetupUsers';

// HOD pages
import HODDashboard from './pages/hod/HODDashboard';
import CreateTask from './pages/hod/CreateTask';
import Submissions from './pages/hod/Submissions';

// Faculty pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import SubmitTask from './pages/faculty/SubmitTask';
import Profile from './pages/faculty/Profile';

// Component to handle redirect after login
const AppRouter = () => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - redirect if already logged in */}
      <Route
        path="/"
        element={
          currentUser && userData ? (
            <Navigate
              to={userData.role === 'hod' ? '/hod/dashboard' : '/faculty/dashboard'}
              replace
            />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/login/hod"
        element={
          currentUser && userData ? (
            <Navigate
              to={userData.role === 'hod' ? '/hod/dashboard' : '/faculty/dashboard'}
              replace
            />
          ) : (
            <HODLogin />
          )
        }
      />
      <Route
        path="/login/faculty"
        element={
          currentUser && userData ? (
            <Navigate
              to={userData.role === 'hod' ? '/hod/dashboard' : '/faculty/dashboard'}
              replace
            />
          ) : (
            <FacultyLogin />
          )
        }
      />
      <Route
        path="/register"
        element={
          currentUser && userData ? (
            <Navigate
              to={userData.role === 'hod' ? '/hod/dashboard' : '/faculty/dashboard'}
              replace
            />
          ) : (
            <Register />
          )
        }
      />
      <Route path="/setup" element={<SetupUsers />} />

      {/* HOD routes */}
      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute requiredRole="hod">
            <HODDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hod/create-task"
        element={
          <ProtectedRoute requiredRole="hod">
            <CreateTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hod/submissions"
        element={
          <ProtectedRoute requiredRole="hod">
            <Submissions />
          </ProtectedRoute>
        }
      />

      {/* Faculty routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/submit/:taskId"
        element={
          <ProtectedRoute requiredRole="faculty">
            <SubmitTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/profile"
        element={
          <ProtectedRoute requiredRole="faculty">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;
