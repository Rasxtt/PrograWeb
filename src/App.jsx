import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { RoleSwitcher } from './components/common/RoleSwitcher.jsx';

// Public pages
import { LandingPage } from './pages/public/LandingPage.jsx';
import { LoginPage } from './pages/public/LoginPage.jsx';
import { RegisterPage } from './pages/public/RegisterPage.jsx';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage.jsx';
import { RegisterClubPage } from './pages/public/RegisterClubPage.jsx';
import { ForbiddenPage } from './pages/public/ForbiddenPage.jsx';
import { NotFoundPage } from './pages/public/NotFoundPage.jsx';

// Clubs & Activities
import { ClubDirectoryPage } from './pages/clubs/ClubDirectoryPage.jsx';
import { ClubDetailPage } from './pages/clubs/ClubDetailPage.jsx';
import { BillboardPage } from './pages/activities/BillboardPage.jsx';
import { ActivityDetailPage } from './pages/activities/ActivityDetailPage.jsx';

// Student pages
import { ProfilePage } from './pages/student/ProfilePage.jsx';
import { MyClubsPage } from './pages/student/MyClubsPage.jsx';
import { MyRegistrationsPage } from './pages/student/MyRegistrationsPage.jsx';

// Directive pages
import { DirectiveMyClubsPage } from './pages/directive/DirectiveMyClubsPage.jsx';
import { ClubProfileEditPage } from './pages/directive/ClubProfileEditPage.jsx';
import { ClubImagesPage } from './pages/directive/ClubImagesPage.jsx';
import { ClubAdmissionConfigPage } from './pages/directive/ClubAdmissionConfigPage.jsx';
import { ClubRequestsPage } from './pages/directive/ClubRequestsPage.jsx';
import { ClubMembersPage } from './pages/directive/ClubMembersPage.jsx';
import { ClubActivitiesManagePage } from './pages/directive/ClubActivitiesManagePage.jsx';
import { NewActivityPage } from './pages/directive/NewActivityPage.jsx';
import { ActivityAttendeesPage } from './pages/directive/ActivityAttendeesPage.jsx';
import { AttendancePage } from './pages/directive/AttendancePage.jsx';
import { ClubBoardManagePage } from './pages/directive/ClubBoardManagePage.jsx';
import { AnnouncementDetailPage } from './pages/directive/AnnouncementDetailPage.jsx';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { AdminClubsPage } from './pages/admin/AdminClubsPage.jsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.jsx';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Header />

        <main className="flex-grow-1 d-flex flex-column">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/directorio" element={<ClubDirectoryPage />} />
            <Route path="/cartelera" element={<BillboardPage />} />
            <Route path="/club/:id" element={<ClubDetailPage />} />
            <Route path="/actividad/:id" element={<ActivityDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
            <Route path="/registrar-club" element={<RegisterClubPage />} />

            {/* Student */}
            <Route path="/mi-cuenta" element={<ProfilePage />} />
            <Route path="/mis-clubes" element={<MyClubsPage />} />
            <Route path="/mis-inscripciones" element={<MyRegistrationsPage />} />
            <Route path="/tablon/:id" element={<ClubBoardManagePage />} />
            <Route path="/tablon/:clubId/anuncio/:postId" element={<AnnouncementDetailPage />} />

            {/* Directive */}
            <Route path="/mis-clubes-directiva" element={<DirectiveMyClubsPage />} />
            <Route path="/club-admin/:id/perfil" element={<ClubProfileEditPage />} />
            <Route path="/club-admin/:id/imagenes" element={<ClubImagesPage />} />
            <Route path="/club-admin/:id/ingreso" element={<ClubAdmissionConfigPage />} />
            <Route path="/club-admin/:id/solicitudes" element={<ClubRequestsPage />} />
            <Route path="/club-admin/:id/miembros" element={<ClubMembersPage />} />
            <Route path="/club-admin/:id/actividades" element={<ClubActivitiesManagePage />} />
            <Route path="/club-admin/:id/actividades/nueva" element={<NewActivityPage />} />
            <Route path="/club-admin/:id/actividades/:actId/inscritos" element={<ActivityAttendeesPage />} />
            <Route path="/club-admin/:id/actividades/:actId/asistencia" element={<AttendancePage />} />
            <Route path="/club-admin/:id/tablon" element={<ClubBoardManagePage />} />

            {/* Admin */}
            <Route path="/admin" element={<Navigate to="/admin/tablero" replace />} />
            <Route path="/admin/tablero" element={<AdminDashboardPage />} />
            <Route path="/admin/clubes" element={<AdminClubsPage />} />
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/admin/reportes" element={<AdminReportsPage />} />

            {/* Errors */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <RoleSwitcher />
      </div>
    </BrowserRouter>
  );
};
export default App;
