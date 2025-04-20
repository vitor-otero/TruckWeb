import { defineStore } from 'pinia';
import api from '../api/config';
import { ref, computed } from 'vue';

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  
  // Initialize from localStorage if available
  try {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser);
      token.value = savedToken;
    }
  } catch (e) {
    console.error('Error loading auth state:', e);
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const currentUser = computed(() => user.value);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/api/users/login', { email, password });
      // Set state first
      user.value = response.data.user;
      token.value = response.data.token;
      // Then try to persist to localStorage
      try {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      } catch (e) {
        console.warn('Could not save auth state to localStorage:', e);
      }
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      await api.post('/api/users/register', { name, email, password });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  function logout() {
    // Clear state first
    user.value = null;
    token.value = null;
    // Then try to clear localStorage
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (e) {
      console.warn('Could not clear auth state from localStorage:', e);
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout
  };
});
