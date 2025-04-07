'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { HomeIcon, MapPinIcon, CalendarIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Event } from '@/types/map';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/map/Map'), { ssr: false });

export default function DashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const sidebarLinks = [
    { name: 'Home', icon: HomeIcon, href: '#' },
    { name: 'Nearby Events', icon: MapPinIcon, href: '#' },
    { name: 'Upcoming Events', icon: CalendarIcon, href: '#' },
    { name: 'Favorites', icon: StarIcon, href: '#' },
    { name: 'Recent Events', icon: ClockIcon, href: '#' },
  ];

  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Computer Science Seminar',
      location: 'CAS Building, Room 201',
      distance: '0.3 miles',
      time: 'Today, 12:30 PM - 2:00 PM',
      attendees: 24,
      status: 'available',
      coords: [-71.1097, 42.3505]
    },
    {
      id: 2,
      title: 'Engineering Mixer',
      location: 'Engineering Building, Lobby',
      distance: '0.7 miles',
      time: 'Today, 4:00 PM - 6:00 PM',
      attendees: 42,
      status: 'starting_soon',
      coords: [-71.1000, 42.3490]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Nav Bar at the top */}
      <NavBar />
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Find free food events across campus</p>
        </div>
        <nav className="mt-4">
          {sidebarLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map Section */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-lg h-full overflow-hidden">
            <Map 
              events={mockEvents}
              onMarkerClick={(eventId) => {
                const event = mockEvents.find(e => e.id === eventId);
                setSelectedEvent(event || null);
              }}
            />
          </div>
        </div>

        {/* Events Section */}
        <div className="w-96 bg-white shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Available Events</h2>
            <span className="text-gray-500 text-sm">{mockEvents.length} events found</span>
          </div>

          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {event.status === 'available' ? 'Available Now' : 'Starting Soon'}
                  </span>
                </div>
                
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{event.location} ({event.distance})</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{event.attendees} attending</span>
                  </div>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 