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

interface RsvpButtonProps {
    eventId: string; // Accept either string or number
    count: number;
    isRsvpd: boolean;
    onToggle: (eventId: string) => void; // Change to accept string
    disabled?: boolean;
}

export default function RsvpButton({ 
    eventId, 
    count, 
    isRsvpd, 
    onToggle,
    disabled = false
}: RsvpButtonProps) {
    // Ensure eventId is a string and not NaN
    const handleClick = () => {
        const eventIdStr = String(eventId);
        
        // Check if eventId is valid before proceeding
        if (eventIdStr === 'NaN' || !eventId) {
            console.error("Invalid event ID:", eventId);
            return;
        }
        
        onToggle(eventIdStr);
    };

    return (
        <div className="flex flex-col">
            <button
                onClick={handleClick}
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
                        <span>I&apos;m Going</span>
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