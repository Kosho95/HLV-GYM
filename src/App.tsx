import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GymProvider } from './context/GymContext';
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

        {/* Admin Back-office */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="therapy" element={<AdminTherapy />} />
        </Route>

        {/* Self-service Reception Kiosk */}
        <Route path="/kiosk" element={<KioskPage />} />

        {/* Student Portal */}
        <Route path="/student" element={<StudentPortal />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GymProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GymProvider>
  );
};

export default App;
