/**
 * Represents a food event or building on the campus map
 * @interface Event
 * @property {number} id - Unique identifier for the event
 * @property {string} title - Display name of the event
 * @property {string} location - Physical location on campus
 * @property {string} [distance] - Distance from user's current location
 * @property {string} time - Event timing information
 * @property {number} attendees - Number of people attending
 * @property {'available' | 'starting_soon'} status - Current status of the event
 * @property {[number, number]} coords - Geographic coordinates [longitude, latitude]
 */
export interface Event {
  id: string;
  title: string;
  location: string;
  distance?: string;
  time: string;
  attendees: number;
  status: 'available' | 'starting_soon';
  coords: [number, number];
}

/**
 * Props for the Map component
 * @interface MapProps
 * @property {Event[]} events - Array of events to display on the map
 * @property {(eventId: number) => void} onMarkerClick - Callback function when a marker is clicked
 * @property {[number, number]} [userPos] - Optional user's current position [longitude, latitude]
 */
export interface MapProps {
  events: Event[];
  onMarkerClick: (eventId: string) => void;
  userPos?: [number, number];
}

/**
 * Props for individual map markers
 * @interface MarkerProps
 * @property {Event} event - Event data for the marker
 * @property {() => void} onClick - Callback function when the marker is clicked
 */
export interface MarkerProps {
  event: Event;
  onClick: () => void;
} 