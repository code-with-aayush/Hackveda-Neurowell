import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Sessions from './pages/Sessions';
import NewSession from './pages/NewSession';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes (Protected) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<NewSession />} /> {/* Default: New Session */}
            <Route path="live-session" element={<Dashboard />} /> {/* Live Monitor */}
            <Route path="patients" element={<Patients />} />
            <Route path="sessions" element={<Sessions />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
