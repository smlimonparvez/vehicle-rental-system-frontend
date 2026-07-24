'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getToken, getUser, saveAuth, clearAuth } from '@/lib/auth';

interface AuthContextType {
  user: User | null; token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void; isLoading: boolean;
}
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = getToken(); const u = getUser();
    if (t && u) { setToken(t); setUser(u); }
    setIsLoading(false);
  }, []);

  const login  = (token: string, user: User) => { saveAuth(token, user); setToken(token); setUser(user); };
  const logout = () => { clearAuth(); setToken(null); setUser(null); };

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);