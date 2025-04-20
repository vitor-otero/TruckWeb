<template>
  <div class="home-container">
    <header class="header">
      <h1>Welcome, {{ authStore.currentUser?.name }}</h1>
      <div class="header-actions">
        <router-link to="/truck-stops" class="nav-link">Truck Stops</router-link>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>
    <main class="main-content">
      <div class="features-grid">
        <div class="feature-card">
          <h3>Find Truck Stops</h3>
          <p>Discover nearby truck stops with amenities like food, showers, and parking.</p>
          <router-link to="/truck-stops" class="feature-link">View Map</router-link>
        </div>
        
        <div class="feature-card">
          <h3>Share Your Experience</h3>
          <p>Help other drivers by adding new stops and leaving reviews.</p>
          <router-link to="/truck-stops" class="feature-link">Add Stop</router-link>
        </div>
      </div>
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #4CAF50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #e8f5e9;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.feature-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.feature-link:hover {
  background-color: #45a049;
}
</style>
