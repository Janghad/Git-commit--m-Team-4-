"use client";

import React from 'react';
import Link from 'next/link';
import Map from '@/components/map/Map';
import LocationPrompt from '@/components/common/LocationPrompt';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Event } from '@/types/map';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Initialize Supabase client for authentication and database operations
 * Uses environment variables for secure configuration
 */
const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Team member information for the About section
 * Each member has:
 * - name: Full name of the team member
 * - role: Their role in the project
 * - bio: Brief description of their background and interests
 * - imageUrl: Path to their profile image (currently using placeholders)
 */
const teamMembers = [
    {
        name: "Ryan Rodriguez",
        role: "Full Stack Developer",
        bio: "Rising Senior at Boston University studying Computer Science, passionate about creating impactful solutions.",
        imageUrl: "/placeholder-1.jpg" // Add actual image paths
    },
    {
        name: "Ben Bucaj",
        role: "Full Stack Developer",
        bio: "Rising Senior at Boston University studying Computer Science, focused on building efficient and scalable applications.",
        imageUrl: "/placeholder-2.jpg"
    },
    {
        name: "Jason Anghad",
        role: "Full Stack Developer",
        bio: "Senior at Boston University studying Computer Science, dedicated to developing innovative software solutions.",
        imageUrl: "/placeholder-3.jpg"
    },
    {
        name: "Nicole Lin",
        role: "Full Stack Developer",
        bio: "Rising Senior at Boston University studying Computer Science, enthusiastic about creating user-centric applications.",
        imageUrl: "/placeholder-4.jpg"
    }
];

/**
 * Mock events data for the map visualization
 * Each event includes:
 * - id: Unique identifier
 * - title: Event name
 * - location: Building name
 * - time: Event time
 * - attendees: Number of attendees
 * - status: Current status (available/starting_soon)
 * - coords: [longitude, latitude] coordinates
 */
const mockEvents: Event[] = [
    {
        id: 1,
        title: "Computer Science Seminar",
        location: "CAS Building",
        time: "2:00 PM",
        attendees: 30,
        status: "available",
        coords: [-71.1097, 42.3505]
    },
    {
        id: 2,
        title: "Engineering Workshop",
        location: "Photonics Center",
        time: "3:30 PM",
        attendees: 25,
        status: "starting_soon",
        coords: [-71.1080, 42.3490]
    }
];

/**
 * LandingPage Component
 * Main landing page of the Spark!Bytes application
 * Features:
 * - Interactive map background
 * - Hero section with CTA buttons
 * - How It Works section
 * - Features section
 * - About section with team member cards
 */
export default function LandingPage() {
    const { coords, error, loading } = useUserLocation();
    const router = useRouter();

    /**
     * Handles marker click events on the map
     * @param eventId - ID of the clicked event
     */
    const handleMarkerClick = (eventId: number) => {
        console.log(`Clicked event: ${eventId}`);
    };

    /**
     * Navigates to the login page when Get Started button is clicked
     */
    const handleGetStarted = () => {
        window.location.href = '/login';
    };

    /**
     * Handles smooth scrolling to the About section
     * Prevents default anchor behavior and uses scrollIntoView
     * @param e - Mouse event from the Learn More button click
     */
    const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="min-h-screen bg-zinc-900">
            {/* Hero Section with Map Background */}
            <section className="relative h-screen flex items-center justify-center text-white">
                {/* Map Background */}
                <div className="absolute inset-0 z-0">
                    <Map 
                        events={mockEvents}
                        onMarkerClick={handleMarkerClick}
                        userPos={coords || undefined}
                    />
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 text-center px-4 bg-black/50 py-12 rounded-2xl backdrop-blur-sm max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Spark!Bytes
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-zinc-200">
                        Discover and claim surplus food from events around BU campus
                    </p>
                    {/* Centered CTA Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={handleGetStarted}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Get Started
                        </button>
                        <a 
                            href="#about-section"
                            onClick={handleLearnMore}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Location Prompt */}
            <LocationPrompt loading={loading} error={error} />

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-zinc-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-zinc-700 p-6 rounded-xl">
                            <div className="text-green-400 text-4xl mb-4">1</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Find Events</h3>
                            <p className="text-zinc-300">Discover surplus food events happening around BU campus in real-time.</p>
                        </div>
                        <div className="bg-zinc-700 p-6 rounded-xl">
                            <div className="text-green-400 text-4xl mb-4">2</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Claim Food</h3>
                            <p className="text-zinc-300">Reserve your portion from available events with just a few clicks.</p>
                        </div>
                        <div className="bg-zinc-700 p-6 rounded-xl">
                            <div className="text-green-400 text-4xl mb-4">3</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Pickup</h3>
                            <p className="text-zinc-300">Head to the event location and enjoy your free, sustainable meal.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-zinc-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                        Why Use Spark!Bytes?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/10 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Reduce Food Waste</h3>
                                    <p className="text-zinc-400">Help minimize campus food waste while enjoying free meals.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/10 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Real-Time Updates</h3>
                                    <p className="text-zinc-400">Get instant notifications about new food events near you.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/10 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Location-Based</h3>
                                    <p className="text-zinc-400">Find events closest to you with our interactive map.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/10 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Quick & Easy</h3>
                                    <p className="text-zinc-400">Simple process from finding to claiming food events.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Faculty Contact Section */}
            <section className="py-20 px-4 bg-zinc-900">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-zinc-700/50 p-8 md:p-12 rounded-2xl text-center backdrop-blur-sm">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Faculty Access
                        </h2>
                        <div className="space-y-4">
                            <p className="text-xl text-zinc-200">
                                Are you a faculty member interested in posting events?
                            </p>
                            <p className="text-xl">
                                Please contact{' '}
                                <a 
                                    href="mailto:sparkbytesbu@gmail.com"
                                    className="text-green-400 hover:text-green-300 transition-colors duration-200 font-semibold"
                                    aria-label="Email sparkbytes@gmail.com for faculty access"
                                >
                                    sparkbytesbu@gmail.com
                                </a>
                                {' '}to request a faculty access code.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about-section" className="py-20 bg-zinc-900 text-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">About Spark!Bytes</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {teamMembers.map((member, index) => (
                            <div 
                                key={index} 
                                className="w-64 flex-shrink-0 bg-neutral-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200"
                            >
                                {/* Profile Image */}
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral-700 overflow-hidden">
                                    <img 
                                        src={member.imageUrl} 
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Member Info */}
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                    <p className="text-green-400 mb-3">{member.role}</p>
                                    <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
                                    
                                    {/* University Tag */}
                                    <span className="inline-block bg-neutral-700 text-xs text-gray-300 px-3 py-1 rounded-full">
                                        Boston University
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
} 