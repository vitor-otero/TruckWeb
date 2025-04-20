<template>
  <div class="truck-stops-view">
    <TruckStopMap 
      class="map" 
      @truck-stop-selected="handleTruckStopSelected"
    />
    
    <div class="content-section">
      <header class="header">
        <h1>Truck Stops</h1>
        <button v-if="isAuthenticated" @click="showAddForm = !showAddForm" class="add-button">
          {{ showAddForm ? 'Close Form' : 'Add New Stop' }}
        </button>
      </header>

      <AddTruckStop
        v-if="showAddForm"
        class="add-form"
        @created="handleStopCreated"
      />

      <TruckStopReviews
        v-if="selectedTruckStop"
        :truck-stop-id="selectedTruckStop.id"
        class="reviews-section"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import AddTruckStop from '../components/AddTruckStop.vue';
import TruckStopMap from '../components/TruckStopMap.vue';
import TruckStopReviews from '../components/TruckStopReviews.vue';
import type { TruckStop } from '../types/truckStop';

const authStore = useAuthStore();
const showAddForm = ref(false);
const selectedTruckStop = ref<TruckStop | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);

function handleStopCreated() {
  showAddForm.value = false;
}

function handleTruckStopSelected(truckStop: TruckStop) {
  selectedTruckStop.value = truckStop;
}
</script>

<style scoped>
.truck-stops-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.map {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-section {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #45a049;
}

.add-form {
  margin-bottom: 2rem;
}

.reviews-section {
  margin-top: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
