import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class names with Tailwind CSS support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price as a string with currency symbol
 */
export function formatPrice(price: number, currencySymbol = '€', locale = 'fr-FR'): string {
  return `${price.toLocaleString(locale)}${currencySymbol}`;
}

/**
 * Format a date as a string
 */
export function formatDate(date: Date | string, locale = 'fr-FR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Truncate a string to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format time (HH:MM)
 */
export function formatTime(time: string): string {
  if (!time || time.length < 5) return time;
  
  const [hours, minutes] = time.split(':');
  return `${hours}h${minutes}`;
}

/**
 * Get all unique cities from an array of gyms
 */
export function getUniqueCities(gyms: { city: string }[]): string[] {
  const cities = gyms.map(gym => gym.city);
  return [...new Set(cities)].sort();
}

/**
 * Get all unique amenities from an array of gyms
 */
export function getUniqueAmenities(gyms: { amenities: string[] }[]): string[] {
  const amenitiesSet = new Set<string>();
  
  gyms.forEach(gym => {
    gym.amenities.forEach(amenity => {
      amenitiesSet.add(amenity);
    });
  });
  
  return [...amenitiesSet].sort();
}