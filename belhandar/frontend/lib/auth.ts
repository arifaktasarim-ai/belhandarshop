// Kimlik doğrulama yardımcı fonksiyonları (client-side)
'use client';

import Cookies from 'js-cookie';
import api from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  Cookies.set('belhandar_token', data.token, { expires: 7 });
  Cookies.set('belhandar_user', JSON.stringify(data.user), { expires: 7 });
  return data.user as AuthUser;
}

export function logoutUser() {
  Cookies.remove('belhandar_token');
  Cookies.remove('belhandar_user');
  window.location.href = '/admin/login';
}

export function getCurrentUser(): AuthUser | null {
  const raw = Cookies.get('belhandar_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!Cookies.get('belhandar_token');
}
