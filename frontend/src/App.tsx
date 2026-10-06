import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { ContextBar } from './components/layout/ContextBar';
import { Footer } from './components/layout/Footer';
import { RoleSwitcher } from './components/common/RoleSwitcher';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { RegisterClubPage } from './pages/public/RegisterClubPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { ForbiddenPage } from './pages/public/ForbiddenPage';

import { ClubDirectoryPage } from './pages/clubs/ClubDirectoryPage';
import { ClubDetailPage } from './pages/clubs/ClubDetailPage';

import { BillboardPage } from './pages/activities/BillboardPage';
import { ActivityDetailPage } from './pages/activities/ActivityDetailPage';

import { ProfilePage } from './pages/student/ProfilePage';
import { MyClubsPage } from './pages/student/MyClubsPage';
import { MyRegistrationsPage } from './pages/student/MyRegistrationsPage';

import { ClubProfileEditPage } from './pages/directive/ClubProfileEditPage';
import { ClubImagesEditPage } from './pages/directive/ClubImagesEditPage';
import { ClubAdmissionEditPage } from './pages/directive/ClubAdmissionEditPage';
import { ClubRequestsPage } from './pages/directive/ClubRequestsPage';
import { ClubMembersPage } from './pages/directive/ClubMembersPage';
import { ClubActivitiesManagePage } from './pages/directive/ClubActivitiesManagePage';
import { AttendancePage } from './pages/directive/AttendancePage';
import { ClubBoardManagePage } from './pages/directive/ClubBoardManagePage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminClubsPage } from './pages/admin/AdminClubsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

// Route Guards
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole } = useAuth();
  if (activeRole !== 'admin') {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

const DirectiveRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole, currentUser } = useAuth();
  if (activeRole !== 'directive' && !currentUser?.managedClubId && activeRole !== 'admin') {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="page-wrapper">
      <Header />
      <ContextBar />

      <main className="main-content">
        <Routes>
          {/* Public & Common Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/registro-club" element={<RegisterClubPage />} />
          <Route path="/directorio" element={<ClubDirectoryPage />} />
          <Route path="/clubes/:id" element={<ClubDetailPage />} />
          <Route path="/cartelera" element={<BillboardPage />} />
          <Route path="/actividades/:id" element={<ActivityDetailPage />} />

          {/* Student Protected Routes */}
          <Route path="/mi-cuenta" element={<ProfilePage />} />
          <Route path="/mis-clubes" element={<MyClubsPage />} />
          <Route path="/mis-inscripciones" element={<MyRegistrationsPage />} />

          {/* Directive Management Routes */}
          <Route path="/gestion-club/:clubId/perfil" element={<DirectiveRoute><ClubProfileEditPage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/imagenes" element={<DirectiveRoute><ClubImagesEditPage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/ingreso" element={<DirectiveRoute><ClubAdmissionEditPage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/solicitudes" element={<DirectiveRoute><ClubRequestsPage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/miembros" element={<DirectiveRoute><ClubMembersPage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/actividades" element={<DirectiveRoute><ClubActivitiesManagePage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/actividades/:actId/asistencia" element={<DirectiveRoute><AttendancePage /></DirectiveRoute>} />
          <Route path="/gestion-club/:clubId/tablon" element={<DirectiveRoute><ClubBoardManagePage /></DirectiveRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/tablero" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/clubes" element={<AdminRoute><AdminClubsPage /></AdminRoute>} />
          <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/reportes" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />

          {/* Error & Fallbacks */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <RoleSwitcher />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
