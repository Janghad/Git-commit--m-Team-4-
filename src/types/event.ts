import { Building, DietaryTag } from '../constants/eventData';

/**
 * Base Event interface
 * Represents the core event data structure
 */
export interface Event {
    id: number;
    title: string;
    location: string;
    time: string;
    attendees: number;
    status: 'available' | 'starting_soon';
    coords: [number, number];
}

/**
 * Extended Event interface for dashboard functionality
 * Includes additional fields for detailed event information
 */
export interface DashboardEvent extends Event {
    /** Optional description of the event */
    description?: string;
    /** Array of food items being offered with their dietary tags */
    foodOfferings: Array<{
        name: string;
        dietaryTags: Array<DietaryTag>;
        description?: string;
        quantity?: string;
        servingSize?: string;
        temperature?: 'hot' | 'cold' | 'room temperature';
    }>;
    /** Name of the event organizer */
    organizerName: string;
    /** Email of the event organizer */
    organizerEmail: string;
    /** Optional phone number of the event organizer */
    organizerPhone?: string;
    /** Optional maximum number of attendees allowed */
    maxAttendees?: number;
    /** Whether the event is public or private */
    isPublic: boolean;
    /** Array of user IDs who have RSVP'd to this event (would be implemented with actual user IDs in production) */
    rsvpUsers?: string[];
}

/**
 * Form data interface for event creation/editing
 */
export interface EventFormData {
    title: string;
    startDateTime: Date;
    endDateTime: Date;
    location: Building;
    description?: string;
    foodOfferings: Array<{
        name: string;
        dietaryTags: Array<DietaryTag>;
        description?: string;
        quantity?: string;
        servingSize?: string;
        temperature?: 'hot' | 'cold' | 'room temperature';
    }>;
    organizerName: string;
    organizerEmail: string;
    organizerPhone?: string;
    maxAttendees?: number;
    isPublic: boolean;
}

/**
 * Form validation errors interface
 */
export interface EventFormErrors {
    title?: string;
    startDateTime?: string;
    endDateTime?: string;
    location?: string;
    foodOfferings?: string[] | string;
    organizerName?: string;
    organizerEmail?: string;
    organizerPhone?: string;
    general?: string;
}

/**
 * Props interface for event form components
 */
export interface EventFormProps {
    initialData?: EventFormData;
    onSubmit: (data: EventFormData) => Promise<void>;
    onClose: () => void;
}

/**
 * RSVP status interface for tracking user RSVP state
 * @property {boolean} isRsvpd - Whether the current user has RSVP'd to the event
 * @property {number} count - Total number of RSVPs for the event
 */
export interface RsvpStatus {
    isRsvpd: boolean;
    count: number;
} 