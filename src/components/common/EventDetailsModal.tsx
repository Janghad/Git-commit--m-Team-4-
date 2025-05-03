/**
 * EventDetailsModal Component
 * 
 * A modal component for displaying detailed event information and managing event RSVPs.
 * This component provides a comprehensive view of an event's details including:
 * - Basic event information (title, time, location, status)
 * - Food offerings with dietary tags
 * - Organizer information
 * - Attendance details
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
 *   isRsvpd={hasUserRsvpd(Number(selectedEvent.id))}
 *   onToggleRsvp={(eventId) => handleToggleRsvp(eventId)}
 * />
 */

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DashboardEvent } from '@/types/event';
import RsvpButton from './RsvpButton';
import supabase from '@/lib/supabaseClient';
import toast from 'react-hot-toast';


interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: DashboardEvent;
    isRsvpd: boolean;
    onToggleRsvp: (eventId: string) => void;
    onEditEvent?: (event: DashboardEvent) => void;
}

export default function EventDetailsModal({
    isOpen,
    onClose,
    event,
    isRsvpd,
    onToggleRsvp,
    onEditEvent
}: EventDetailsModalProps) {
    // Check if event has a maximum capacity and if it's reached
    const isAtCapacity = event.maxAttendees !== undefined && 
        event.attendees >= event.maxAttendees && 
        !isRsvpd;
    
    // State to track if current user is the organizer and is faculty
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check if current user is the event organizer and has faculty role
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                setIsLoading(true);
                
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    setIsAuthorized(false);
                    return;
                }
                
                // Get user profile to check role
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role, email")
                    .eq("auth_id", user.id)
                    .single();
                
                if (profileError) {
                    console.error("Error fetching profile:", profileError);
                    setIsAuthorized(false);
                    return;
                }
                
                // Check if user is faculty AND is the event organizer
                if (profile && 
                    profile.role === "faculty" && 
                    (profile.email === event.organizerEmail)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Error checking authorization:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (isOpen) {
            checkAuthorization();
        }
    }, [isOpen, event.organizerEmail]);

    // Handle edit button click
    const handleEditClick = () => {
        if (!isAuthorized) {
            toast.error("Only the faculty member who created this event can edit it.");
            return;
        }
        
        if (onEditEvent) {
            onEditEvent(event);
        } else {
            toast.error("Edit functionality not available");
        }
    };

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
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
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
                            <div className="space-y-4">
                                {event.foodOfferings.map((food, index) => (
                                    <div key={index} className="bg-zinc-700/50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-medium text-white">{food.name}</h5>
                                            {food.temperature && (
                                                <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-600 text-zinc-300">
                                                    {food.temperature.charAt(0).toUpperCase() + food.temperature.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                        {food.description && (
                                            <p className="text-sm text-zinc-300 mb-2">{food.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {food.dietaryTags.map((tag, tagIndex) => (
                                                <span 
                                                    key={tagIndex}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-zinc-400">
                                            {food.quantity && (
                                                <div>
                                                    <span className="font-medium">Quantity:</span> {food.quantity}
                                                </div>
                                            )}
                                            {food.servingSize && (
                                                <div>
                                                    <span className="font-medium">Serving Size:</span> {food.servingSize}
                                                </div>
                                            )}
                                        </div>
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
                                onClick={handleEditClick}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                    isAuthorized 
                                        ? 'bg-green-600 text-white hover:bg-green-500'
                                        : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500 cursor-not-allowed'
                                }`}
                                aria-label={isAuthorized ? "Edit event" : "Only the organizer can edit this event"}
                                title={isAuthorized ? "Edit event" : "Only the faculty member who created this event can edit it"}
                            >
                                {isLoading ? 'Checking...' : 'Edit'}
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 