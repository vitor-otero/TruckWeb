<template>
  <div class="add-truck-stop">
    <h2>Add New Truck Stop</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required 
          placeholder="Enter truck stop name"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="form.description" 
          required 
          placeholder="Enter description"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="latitude">Latitude</label>
          <input 
            type="number" 
            id="latitude" 
            v-model="form.latitude" 
            required 
            step="any"
          />
        </div>

        <div class="form-group">
          <label for="longitude">Longitude</label>
          <input 
            type="number" 
            id="longitude" 
            v-model="form.longitude" 
            required 
            step="any"
          />
        </div>
      </div>

      <div class="amenities">
        <label>Amenities:</label>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="form.hasFood" />
            Food Available
          </label>
          <label>
            <input type="checkbox" v-model="form.hasShower" />
            Shower Available
          </label>
          <label>
            <input type="checkbox" v-model="form.hasParking" />
            Truck Parking
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="photos">Photos (URLs, one per line)</label>
        <textarea 
          id="photos" 
          v-model="photosText" 
          placeholder="Enter photo URLs, one per line"
        ></textarea>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Truck Stop' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTruckStopStore } from '../stores/truckStop';
import type { CreateTruckStopDto } from '../types/truckStop';

const truckStopStore = useTruckStopStore();
const loading = ref(false);
const error = ref('');
const photosText = ref('');

const form = ref<CreateTruckStopDto>({
  name: '',
  description: '',
  latitude: 0,
  longitude: 0,
  hasFood: false,
  hasShower: false,
  hasParking: false,
  photos: [],
});

const photos = computed(() => {
  return photosText.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0);
});

async function handleSubmit() {
  loading.value = true;
  error.value = '';

  // Validate required fields
  if (!form.value.name || !form.value.description || !form.value.latitude || !form.value.longitude) {
    error.value = 'Please fill in all required fields';
    loading.value = false;
    return;
  }

  // Validate coordinates
  if (form.value.latitude < -90 || form.value.latitude > 90) {
    error.value = 'Latitude must be between -90 and 90';
    loading.value = false;
    return;
  }
  if (form.value.longitude < -180 || form.value.longitude > 180) {
    error.value = 'Longitude must be between -180 and 180';
    loading.value = false;
    return;
  }

  try {
    const data = {
      ...form.value,
      // Ensure latitude and longitude are numbers
      latitude: Number(form.value.latitude),
      longitude: Number(form.value.longitude),
      // Add photos if any
      photos: photos.value,
      // Ensure boolean values are actually booleans
      hasFood: Boolean(form.value.hasFood),
      hasShower: Boolean(form.value.hasShower),
      hasParking: Boolean(form.value.hasParking)
    };

    const result = await truckStopStore.createTruckStop(data);
    if (result) {
      // Reset form
      form.value = {
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        hasFood: false,
        hasShower: false,
        hasParking: false,
        photos: [],
      };
      photosText.value = '';
      // Emit success event
      emit('created', result);
    } else {
      error.value = 'Failed to create truck stop. Please check all fields and try again.';
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'An error occurred while creating the truck stop';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const emit = defineEmits(['created']);
</script>

<style scoped>
.add-truck-stop {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 500;
}

input, textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.amenities {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

button {
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
}
</style>
