/**
 * Type definitions for the Spark!Bytes application
 * This file contains all the TypeScript interfaces that define the shape of our data
 */

/**
 * User interface defines the structure of a user in the system
 * @property id - Unique identifier for the user
 * @property email - User's email address
 * @property role - User's role in the system (admin, donor, or recipient)
 * @property name - Optional user's full name
 * @property department - Optional user's BU department
 */
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'donor' | 'recipient';
  name?: string;
  department?: string;
}

/**
 * FoodItem interface defines the structure of a food item in the system
 * @property id - Unique identifier for the food item
 * @property name - Name of the food item
 * @property description - Detailed description of the food item
 * @property quantity - Amount of food available
 * @property expiryDate - Date when the food will expire
 * @property location - Where the food is located on campus
 * @property donorId - ID of the user who donated the food
 * @property status - Current status of the food item
 * @property createdAt - Timestamp when the food item was created
 * @property updatedAt - Timestamp when the food item was last updated
 */
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiryDate: Date;
  location: string;
  donorId: string;
  status: 'available' | 'reserved' | 'claimed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification interface defines the structure of a notification in the system
 * @property id - Unique identifier for the notification
 * @property userId - ID of the user who should receive the notification
 * @property title - Short title of the notification
 * @property message - Detailed message content
 * @property type - Type of notification (food available, claimed, or system)
 * @property read - Whether the notification has been read
 * @property createdAt - Timestamp when the notification was created
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'food_available' | 'food_claimed' | 'system';
  read: boolean;
  createdAt: Date;
} 