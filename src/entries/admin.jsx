// src/entries/admin.jsx
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

import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.jsx';
import { AdminClubsPage } from '../pages/admin/AdminClubsPage.jsx';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage.jsx';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';

export const AdminApp = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Header />
        <main className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/admin" element={<Navigate to="/admin/tablero" replace />} />
            <Route path="/admin/tablero" element={<AdminDashboardPage />} />
            <Route path="/admin/clubes" element={<AdminClubsPage />} />
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/admin/reportes" element={<AdminReportsPage />} />
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
        <AdminApp />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </React.StrictMode>
  );
}
export default AdminApp;