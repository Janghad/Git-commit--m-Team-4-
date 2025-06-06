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
import { HomeIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import supabase from "@/lib/supabaseClient";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EventDetailsModal from '@/components/common/EventDetailsModal';
import MyEventsModal from '@/components/common/MyEventsModal';
import { DIETARY_TAGS } from '@/constants/eventData';
import toast from 'react-hot-toast';
import { cancelRsvp, createEvent, rsvpToEvent } from '@/lib/eventService';
import {fetchPublicEvents} from '@/lib/eventService';
import { profile, time } from 'console';



/**
 * Mock events data for development and testing
 * Includes sample events with all required fields from DashboardEvent interface
 */

export default function Dashboard() {
    const router = useRouter();
    const { coords, error } = useUserLocation(); //get's users geographic location for the map
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
    const [isMyEventsModalOpen, setIsMyEventsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null);
    const [events, setEvents] = useState<DashboardEvent[]>([]);
    const [userRole, setUserRole] = useState("student"); //tracking user role (starts with student for security)
    const [userRsvps, setUserRsvps] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Load RSVPs from localStorage on component mount
useEffect(() => {
    const fetchUserAndEvents = async () => {
        setIsLoading(true);
        try {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                const {data: profile, error: profileError} = await supabase
                    .from("profiles")
                    .select("role, id")
                    .eq("auth_id", user.id)
                    .single();

                if (profile && !profileError) {
                    setUserRole(profile.role);
                    setUserId(profile.id);

                    const eventsData = await fetchPublicEvents();
                    setEvents(eventsData);

                    const {data: rsvps, error: rsvpError} = await supabase
                        .from("event_attendees")
                        .select("event_id")
                        .eq("user_id", profile.id);

                    if (!rsvpError && rsvps) {
                        const rsvpMap: Record<string, boolean> = {};
                        rsvps.forEach(rsvp => {
                            rsvpMap[rsvp.event_id] = true;
                        });
                        setUserRsvps(rsvpMap);
                    }
                }
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error("Unable to fetch the user's role", error);
            toast.error("Failed to load user data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Call the fetch function - wrapped in an immediate function to avoid
    // using await directly in useEffect
    fetchUserAndEvents();

    const checkForNewEvents = async () => {
        try {
          // Get the user's profile with last_login
            // First, get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            
            // Get the user's profile with last_login
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("last_login")
                .eq("auth_id", user.id) // Use user.id directly from auth instead of userId state
                .single();
            
            if (profileError || !profile) {
                console.error("Error fetching profile:", profileError);
                return;
            }

            const timeThreshold = profile.last_login
                ? profile.last_login
                : new Date (Date.now() -7 * 24 * 60 * 60 * 1000).toISOString(); // Default to 7 days ago if last_login is null    
    
            // Get events created since last login
            const { data: newEvents, error: eventsError } = await supabase
                .from("events")
                .select("id, title, location")
                .gt("created_at", timeThreshold)
                .order("created_at", { ascending: false });

            if (eventsError) {
                console.error("Error fetching new events:", eventsError);
                return;
            }

            if (newEvents && newEvents.length > 0) {
                if (newEvents.length > 3) {
                    toast(`${newEvents.length} new food events have been added since your last visit!`, {
                        icon: '🍔',
                        duration: 5000,
                    });
                } else{
                    newEvents.forEach(event => {
                        toast(`New event: ${event.title} at ${event.location}`, {
                            icon: '🍔',
                            duration: 5000,
                        });
                    });
                }
            }
        } catch (error) {
            console.error("Error checking for new events:", error);
        }
    };

    checkForNewEvents();

    // Set up realtime subscription
    const eventsNotification = supabase
    .channel("public:events")
    .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload: any) => {
            setEvents(prev => [...prev, transformEventRecord(payload.new)]);
            toast.success("New event added!");
        }
    )
    .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'events' },
        (payload: any) => {
        setEvents(prev => prev.map(event => 
            event.id === payload.new.id ? transformEventRecord(payload.new) : event
        ));
        toast.success("Event updated!");
        }
    )
    .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'events' },
        (payload: any) => {
            setEvents(prev => prev.filter(event => event.id !== payload.old.id));
            toast.success("Event deleted!");
        }
    )
    .subscribe();
    return () => {
        supabase.removeChannel(eventsNotification);
    };
}, [router]);


    //Helper function to transform event records from database to Frontend format

    const transformEventRecord = (record: any): DashboardEvent => {
        let coords: [number, number] = [-71.1097, 42.3505]; //BU coordinates
        if (record.location_coordinates) {
            const coordString = record.location_coordinates.replace(/[()]/g, '');
            const [x, y] = coordString.split(',').map(Number);
            coords = [x, y];
        }

        //Formats the time range string
        const startTime = new Date(record.start_time);
        const endTime = new Date(record.end_time);
        const timeRange = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        return {
            id: record.id,
            title: record.title,
            location: record.location,
            time: timeRange,
            attendees: 0,
            status: record.status,
            coords: coords,
            description: record.description || "",
            foodOfferings: record.food_offerings || [],
            organizerName: "Loading...",  // Will be fetched separately
            organizerEmail: "", //
            maxAttendees: record.max_attendees,
            isPublic: record.is_public,
        };
    };

    const handleMarkerClick = (eventId: string) => {
        const eventIdStr = String(eventId);
        
        // Find the event using string comparison
        const event = events.find(e => e.id === eventIdStr);
        
        if (event) {
            setSelectedEvent(event);
            setIsEventDetailsModalOpen(true);
        }
    };

    const handleAddEvent = async (eventData: EventFormData) => {
        if (!userId) {
            toast.error("Login to create event");
            return;
        }

        try {
            await createEvent(eventData, userId);
            toast.success("Event created successfully!");
            setIsAddEventModalOpen(false);
        } catch(error) {
            console.error("Unable to create event", error);
            toast.error("Unable to create event. Please try again.");
        }
    };

    const handleHomeClick = () => {
        router.push('/');
    };

    const hasUserRsvpd = (eventId: string): boolean => {
        return !!userRsvps[eventId];
    };


    const handleToggleRsvp = async (eventId: string) => {
        if (!userId) {
            toast.error("You must be logged in to RSVP");
            return;
        }
    
        // Validate event ID
        if (!eventId || eventId === 'NaN') {
            toast.error("Invalid event ID. Please try again.");
            return;
        }
    
        try {
            if (hasUserRsvpd(eventId)) {
                // CANCEL RSVP FLOW
                await cancelRsvp(eventId, userId);
                
                // Update local state for UI
                setUserRsvps(prev => {
                    const newState = {...prev};
                    delete newState[eventId];
                    return newState;
                });
                
                // Update attendee count in UI
                setEvents(prev => 
                    prev.map(event => {
                        if (event.id === eventId) {
                            return { 
                                ...event, 
                                attendees: Math.max(0, event.attendees - 1)
                            };
                        }
                        return event;
                    })
                );
                
                toast.success("Your RSVP has been canceled");
            } else {
                // ADD RSVP FLOW
                await rsvpToEvent(eventId, userId);
                
                //Update attendees on the front end
                setEvents(prev =>
                    prev.map(event => {
                        if (event.id === eventId) {
                            return { 
                                ...event, 
                                attendees: event.attendees + 1
                            };
                        }
                        return event;
                    })
                );

                // Update local state for UI
                setUserRsvps(prev => ({
                    ...prev,
                    [eventId]: true
                }));
                
                // Update attendee count in UI
                setEvents(prev => 
                    prev.map(event => {
                        if (event.id === eventId) {
                            return { 
                                ...event, 
                                attendees: Math.max(0, event.attendees - 1)
                            };
                        }
                        return event;
                    })
                );
                
                toast.success("You have successfully RSVP'd to this event!");
            }
        } catch (error) {
            console.error("Error toggling RSVP:", error);
            
            // Show appropriate error message based on error type
            if (error instanceof Error) {
                switch(error.message) {
                    case "Event is full":
                        toast.error("This event has reached its maximum capacity");
                        break;
                    case "Event not found":
                        toast.error("This event no longer exists");
                        break;
                    case "You have already RSVP'd to this event":
                        // Refresh state to match database reality
                        setUserRsvps(prev => ({
                            ...prev,
                            [eventId]: true
                        }));
                        toast("You're already on the attendee list for this event");
                        break;
                    default:
                        toast.error(`Failed to update RSVP: ${error.message}`);
                }
            } else {
                toast.error("Failed to update RSVP status. Please try again.");
            }
        }
    };

    const getUserRsvpdEvents = (): DashboardEvent[] => {
        return events.filter(event => !!userRsvps[event.id]);
    };

    const handleEditEvent = (event: DashboardEvent) => {
        toast(`Editing event: ${event.title}`);
        setIsEventDetailsModalOpen(false);
    };



    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }


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
                            onClick={() => setIsMyEventsModalOpen(true)}
                            className="flex items-center text-white hover:text-green-400 transition-colors w-full text-left"
                        >
                            <CalendarIcon className="w-5 h-5 mr-3" />
                            My Events
                        </button>
                    
                    {userRole === "faculty" && (
                        <button
                            onClick={() => setIsAddEventModalOpen(true)}
                            className="flex items-center text-white hover:text-green-400 mt-8 transition-colors w-full text-left"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Add Event
                        </button>
                    )}
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
                    isRsvpd={hasUserRsvpd(selectedEvent.id)}
                    onToggleRsvp={handleToggleRsvp}
                    onEditEvent={handleEditEvent}
                />
            )}

            {/* My Events Modal */}
            <MyEventsModal
                isOpen={isMyEventsModalOpen}
                onClose={() => setIsMyEventsModalOpen(false)}
                myEvents={getUserRsvpdEvents()}
                onViewDetails={(event) => {
                    setSelectedEvent(event);
                    setIsMyEventsModalOpen(false);
                    setIsEventDetailsModalOpen(true);
                }}
            />
        </div>
    );
}