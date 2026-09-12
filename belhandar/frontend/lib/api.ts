// Merkezi API istemcisi - Backend ile tüm iletişim buradan geçer
'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_URL });

// Her isteğe JWT token'ı otomatik ekle
api.interceptors.request.use((config) => {
  const token = Cookies.get('belhandar_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 hatası alındığında oturumu sonlandır
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('belhandar_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
