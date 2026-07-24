import { User } from '@/types';

export const saveAuth = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
};
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0';
};
export const isAuthenticated = (): boolean => !!getToken();
export const isAdmin = (): boolean => getUser()?.role === 'admin';