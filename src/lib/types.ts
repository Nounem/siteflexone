// Type pour les horaires d'ouverture
export interface DaySchedule {
  open: string;
  close: string;
  closed?: boolean;
}

// Type pour les horaires hebdomadaires
export type WeekSchedule = {
  [key in DayOfWeek]: DaySchedule;
};

// Jours de la semaine
export type DayOfWeek = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Type pour un forfait
export interface GymPlan {
  id: string;
  name: string;
  price: number;
  duration: 'daily' | 'weekly' | 'monthly' | 'yearly';
  features: string[];
}

// Type pour les coordonnées de contact
export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
}

// Type pour une salle de sport
export interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  description: string;
  amenities: string[];
  plans: GymPlan[];
  images: string[];
  openingHours: WeekSchedule;
  contact: ContactInfo;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type pour les filtres de recherche
export interface FilterOptions {
  city?: string;
  amenities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
}

// Type pour un utilisateur
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

// Type pour les avis
export interface Review {
  id: string;
  gymId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}