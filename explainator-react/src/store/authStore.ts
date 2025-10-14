/**
 * Authentication Store (Zustand)
 * Manages user authentication state and tokens
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
// NOTE: Temporarily commented out to avoid import errors while auth is not used
// Uncomment when implementing backend authentication
// import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

// Temporary type definitions (remove when uncommenting imports above)
type User = any;
type AuthResponse = any;
type LoginCredentials = any;
type RegisterCredentials = any;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (credentials: RegisterCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Register new user
       */
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post<{ success: boolean; data: AuthResponse }>(
            `${API_URL}/auth/register`,
            credentials
          );

          const { user, accessToken, refreshToken } = response.data.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      /**
       * Login user
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post<{ success: boolean; data: AuthResponse }>(
            `${API_URL}/auth/login`,
            credentials
          );

          const { user, accessToken, refreshToken } = response.data.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      /**
       * Logout user
       */
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Refresh access token using refresh token
       */
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await axios.post<{ success: boolean; data: Omit<AuthResponse, 'refreshToken'> }>(
            `${API_URL}/auth/refresh`,
            { refreshToken }
          );

          const { user, accessToken } = response.data.data;

          set({
            user,
            accessToken,
            isAuthenticated: true,
          });
        } catch (error: any) {
          // If refresh fails, logout user
          get().logout();
          throw new Error('Session expired. Please login again.');
        }
      },

      /**
       * Fetch current user (verify token and get latest user data)
       */
      fetchCurrentUser: async () => {
        const { accessToken } = get();

        if (!accessToken) {
          return;
        }

        try {
          const response = await axios.get<{ success: boolean; data: User }>(
            `${API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          set({
            user: response.data.data,
            isAuthenticated: true,
          });
        } catch (error: any) {
          // Token might be expired, try refreshing
          try {
            await get().refreshAccessToken();
            await get().fetchCurrentUser(); // Retry fetching user
          } catch (refreshError) {
            get().logout();
          }
        }
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'explainator-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Axios interceptor to automatically add auth token
 */
axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token && config.url?.startsWith(API_URL)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Axios interceptor to handle 401 errors (auto-refresh token)
 */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try refreshing token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshAccessToken();
        // Retry original request with new token
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
