"use client";

import { useRouter } from "next/navigation";
import Map from '@/components/map/Map';
import { useUserLocation } from '@/hooks/useUserLocation';
import LocationPrompt from '@/components/common/LocationPrompt';
import { Event } from '@/types/map';

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

export default function LandingPage() {
    const router = useRouter();
    const { coords, error, loading } = useUserLocation();

    const handleGetStarted = () => {
        router.push('/login');
    };

    const handleMarkerClick = (eventId: number) => {
        console.log(`Clicked event: ${eventId}`);
        // Add your event click handling logic here
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
                    <button 
                        onClick={handleGetStarted}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* Location Prompt */}
            <LocationPrompt loading={loading} error={error} />

            {/* Additional Landing Page Sections */}
            <section className="py-20 px-4 bg-zinc-800">
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
                        Why Use SparkBytes?
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
        </main>
    );
} 