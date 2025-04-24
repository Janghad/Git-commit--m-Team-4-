/**
 * RsvpButton Component
 * 
 * An interactive button component that allows users to RSVP to events and displays
 * the current RSVP count. The component changes appearance based on RSVP status to
 * provide clear visual feedback.
 * 
 * Features:
 * - Toggle RSVP status with a single click
 * - Visual feedback for current RSVP state
 * - Display of total RSVP/attendee count
 * - Accessible button with appropriate ARIA attributes
 * - Smooth transitions between states
 * 
 * @component
 * @example
 * ```tsx
 * <RsvpButton
 *   eventId={event.id}
 *   count={event.attendees}
 *   isRsvpd={hasUserRsvpd(event.id)}
 *   onToggle={handleToggleRsvp}
 *   disabled={event.attendees >= (event.maxAttendees || Infinity)}
 * />
 * ```
 */

import React from 'react';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';

/**
 * Props for the RsvpButton component
 * @interface RsvpButtonProps
 * @property {number} eventId - The ID of the event
 * @property {number} count - Current number of attendees/RSVPs
 * @property {boolean} isRsvpd - Whether the current user has RSVP'd
 * @property {(eventId: number) => void} onToggle - Callback function when RSVP status is toggled
 * @property {boolean} [disabled] - Whether the button should be disabled (e.g., at max capacity)
 */
interface RsvpButtonProps {
    eventId: number;
    count: number;
    isRsvpd: boolean;
    onToggle: (eventId: number) => void;
    disabled?: boolean;
}

/**
 * RSVP Button component that allows users to RSVP to events
 */
export default function RsvpButton({ 
    eventId, 
    count, 
    isRsvpd, 
    onToggle,
    disabled = false
}: RsvpButtonProps) {
    return (
        <div className="flex flex-col">
            <button
                onClick={() => onToggle(eventId)}
                disabled={disabled}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 
                    ${isRsvpd 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-zinc-700 text-white hover:bg-zinc-600'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-pressed={isRsvpd}
                aria-label={isRsvpd ? "Cancel attendance" : "RSVP to event"}
            >
                {isRsvpd ? (
                    <>
                        <CheckIcon className="h-5 w-5 mr-2" />
                        <span>I'm Going</span>
                    </>
                ) : (
                    <>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        <span>RSVP</span>
                    </>
                )}
            </button>
            <p className="text-sm text-zinc-400 mt-2">
                {count} {count === 1 ? 'person' : 'people'} attending
            </p>
            {disabled && !isRsvpd && (
                <p className="text-xs text-amber-400 mt-1">
                    This event has reached maximum capacity
                </p>
            )}
        </div>
    );
} 