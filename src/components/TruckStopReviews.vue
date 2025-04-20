<template>
  <div class="reviews-section">
    <h3>Reviews for {{ truckStop?.name }}</h3>
    
    <!-- Add Review Form -->
    <form v-if="isAuthenticated" @submit.prevent="handleSubmit" class="review-form">
      <div class="rating-input">
        <label>Rating:</label>
        <div class="stars">
          <button 
            v-for="star in 5" 
            :key="star"
            type="button"
            @click="form.rating = star"
            :class="{ active: form.rating >= star }"
          >★</button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="comment">Comment (optional)</label>
        <textarea 
          id="comment"
          v-model="form.comment"
          placeholder="Share your experience..."
        ></textarea>
      </div>

      <button type="submit" :disabled="loading || !form.rating">
        {{ loading ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>

    <p v-else class="login-prompt">
      Please <router-link to="/login">login</router-link> to leave a review.
    </p>

    <!-- Reviews List -->
    <div v-if="truckStop?.reviews?.length" class="reviews-list">
      <div v-for="review in truckStop.reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="stars">
            <span v-for="star in 5" :key="star" :class="{ filled: review.rating >= star }">
              ★
            </span>
          </div>
          <span class="review-date">{{ formatDate(review.createdAt) }}</span>
        </div>
        <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
        <p class="review-author" v-if="review.userId">By: {{ getUserName(review.userId) }}</p>
      </div>
    </div>
    <p v-else class="no-reviews">No reviews yet. Be the first to review!</p>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useTruckStopStore } from '../stores/truckStop';
import type { CreateReviewDto, TruckStop } from '../types/truckStop';

const props = defineProps<{
  truckStopId: number;
}>();

const authStore = useAuthStore();
const truckStopStore = useTruckStopStore();
const loading = ref(false);
const error = ref('');

const form = ref<CreateReviewDto>({
  rating: 0,
  comment: ''
});

const isAuthenticated = computed(() => authStore.isAuthenticated);
const truckStop = computed(() => 
  truckStopStore.truckStops.find(stop => stop.id === props.truckStopId)
);

function getUserName(userId: number): string {
  // If the review is from the current truck stop's owner
  if (truckStop.value?.createdBy?.id === userId) {
    return truckStop.value.createdBy.name;
  }
  return 'User'; // Fallback name if we don't have the user info
}

async function handleSubmit() {
  if (!form.value.rating) return;
  
  loading.value = true;
  error.value = '';

  try {
    const result = await truckStopStore.createReview(props.truckStopId, form.value);
    if (result) {
      // Reset form
      form.value = {
        rating: 0,
        comment: ''
      };
    } else {
      error.value = 'Failed to submit review';
    }
  } catch (e) {
    error.value = 'An error occurred while submitting the review';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.reviews-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.review-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.rating-input {
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 0.5rem;
}

.stars button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  padding: 0;
}

.stars button.active {
  color: #ffd700;
}

.form-group {
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-date {
  color: #666;
  font-size: 0.9rem;
}

.stars span {
  color: #ddd;
}

.stars span.filled {
  color: #ffd700;
}

.review-comment {
  margin-top: 0.5rem;
  color: #333;
}

.login-prompt {
  text-align: center;
  margin: 2rem 0;
}

.no-reviews {
  text-align: center;
  color: #666;
  margin: 2rem 0;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
}

.review-author {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-style: italic;
}
</style>
