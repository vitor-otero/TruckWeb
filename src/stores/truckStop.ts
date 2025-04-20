import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/config';
import type { TruckStop, CreateTruckStopDto, CreateReviewDto } from '../types/truckStop';

export const useTruckStopStore = defineStore('truckStop', () => {
  const truckStops = ref<TruckStop[]>([]);
  const currentTruckStop = ref<TruckStop | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const reviews = computed(() => {
    if (currentTruckStop.value) {
      return currentTruckStop.value.reviews || [];
    }
    return [];
  });

  async function fetchNearbyTruckStops(lat: number, lng: number, radius: number = 1) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/api/truck-stops/search`, {
        params: { latitude: lat, longitude: lng, radius }
      });
      truckStops.value = response.data;
    } catch (e) {
      error.value = 'Failed to fetch nearby truck stops';
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchTruckStop(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/api/truck-stops/${id}`);
      currentTruckStop.value = response.data;
    } catch (e) {
      error.value = 'Failed to fetch truck stop details';
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function createTruckStop(data: CreateTruckStopDto) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/api/truck-stops', data);
      truckStops.value.push(response.data);
      return response.data;
    } catch (e) {
      error.value = 'Failed to create truck stop';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createReview(truckStopId: number, data: CreateReviewDto) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/api/truck-stops/${truckStopId}/reviews`, {
        ...data,
        truckStopId
      });
      
      // Update the current truck stop with the new review
      if (currentTruckStop.value && currentTruckStop.value.id === truckStopId) {
        currentTruckStop.value.reviews = [...(currentTruckStop.value.reviews || []), response.data];
        // Update average rating
        const totalRating = currentTruckStop.value.reviews.reduce((sum, review) => sum + review.rating, 0);
        currentTruckStop.value.averageRating = totalRating / currentTruckStop.value.reviews.length;
      }
      
      // Update the truck stop in the list if it exists
      const index = truckStops.value.findIndex(stop => stop.id === truckStopId);
      if (index !== -1) {
        const reviews = [...(truckStops.value[index].reviews || []), response.data];
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        truckStops.value[index] = {
          ...truckStops.value[index],
          reviews,
          averageRating: totalRating / reviews.length
        };
      }
      
      return response.data;
    } catch (e) {
      error.value = 'Failed to create review';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    truckStops,
    currentTruckStop,
    reviews,
    loading,
    error,
    fetchNearbyTruckStops,
    fetchTruckStop,
    createTruckStop,
    createReview
  };
});
