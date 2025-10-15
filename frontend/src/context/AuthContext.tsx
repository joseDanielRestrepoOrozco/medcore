import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: string | number;
  email?: string;
  fullname?: string;
  status?: string;
  role: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (newToken: string, newUser?: User) => {
    setToken(newToken);
    if (newUser) setUser(newUser);
  };

  const logout = () => {
    try {
      // Requisito: eliminar datos de navegación en Application/Local storage
      localStorage.clear();
    } catch (_) {
      // ignore
    }
    setToken(null);
    setUser(null);
    // Requisito: redireccionar a la landing page
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
