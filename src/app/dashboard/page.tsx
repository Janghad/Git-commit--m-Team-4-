"use client";

/**
 * Dashboard Page Component
 * 
 * Main dashboard interface for the Spark!Bytes application. This component integrates
 * various features including:
 * - Simplified navigation sidebar
 * - Interactive map display
 * - Real-time event listing
 * - Event creation functionality
 * 
 * Recent Updates:
 * - Removed unused navigation items (Nearby Events, Upcoming Events)
 * - Implemented direct home navigation to landing page
 * - Streamlined sidebar to essential functions only
 * - Updated button styling for consistency
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import Map from '@/components/map/Map';
import { useUserLocation } from '@/hooks/useUserLocation';
import { DashboardEvent, EventFormData } from '@/types/event';
import NavBar from '@/components/navigation/NavBar';
import AddEventModal from '@/components/common/AddEventModal';
import { HomeIcon, HeartIcon, PlusIcon } from '@heroicons/react/24/outline';
import supabase from "@/lib/supabaseClient";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EventDetailsModal from '@/components/common/EventDetailsModal';
import FavoritesModal from '@/components/common/FavoritesModal';
import FacultyCodeModal from '@/components/common/FacultyCodeModal';
import { DIETARY_TAGS } from '@/constants/eventData';
import toast from 'react-hot-toast';

/**
 * Mock events data for development and testing
 * Includes sample events with all required fields from DashboardEvent interface
 */
const mockEvents: DashboardEvent[] = [
    {
        id: 1,
        title: "Computer Science Seminar",
        location: "CAS Building",
        time: "2:00 PM - 4:00 PM",
        attendees: 30,
        status: "available",
        coords: [-71.1097, 42.3505],
        description: "Leftover food from CS seminar",
        foodOfferings: [
            {
                name: "Pizza",
                dietaryTags: [DIETARY_TAGS[0], DIETARY_TAGS[1]], // Using actual DietaryTag objects
                description: "Assorted pizzas",
                quantity: "10 boxes",
                servingSize: "1 slice",
                temperature: "room temperature"
            }
        ],
        organizerName: "John Doe",
        organizerEmail: "john@example.com",
        isPublic: true
    },
    {
        id: 2,
        title: "Engineering Workshop",
        location: "Photonics Center",
        time: "3:30 PM - 5:30 PM",
        attendees: 25,
        status: "starting_soon",
        coords: [-71.1080, 42.3490],
        description: "Surplus food from engineering workshop",
        foodOfferings: [
            {
                name: "Sandwiches",
                dietaryTags: [DIETARY_TAGS[2]], // Using actual DietaryTag object
                description: "Assorted sandwiches",
                quantity: "30 pieces",
                servingSize: "1 sandwich",
                temperature: "cold"
            }
        ],
        organizerName: "Jane Smith",
        organizerEmail: "jane@example.com",
        isPublic: true
    }
];

