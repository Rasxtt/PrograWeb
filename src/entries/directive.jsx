// src/entries/directive.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import './web.css';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/AuthContext.jsx';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { RoleSwitcher } from '../components/common/RoleSwitcher.jsx';

import { DirectiveMyClubsPage } from '../pages/directive/DirectiveMyClubsPage.jsx';
import { ClubProfileEditPage } from '../pages/directive/ClubProfileEditPage.jsx';
import { ClubImagesPage } from '../pages/directive/ClubImagesPage.jsx';
import { ClubAdmissionConfigPage } from '../pages/directive/ClubAdmissionConfigPage.jsx';
import { ClubRequestsPage } from '../pages/directive/ClubRequestsPage.jsx';
import { ClubMembersPage } from '../pages/directive/ClubMembersPage.jsx';
import { ClubActivitiesManagePage } from '../pages/directive/ClubActivitiesManagePage.jsx';
import { NewActivityPage } from '../pages/directive/NewActivityPage.jsx';
import { ActivityAttendeesPage } from '../pages/directive/ActivityAttendeesPage.jsx';
import { AttendancePage } from '../pages/directive/AttendancePage.jsx';
import { ClubBoardManagePage } from '../pages/directive/ClubBoardManagePage.jsx';
import { AnnouncementDetailPage } from '../pages/directive/AnnouncementDetailPage.jsx';
import { ClubDetailPage } from '../pages/clubs/ClubDetailPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';

export const DirectiveApp = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Header />
        <main className="flex-grow-1 d-flex flex-column">
          <Routes>
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
            <Route path="/tablon/:id" element={<ClubBoardManagePage />} />
            <Route path="/tablon/:clubId/anuncio/:postId" element={<AnnouncementDetailPage />} />
            <Route path="/club/:id" element={<ClubDetailPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <RoleSwitcher />
      </div>
    </BrowserRouter>
  );
};

const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <AuthProvider>
        <DirectiveApp />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </React.StrictMode>
  );
}
export default DirectiveApp;
