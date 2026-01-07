import { create } from 'zustand';
import api from '../services/api';
import { extractApiError } from '../utils/errorHandling';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  register: async (username, email, password, password2) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register/', {
        username,
        email,
        password,
        password2,
      });

      const { user, tokens } = response.data;
      console.log(user);
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = extractApiError(error, 'Error al registrarse');
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login/', { username, password });

      const { user, tokens } = response.data;
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = extractApiError(error, 'Credenciales inválidas');
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch {
      // limpia storage
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await api.get('/auth/me/');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
