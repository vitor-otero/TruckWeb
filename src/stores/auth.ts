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
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const currentUser = computed(() => user.value);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/api/users/login', { email, password });
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
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
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
