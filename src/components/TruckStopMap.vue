<template>
  <div class="map-container">
    <div ref="mapRef" class="map"></div>
    <div class="search-controls">
      <button @click="getCurrentLocation" :disabled="loading">
        {{ loading ? 'Getting Location...' : 'Use My Location' }}
      </button>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineEmits } from 'vue';
import { useTruckStopStore } from '../stores/truckStop';
import type { TruckStop } from '../types/truckStop';
import 'leaflet/dist/leaflet.css';
import type { Map, LayerGroup, Marker } from 'leaflet';
import L from 'leaflet';

const emit = defineEmits<{
  (e: 'truck-stop-selected', truckStop: TruckStop): void
}>();

// Component state
const mapRef = ref<HTMLElement | null>(null);
const mapInstance = ref<Map | null>(null);
const markerLayer = ref<LayerGroup | null>(null);
const loading = ref(false);
const error = ref('');

const store = useTruckStopStore();

// Watch for store changes
watch(() => store.truckStops, (stops) => {
  if (stops) {
    updateMarkers(stops);
  }
}, { deep: true });

// Initialize map when component mounts
onMounted(() => {
  if (mapRef.value) {
    initializeMap();
    getCurrentLocation();
  }
});

// Cleanup when component unmounts
onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});

// Initialize map
function initializeMap() {
  if (!mapRef.value) return;

  // Create map instance
  const map = L.map(mapRef.value, {
    center: [0, 0],
    zoom: 2
  });

  // Add OpenStreetMap layer
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  });
  tileLayer.addTo(map);

  // Create marker layer
  const markers = L.layerGroup();
  markers.addTo(map);

  mapInstance.value = map;
  markerLayer.value = markers;
}

// Get current location and load nearby truck stops
async function getCurrentLocation() {
  loading.value = true;
  error.value = '';

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000
      });
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (mapInstance.value) {
      mapInstance.value.setView([lat, lng], 13);
    }

    // Use a default radius of 5km
    await store.fetchNearbyTruckStops(lat, lng, 5);
  } catch (err) {
    console.error('Error getting location:', err);
    error.value = 'Could not get your location. Please try again.';
  } finally {
    loading.value = false;
  }
}

// Update map markers
function updateMarkers(stops: TruckStop[]) {
  if (!markerLayer.value || !mapInstance.value) return;

  // Clear existing markers
  markerLayer.value.clearLayers();

  // Add new markers
  stops.forEach((stop) => {
    const content = `
      <div class="marker-content">
        <h3>${stop.name}</h3>
        <p>${stop.description}</p>
        <p>Rating: ${stop.averageRating?.toFixed(1) || 'No ratings'}</p>
        <div class="amenities">
          ${stop.hasFood ? '🍽️ Food ' : ''}
          ${stop.hasShower ? '🚿 Shower ' : ''}
          ${stop.hasParking ? '🅿️ Parking' : ''}
        </div>
        <button class="view-reviews-btn">View & Add Reviews</button>
      </div>
    `;

    if (markerLayer.value) {
      const marker: Marker = L.marker([stop.latitude, stop.longitude]);
      marker.bindPopup(content);
      marker.on('popupopen', () => {
        // Add click handler for the review button
        setTimeout(() => {
          const btn = document.querySelector('.view-reviews-btn');
          if (btn) {
            btn.addEventListener('click', () => {
              emit('truck-stop-selected', stop);
              marker.closePopup();
            });
          }
        }, 0);
      });
      markerLayer.value.addLayer(marker);
    }
  });
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.search-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  color: #dc3545;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.marker-content) {
  text-align: center;
}

:deep(.view-reviews-btn) {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

:deep(.view-reviews-btn:hover) {
  background-color: #45a049;
}

:deep(.amenities) {
  margin: 8px 0;
  font-size: 1.2rem;
}
</style>
