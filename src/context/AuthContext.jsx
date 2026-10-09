import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const [activeRole, setActiveRole] = useState(() => {
    const user = storageService.getCurrentUser();
    return user ? user.role : 'visitor';
  });
  const [activeDirectiveClubId, setActiveDirectiveClubId] = useState('club-robotica');
  const [allUsers, setAllUsers] = useState(() => storageService.getUsers());

  const refreshUsers = () => {
    setAllUsers(storageService.getUsers());
    const refreshedCurrent = storageService.getCurrentUser();
    setCurrentUser(refreshedCurrent);
    if (refreshedCurrent) {
      setActiveRole(refreshedCurrent.role);
    }
  };

  useEffect(() => {
    storageService.init();
    refreshUsers();
  }, []);

  const login = (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Check institucional domain validation
    if (!cleanEmail.endsWith('@aloe.ulima.edu.pe') && cleanEmail !== 'admin@aloe.ulima.edu.pe') {
      return { success: false, error: 'Debe ingresar un correo institucional válido (@aloe.ulima.edu.pe).' };
    }

    const found = storageService.getUserByEmail(cleanEmail);
    if (!found) {
      return { success: false, error: 'Usuario no registrado con este correo institucional.' };
    }

    if (found.isBlocked) {
      storageService.setCurrentUser(found);
      setCurrentUser(found);
      setActiveRole(found.role);
      return { success: false, error: `Tu cuenta se encuentra bloqueada: ${found.blockReason || 'Consulta con Bienestar Estudiantil.'}` };
    }

    storageService.setCurrentUser(found);
    setCurrentUser(found);
    setActiveRole(found.role);
    refreshUsers();
    return { success: true };
  };

  const register = (data) => {
    const cleanEmail = (data.email || '').trim().toLowerCase();

    if (!cleanEmail.endsWith('@aloe.ulima.edu.pe')) {
      return { success: false, error: 'El correo debe pertenecer al dominio institucional @aloe.ulima.edu.pe' };
    }

    if (!/^\d{8}$/.test((data.code || '').trim())) {
      return { success: false, error: 'El código de alumno debe contener exactamente 8 dígitos numéricos.' };
    }

    const existing = storageService.getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    const newUser = storageService.createUser({
      code: data.code.trim(),
      email: cleanEmail,
      fullName: data.fullName.trim(),
      career: data.career,
      cycle: Number(data.cycle) || 1,
      role: 'student',
      isBlocked: false,
      createdAt: new Date().toISOString()
    });

    storageService.setCurrentUser(newUser);
    setCurrentUser(newUser);
    setActiveRole('student');
    refreshUsers();

    return { success: true, user: newUser };
  };

  const logout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveRole('visitor');
  };

  const switchUser = (userId) => {
    if (!userId) {
      logout();
      return;
    }
    const target = storageService.getUserById(userId);
    if (target) {
      storageService.setCurrentUser(target);
      setCurrentUser(target);
      setActiveRole(target.role);
    }
  };

  const switchRole = (role) => {
    setActiveRole(role);
    if (role === 'visitor') {
      // Don't erase user completely, just perspective
    } else if (role === 'admin') {
      const adminUser = storageService.getUserById('user-admin') || {
        id: 'user-admin',
        fullName: 'Bienestar Estudiantil',
        email: 'admin@aloe.ulima.edu.pe',
        role: 'admin',
        isBlocked: false
      };
      storageService.setCurrentUser(adminUser);
      setCurrentUser(adminUser);
    } else if (role === 'directive') {
      const directiveUser = storageService.getUserById('user-sofia') || {
        id: 'user-sofia',
        fullName: 'Sofía Vega',
        email: 'svega@aloe.ulima.edu.pe',
        role: 'directive',
        isBlocked: false
      };
      storageService.setCurrentUser(directiveUser);
      setCurrentUser(directiveUser);
      setActiveDirectiveClubId('club-robotica');
    } else if (role === 'student') {
      const studentUser = storageService.getUserById('user-camila') || {
        id: 'user-camila',
        fullName: 'Camila Quispe',
        email: 'cquispe@aloe.ulima.edu.pe',
        role: 'student',
        isBlocked: false
      };
      storageService.setCurrentUser(studentUser);
      setCurrentUser(studentUser);
    }
  };

  const updateCurrentUser = (updatedUser) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...updatedUser };
    storageService.updateUser(merged);
    setCurrentUser(merged);
    refreshUsers();
  };

  const value = {
    currentUser,
    activeRole,
    isLoggedIn: !!currentUser && activeRole !== 'visitor',
    isBlocked: !!currentUser?.isBlocked,
    activeDirectiveClubId,
    setActiveDirectiveClubId,
    login,
    register,
    logout,
    switchUser,
    switchRole,
    updateCurrentUser,
    allUsers,
    refreshUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
