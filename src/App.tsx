import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GymProvider } from './context/GymContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { AdminLayout } from './components/layout/AdminLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminSchedule } from './pages/admin/AdminSchedule';
import { AdminTherapy } from './pages/admin/AdminTherapy';
import { KioskPage } from './pages/KioskPage';
import { StudentPortal } from './pages/StudentPortal';
import { LoginPage } from './pages/LoginPage';
import { useGym } from './context/GymContext';

// Protected Route for Trainers
const TrainerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useGym();
  if (currentUser.role !== 'TRAINER') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Protected Route for Students (or Trainers inspecting student view)
const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useGym();
  if (currentUser.role === 'GUEST') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Component to conditionally show Navbar (Kiosk page is dedicated full-screen tablet mode)
const AppContent: React.FC = () => {
  const location = useLocation();
  const isKiosk = location.pathname.startsWith('/kiosk');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {!isKiosk && <Navbar />}
      <Routes>
        {/* Landing Portal */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Back-office (Protected for HLV) */}
        <Route path="/admin" element={
          <TrainerRoute>
            <AdminLayout />
          </TrainerRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="therapy" element={<AdminTherapy />} />
        </Route>

        {/* Self-service Reception Kiosk */}
        <Route path="/kiosk" element={<KioskPage />} />

        {/* Student Portal (Protected for Student or Trainer) */}
        <Route path="/student" element={
          <StudentRoute>
            <StudentPortal />
          </StudentRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GymProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GymProvider>
    </ThemeProvider>
  );
};

export default App;
