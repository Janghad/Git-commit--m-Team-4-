/**
 * Application Configuration
 * This file contains all the constant values used throughout the application
 */

/**
 * Basic application information
 * Used for display purposes and version tracking
 */
export const APP_CONFIG = {
  name: 'Spark!Bytes',
  description: 'BU Food Surplus Management System',
  version: '1.0.0',
};

/**
 * User role definitions
 * Used to determine user permissions and access levels
 * - ADMIN: Full system access
 * - DONOR: Can post and manage food items
 * - RECIPIENT: Can view and claim available food
 */
export const ROLES = {
  ADMIN: 'admin',
  DONOR: 'donor',
  RECIPIENT: 'recipient',
} as const;

/**
 * Food item status definitions
 * Used to track the current state of food items in the system
 * - AVAILABLE: Food is available for claiming
 * - RESERVED: Food has been reserved but not claimed
 * - CLAIMED: Food has been claimed by a recipient
 * - EXPIRED: Food is no longer available
 */
export const FOOD_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  CLAIMED: 'claimed',
  EXPIRED: 'expired',
} as const;

/**
 * Notification type definitions
 * Used to categorize different types of system notifications
 * - FOOD_AVAILABLE: New food items are available
 * - FOOD_CLAIMED: Food items have been claimed
 * - SYSTEM: General system notifications
 */
export const NOTIFICATION_TYPES = {
  FOOD_AVAILABLE: 'food_available',
  FOOD_CLAIMED: 'food_claimed',
  SYSTEM: 'system',
} as const;

/**
 * API route definitions
 * Centralized location for all API endpoint paths
 * Used to maintain consistency across the application
 */
export const API_ROUTES = {
  FOOD: '/api/food',
  NOTIFICATIONS: '/api/notifications',
  AUTH: '/api/auth',
} as const; 