import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Configuration de l'instance Axios
// Utilise VITE_API_URL pour Docker (proxy nginx) ou VITE_API_BASE_URL pour développement direct
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/v1` 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT dans les headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401 (non authentifié)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Rediriger vers login (sera géré par le router)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

