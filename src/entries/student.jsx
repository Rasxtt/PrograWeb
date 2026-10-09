// src/entries/student.jsx
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

import { ProfilePage } from '../pages/student/ProfilePage.jsx';
import { MyClubsPage } from '../pages/student/MyClubsPage.jsx';
import { MyRegistrationsPage } from '../pages/student/MyRegistrationsPage.jsx';
import { ClubBoardManagePage } from '../pages/directive/ClubBoardManagePage.jsx';
import { AnnouncementDetailPage } from '../pages/directive/AnnouncementDetailPage.jsx';
import { ClubDirectoryPage } from '../pages/clubs/ClubDirectoryPage.jsx';
import { ClubDetailPage } from '../pages/clubs/ClubDetailPage.jsx';
import { BillboardPage } from '../pages/activities/BillboardPage.jsx';
import { ActivityDetailPage } from '../pages/activities/ActivityDetailPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';

export const StudentApp = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Header />
        <main className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/mi-cuenta" element={<ProfilePage />} />
            <Route path="/mis-clubes" element={<MyClubsPage />} />
            <Route path="/mis-inscripciones" element={<MyRegistrationsPage />} />
            <Route path="/tablon/:id" element={<ClubBoardManagePage />} />
            <Route path="/tablon/:clubId/anuncio/:postId" element={<AnnouncementDetailPage />} />
            
            {/* Rutas compartidas de navegación estudiantil */}
            <Route path="/directorio" element={<ClubDirectoryPage />} />
            <Route path="/club/:id" element={<ClubDetailPage />} />
            <Route path="/cartelera" element={<BillboardPage />} />
            <Route path="/actividad/:id" element={<ActivityDetailPage />} />

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
        <StudentApp />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </React.StrictMode>
  );
}
export default StudentApp;
