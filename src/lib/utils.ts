// src/lib/utils.ts
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
 * Calculate average rating from an array of reviews
 */
export function calculateAverageRating(reviews: { rating: number }[]): number {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
}

/**
 * Group an array by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array of objects by a key
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate phone number format (French format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return regex.test(phone);
}

/**
 * Check if a string is empty or only contains whitespace
 */
export function isEmptyString(str: string | null | undefined): boolean {
  return !str || str.trim() === '';
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