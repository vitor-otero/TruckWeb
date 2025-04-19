<template>
  <div class="home-container">
    <header class="header">
      <h1>Welcome, {{ authStore.currentUser?.name }}</h1>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </header>
    <main class="main-content">
      <h2>Dashboard</h2>
      <div class="token-section">
        <h3>Your Authentication Token:</h3>
        <div class="token-display">
          <code>{{ authStore.token }}</code>
        </div>
      </div>
      <p>Welcome to your TruckAPI dashboard. This is where you can manage your trucking operations.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c82333;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.token-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.token-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.token-display {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  overflow-x: auto;
}

.token-display code {
  font-family: Monaco, "Courier New", monospace;
  font-size: 0.9rem;
  color: #495057;
  word-break: break-all;
}
</style>
