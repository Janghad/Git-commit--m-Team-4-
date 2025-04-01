/**
 * Geographic coordinates for the center of Boston University campus
 * Format: [longitude, latitude]
 */
export const BU_CENTER: [number, number] = [-71.1097, 42.3505];

/**
 * Default zoom level for the map view
 */
export const DEFAULT_ZOOM = 15;

/**
 * Default pitch angle for the map view (in degrees)
 */
export const DEFAULT_PITCH = 45;

/**
 * Default bearing angle for the map view (in degrees)
 */
export const DEFAULT_BEARING = -17.6;

/**
 * Mapbox style URL for the map
 */
export const MAP_STYLE = 'mapbox://styles/mapbox/standard';

/**
 * Possible status values for events on the map
 */
export const EVENT_STATUS = {
  AVAILABLE: 'available',
  STARTING_SOON: 'starting_soon',
} as const;

/**
 * Color schemes for different event statuses
 * Each status has associated background, text, and shadow colors
 */
export const EVENT_STATUS_COLORS = {
  [EVENT_STATUS.AVAILABLE]: {
    bg: 'bg-green-500',
    text: 'text-green-800',
    shadow: 'shadow-[0_0_12px_rgba(34,197,94,0.6)]'
  },
  [EVENT_STATUS.STARTING_SOON]: {
    bg: 'bg-amber-500',
    text: 'text-amber-800',
    shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]'
  },
} as const; 