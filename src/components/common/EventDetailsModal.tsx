/**
 * EventDetailsModal Component
 * 
 * A modal component for displaying detailed event information and managing favorites.
 * This component provides a comprehensive view of an event's details including:
 * - Basic event information (title, time, location, status)
 * - Food offerings with dietary tags
 * - Organizer information
 * - Attendance details
 * - Favorite functionality
 * - RSVP functionality
 * 
 * The component follows the application's design system with:
 * - Consistent modal layout and backdrop
 * - Responsive design for various screen sizes
 * - Accessible button controls
 * - Clear visual hierarchy
 * 
 * @component
 * @example
 * ```tsx
 * <EventDetailsModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   event={selectedEvent}
 *   isFavorited={isEventFavorited(selectedEvent)}
 *   onToggleFavorite={(event) => handleToggleFavorite(event)}
 *   isRsvpd={hasUserRsvpd(selectedEvent.id)}
 *   onToggleRsvp={(eventId) => handleToggleRsvp(eventId)}
 * />
 */

import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { DashboardEvent } from '@/types/event';
import RsvpButton from './RsvpButton';

/**
 * Props for the EventDetailsModal component
 * @interface EventDetailsModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function to close the modal
 * @property {DashboardEvent} event - The event object containing all event details
 * @property {boolean} isFavorited - Whether the current event is in the user's favorites
 * @property {(event: DashboardEvent) => void} onToggleFavorite - Callback to toggle favorite status
 * @property {boolean} isRsvpd - Whether the current user has RSVP'd to this event
 * @property {(eventId: number) => void} onToggleRsvp - Callback to toggle RSVP status
 */
interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: DashboardEvent;
    isFavorited: boolean;
    onToggleFavorite: (event: DashboardEvent) => void;
    isRsvpd: boolean;
    onToggleRsvp: (eventId: number) => void;
}

export default function EventDetailsModal({
    isOpen,
    onClose,
    event,
    isFavorited,
    onToggleFavorite,
    isRsvpd,
    onToggleRsvp
}: EventDetailsModalProps) {
    // Check if event has a maximum capacity and if it's reached
    const isAtCapacity = event.maxAttendees !== undefined && 
        event.attendees >= event.maxAttendees && 
        !isRsvpd;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-zinc-800 p-6 shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-bold text-white">
                            Event Details
                        </Dialog.Title>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => onToggleFavorite(event)}
                                className="text-white hover:text-green-400 transition-colors"
                                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                            >
                                {isFavorited ? (
                                    <HeartIconSolid className="h-6 w-6 text-green-500" />
                                ) : (
                                    <HeartIcon className="h-6 w-6" />
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="text-zinc-400 hover:text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">{event.title}</h3>
                            <div className="grid grid-cols-2 gap-4 text-zinc-300">
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Location</p>
                                    <p>{event.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Time</p>
                                    <p>{event.time}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Status</p>
                                    <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        event.status === 'available' 
                                            ? 'bg-green-500/20 text-green-300'
                                            : 'bg-amber-500/20 text-amber-300'
                                    }`}>
                                        {event.status === 'available' ? 'Available Now' : 'Starting Soon'}
                                    </p>
                                </div>
                                {/* RSVP Button Component - replaces static attendee count */}
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Attendance</p>
                                    <RsvpButton 
                                        eventId={event.id}
                                        count={event.attendees}
                                        isRsvpd={isRsvpd}
                                        onToggle={onToggleRsvp}
                                        disabled={isAtCapacity}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400 mb-2">Description</h4>
                                <p className="text-zinc-300">{event.description}</p>
                            </div>
                        )}

                        {/* Food Offerings */}
                        <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Food Offerings</h4>
                            <div className="space-y-3">
                                {event.foodOfferings.map((offering, index) => (
                                    <div key={index} className="bg-zinc-700/50 rounded-lg p-3">
                                        <p className="text-white font-medium mb-2">{offering.name}</p>
                                        {offering.dietaryTags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {offering.dietaryTags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organizer Information */}
                        <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Organizer Information</h4>
                            <div className="bg-zinc-700/50 rounded-lg p-4 space-y-2">
                                <p className="text-zinc-300">
                                    <span className="text-zinc-400">Name:</span> {event.organizerName}
                                </p>
                                <p className="text-zinc-300">
                                    <span className="text-zinc-400">Email:</span> {event.organizerEmail}
                                </p>
                                {event.organizerPhone && (
                                    <p className="text-zinc-300">
                                        <span className="text-zinc-400">Phone:</span> {event.organizerPhone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="grid grid-cols-2 gap-4">
                            {event.maxAttendees && (
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Maximum Attendees</p>
                                    <p className="text-zinc-300">{event.maxAttendees}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Visibility</p>
                                <p className="text-zinc-300">{event.isPublic ? 'Public' : 'Private'}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors duration-200"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 