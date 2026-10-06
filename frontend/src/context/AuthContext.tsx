import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  activeRole: UserRole;
  isLoggedIn: boolean;
  isBlocked: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (data: {
    code: string;
    email: string;
    fullName: string;
    career: string;
    cycle: number;
    password?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string | null) => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
  allUsers: User[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const user = storageService.getCurrentUser();
    return user ? user.role : 'visitor';
  });
  const [allUsers, setAllUsers] = useState<User[]>(() => storageService.getUsers());

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

  const login = (email: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    
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

  const register = (data: {
    code: string;
    email: string;
    fullName: string;
    career: string;
    cycle: number;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@aloe.ulima.edu.pe')) {
      return { success: false, error: 'El correo debe pertenecer al dominio institucional @aloe.ulima.edu.pe' };
    }

    if (!/^\d{8}$/.test(data.code.trim())) {
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
      cycle: data.cycle,
      role: 'student',
      isBlocked: false,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}&backgroundColor=6B2FA8`,
      interests: ['Tecnología', 'Académico']
    });

    storageService.setCurrentUser(newUser);
    setCurrentUser(newUser);
    setActiveRole('student');
    refreshUsers();
    return { success: true };
  };

  const logout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveRole('visitor');
  };

  const switchUser = (userId: string | null) => {
    if (!userId) {
      logout();
      return;
    }
    const user = storageService.getUserById(userId);
    if (user) {
      storageService.setCurrentUser(user);
      setCurrentUser(user);
      setActiveRole(user.role);
      refreshUsers();
    }
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
  };

  const updateCurrentUser = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updatedData };
    storageService.updateUser(updated);
    setCurrentUser(updated);
    refreshUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        isLoggedIn: currentUser !== null,
        isBlocked: !!currentUser?.isBlocked,
        login,
        register,
        logout,
        switchUser,
        switchRole,
        updateCurrentUser,
        allUsers,
        refreshUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
