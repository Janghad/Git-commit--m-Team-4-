"use client";

import React from 'react';
import Map from '@/components/map/Map';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Event } from '@/types/map';
import NavBar from '@/components/navigation/NavBar';

// Mock events data - replace with real data later
const mockEvents: Event[] = [
    {
        id: 1,
        title: "Computer Science Seminar",
        location: "CAS Building, Room 201",
        time: "Today, 12:30 PM - 2:00 PM",
        attendees: 24,
        status: "available",
        coords: [-71.1097, 42.3505]
    },
    {
        id: 2,
        title: "Engineering Mixer",
        location: "Engineering Building, Lobby",
        time: "Today, 4:00 PM - 6:00 PM",
        attendees: 42,
        status: "starting_soon",
        coords: [-71.1080, 42.3490]
    }
];

export default function Dashboard() {
    const { coords, error } = useUserLocation();

    const handleMarkerClick = (eventId: number) => {
        // Find the clicked event
        const event = mockEvents.find(e => e.id === eventId);
        if (event) {
            console.log('Viewing details for:', event.title);
            // Add your event details handling logic here
        }
    };

    return (
        // 1. Use flex-col so the NavBar is stacked above the rest of the page, before it messed up everything
        <div className="flex flex-col h-screen bg-zinc-900">
            {/* NavBar at the top */}
            <NavBar />
            
            {/* 2. Wrap sidebar + main content in their own horizontal flex container */}
            <div className="flex flex-1">
            {/* Sidebar */}
            <div className="w-64 bg-zinc-800 p-6 flex flex-col">
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-zinc-400 text-sm mb-8">Find free food events across campus</p>
                
                <nav className="space-y-4">
                    <a href="#" className="flex items-center text-white hover:text-green-400">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </a>
                    <a href="#" className="flex items-center text-white hover:text-green-400">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Nearby Events
                    </a>
                    <a href="#" className="flex items-center text-white hover:text-green-400">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upcoming Events
                    </a>
                    <a href="#" className="flex items-center text-white hover:text-green-400">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Favorites
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Map Section */}
                <div className="flex-1 relative">
                    <Map 
                        events={mockEvents}
                        onMarkerClick={handleMarkerClick}
                        userPos={coords}
                    />
                </div>

                {/* Events List */}
                <div className="w-96 bg-zinc-800 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">Available Events</h2>
                        <span className="text-zinc-400 text-sm">{mockEvents.length} events found</span>
                    </div>

                    <div className="space-y-4">
                        {mockEvents.map((event) => (
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
                                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
} 