export default function Dashboard() {
    const router = useRouter();
    const { coords, error } = useUserLocation();
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isFacultyCodeModalOpen, setIsFacultyCodeModalOpen] = useState(false);
    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null);
    const [events, setEvents] = useState<DashboardEvent[]>(mockEvents);
    const [favoriteEvents, setFavoriteEvents] = useState<DashboardEvent[]>([]);
    
    // New state for tracking user RSVPs
    const [userRsvps, setUserRsvps] = useState<Record<number, boolean>>({});
    
    // Load RSVPs from localStorage on component mount
    useEffect(() => {
        const savedRsvps = localStorage.getItem('userRsvps');
        if (savedRsvps) {
            try {
                setUserRsvps(JSON.parse(savedRsvps));
            } catch (error) {
                console.error('Failed to parse saved RSVPs:', error);
            }
        }
    }, []);
    
    // Save RSVPs to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('userRsvps', JSON.stringify(userRsvps));
    }, [userRsvps]);

    /**
     * Handles clicking on a map marker
     * Opens the event details modal for the selected event
     * @param {number} eventId - The ID of the clicked event
     */
    const handleMarkerClick = (eventId: number) => {
        const event = events.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setIsEventDetailsModalOpen(true);
        }
    };

    /**
     * Handles toggling an event's favorite status
     * @param {DashboardEvent} event - The event to toggle
     */
    const handleToggleFavorite = (event: DashboardEvent) => {
        setFavoriteEvents(prev => {
            const isCurrentlyFavorited = prev.some(e => e.id === event.id);
            if (isCurrentlyFavorited) {
                return prev.filter(e => e.id !== event.id);
            } else {
                return [...prev, event];
            }
        });
    };

    /**
     * Checks if an event is favorited
     * @param {DashboardEvent} event - The event to check
     * @returns {boolean} True if the event is favorited
     */
    const isEventFavorited = (event: DashboardEvent): boolean => {
        return favoriteEvents.some(e => e.id === event.id);
    };

    /**
     * Handles the creation of a new event
     * Creates a new event object from form data and updates the events list
     * 
     * @param {EventFormData} eventData - The validated form data for the new event
     * @returns {Promise<DashboardEvent>} The newly created event object
     * @throws {Error} If event creation fails
     */
    const handleAddEvent = async (eventData: EventFormData) => {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create new event object with form data
            const newEvent: DashboardEvent = {
                id: events.length + 1,
                title: eventData.title,
                location: eventData.location.name,
                time: `${eventData.startDateTime.toLocaleTimeString()} - ${eventData.endDateTime.toLocaleTimeString()}`,
                attendees: 0,
                status: 'available',
                coords: eventData.location.coordinates,
                description: eventData.description || '',
                foodOfferings: eventData.foodOfferings,
                organizerName: eventData.organizerName,
                organizerEmail: eventData.organizerEmail,
                organizerPhone: eventData.organizerPhone,
                maxAttendees: eventData.maxAttendees,
                isPublic: eventData.isPublic,
            };

            // Update events list with new event
            setEvents(prevEvents => [...prevEvents, newEvent]);
            
            return newEvent;
        } catch (error) {
            console.error('Error creating event:', error);
            throw new Error('Failed to create event. Please try again.');
        }
    };

    /**
     * Handles navigation to the landing page
     * Routes the user back to the main application page (/)
     */
    const handleHomeClick = () => {
        router.push('/');
    };

    /**
     * Handles successful faculty code validation
     * Opens the add event modal after successful authentication
     */
    const handleFacultyCodeSuccess = () => {
        setIsFacultyCodeModalOpen(false);
        setIsAddEventModalOpen(true);
    };

    /**
     * Checks if the current user has RSVP'd to a specific event
     * @param {number} eventId - The ID of the event to check
     * @returns {boolean} True if the user has RSVP'd, false otherwise
     */
    const hasUserRsvpd = (eventId: number): boolean => {
        return !!userRsvps[eventId];
    };

    /**
     * Handles toggling the RSVP status for an event
     * Updates both the user's RSVP status and the event's attendee count
     * Shows toast notifications for feedback
     * 
     * @param {number} eventId - The ID of the event to toggle RSVP for
     */
    const handleToggleRsvp = (eventId: number) => {
        // First, check if event exists
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        // Check if at max capacity and trying to RSVP
        const isAtCapacity = event.maxAttendees !== undefined && 
            event.attendees >= event.maxAttendees && 
            !userRsvps[eventId];
            
        if (isAtCapacity) {
            // Show error toast for max capacity
            toast.error('This event has reached maximum capacity', {
                duration: 3000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }
        
        // Update local RSVP state
        const newRsvpState = !userRsvps[eventId];
        setUserRsvps(prev => ({
            ...prev,
            [eventId]: newRsvpState
        }));
        
        // Update event attendee count
        setEvents(prev => 
            prev.map(event => {
                if (event.id === eventId) {
                    // Increment or decrement based on RSVP action
                    const newAttendees = newRsvpState 
                        ? event.attendees + 1 
                        : Math.max(0, event.attendees - 1);
                    
                    return { 
                        ...event, 
                        attendees: newAttendees,
                        // In a real implementation, we'd track user IDs
                        rsvpUsers: newRsvpState 
                            ? [...(event.rsvpUsers || []), 'current-user-id']
                            : (event.rsvpUsers || []).filter(id => id !== 'current-user-id')
                    };
                }
                return event;
            })
        );
        
        // Show success toast notification
        if (newRsvpState) {
            toast.success('You have successfully RSVP\'d to this event!', {
                duration: 3000,
                icon: '👍',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        } else {
            toast.success('Your RSVP has been canceled', {
                duration: 3000,
                icon: '❌',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
        
        // In a real implementation, we would make an API call to update the backend
        console.log(`User ${newRsvpState ? 'RSVP\'d to' : 'cancelled RSVP for'} event #${eventId}`);
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-900">
            <NavBar />
            
            <div className="flex flex-1">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-zinc-800 p-6 flex flex-col">
                    <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-zinc-400 text-sm mb-8">Find free food events across campus</p>
                    
                    <nav className="space-y-4">
                        <button 
                            onClick={handleHomeClick}
                            className="flex items-center text-white hover:text-green-400 transition-colors w-full text-left"
                        >
                            <HomeIcon className="w-5 h-5 mr-3" />
                            Home
                        </button>

                        <button 
                            onClick={() => setIsFavoritesModalOpen(true)}
                            className="flex items-center text-white hover:text-green-400 transition-colors w-full text-left"
                        >
                            <HeartIcon className="w-5 h-5 mr-3" />
                            My Favorites
                        </button>

                        <button
                            onClick={() => setIsFacultyCodeModalOpen(true)}
                            className="flex items-center text-white hover:text-green-400 mt-8 transition-colors w-full text-left"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Add Event
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex">
                    {/* Map Section */}
                    <div className="flex-1 relative">
                        <Map 
                            events={events}
                            onMarkerClick={handleMarkerClick}
                            userPos={coords || undefined}
                        />
                    </div>

                    {/* Events List */}
                    <div className="w-96 bg-zinc-800 p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Available Events</h2>
                            <span className="text-zinc-400 text-sm">{events.length} events found</span>
                        </div>

                        <div className="space-y-4">
                            {events.map((event) => (
                                <div key={event.id} className="bg-zinc-700 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            event.status === 'available' 
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-amber-500/20 text-amber-300'
                                        }`}>
                                            {event.status === 'available' ? 'Available Now' : 'Starting Soon'}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-zinc-300">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {event.time}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {event.attendees} attending
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setIsEventDetailsModalOpen(true);
                                        }}
                                        className="mt-4 w-full bg-zinc-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Faculty Code Modal */}
            <FacultyCodeModal
                isOpen={isFacultyCodeModalOpen}
                onClose={() => setIsFacultyCodeModalOpen(false)}
                onSuccess={handleFacultyCodeSuccess}
            />

            {/* Add Event Modal */}
            <AddEventModal
                isOpen={isAddEventModalOpen}
                onClose={() => setIsAddEventModalOpen(false)}
                onSubmit={handleAddEvent}
            />

            {/* Event Details Modal */}
            {selectedEvent && (
                <EventDetailsModal
                    isOpen={isEventDetailsModalOpen}
                    onClose={() => {
                        setIsEventDetailsModalOpen(false);
                        setSelectedEvent(null);
                    }}
                    event={selectedEvent}
                    isFavorited={isEventFavorited(selectedEvent)}
                    onToggleFavorite={handleToggleFavorite}
                    isRsvpd={hasUserRsvpd(selectedEvent.id)}
                    onToggleRsvp={handleToggleRsvp}
                />
            )}

            {/* Favorites Modal */}
            <FavoritesModal
                isOpen={isFavoritesModalOpen}
                onClose={() => setIsFavoritesModalOpen(false)}
                favoriteEvents={favoriteEvents}
                onViewDetails={(event) => {
                    setSelectedEvent(event);
                    setIsFavoritesModalOpen(false);
                    setIsEventDetailsModalOpen(true);
                }}
            />
        </div>
    );
} 