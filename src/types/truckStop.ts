export interface User {
  id: number;
  name: string;
  email: string;
}

export interface TruckStop {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  hasFood: boolean;
  hasShower: boolean;
  hasParking: boolean;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  userId: number;
  reviews: Review[];
  createdBy: User;
  averageRating?: number;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  truckStopId: number;
}

export interface CreateTruckStopDto {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  hasFood: boolean;
  hasShower: boolean;
  hasParking: boolean;
  photos?: string[];
}

export interface CreateReviewDto {
  rating: number;
  comment?: string;
}
