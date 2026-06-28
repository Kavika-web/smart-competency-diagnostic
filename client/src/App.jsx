import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import ProtectedRoute from './components/ProtectedRoute';
import Results from './pages/Results';
import Jobs from './pages/Jobs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/assessment" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Assessment />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Results />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Jobs />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;