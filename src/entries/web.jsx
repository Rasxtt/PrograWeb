// src/entries/web.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import { LandingPage } from '../pages/public/LandingPage.jsx';
import { ClubDirectoryPage } from '../pages/clubs/ClubDirectoryPage.jsx';
import { BillboardPage } from '../pages/activities/BillboardPage.jsx';
import { ClubDetailPage } from '../pages/clubs/ClubDetailPage.jsx';
import { ActivityDetailPage } from '../pages/activities/ActivityDetailPage.jsx';
import { LoginPage } from '../pages/public/LoginPage.jsx';
import { RegisterPage } from '../pages/public/RegisterPage.jsx';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage.jsx';
import { RegisterClubPage } from '../pages/public/RegisterClubPage.jsx';
import { ForbiddenPage } from '../pages/public/ForbiddenPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';

export const WebApp = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Header />
        <main className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/directorio" element={<ClubDirectoryPage />} />
            <Route path="/cartelera" element={<BillboardPage />} />
            <Route path="/club/:id" element={<ClubDetailPage />} />
            <Route path="/actividad/:id" element={<ActivityDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
            <Route path="/registrar-club" element={<RegisterClubPage />} />
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

const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <AuthProvider>
        <WebApp />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </React.StrictMode>
  );
}
export default WebApp;