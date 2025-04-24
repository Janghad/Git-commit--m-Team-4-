"use client";
import React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Event, MapProps } from "@/types/map";

// Light presets based on time of day
type LightPreset = "dawn" | "day" | "dusk" | "night";

/**
 * Interactive Map Component using Mapbox GL JS
 * 
 * This component renders an interactive map centered on the BU campus, displaying
 * food events and building statuses with custom markers. It includes features like
 * dynamic lighting based on time of day, user location tracking, and interactive markers.
 * 
 * @component
 * @example
 * ```tsx
 * <Map 
 *   events={events}
 *   onMarkerClick={(eventId) => handleMarkerClick(eventId)}
 *   userPos={[42.3505, -71.1097]}
 * />
 * ```
 */
export default function Map({ events, onMarkerClick, userPos }: MapProps) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const mapStateRef = useRef({
        center: [-71.1097, 42.3505] as [number, number],
        zoom: 15,
        pitch: 45
    });

    const [currentLightPreset, setCurrentLightPreset] = useState<LightPreset>("day");

    /**
     * Determines the appropriate color class for a marker based on its status
     * @param status - The current status of the event/building
     * @returns Tailwind CSS classes for marker styling
     */
    function getColorByStatus(status: string) {
        switch (status) {
            case "available":
                return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
            case "unavailable":
                return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
            case "upcoming":
                return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
            default:
                return "gray";
        }
    }

    /**
     * Determines the appropriate light preset based on the current time of day
     * @returns The current light preset ('dawn' | 'day' | 'dusk' | 'night')
     */
    const getLightPresetByTime = useCallback((): LightPreset => {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 8) return "dawn";
        if (hour >= 8 && hour < 17) return "day";
        if (hour >= 17 && hour < 20) return "dusk";
        return "night";
    }, []);

    /**
     * Resets the map view to the default position (BU campus center)
     */
    const resetMapPosition = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: mapStateRef.current.center,
                zoom: mapStateRef.current.zoom,
                pitch: mapStateRef.current.pitch,
                essential: true,
                duration: 1000
            });
        }
    }, []);

    /**
     * Updates the map lighting based on the current time of day
     */
    const updateMapLighting = useCallback(() => {
        const newLightPreset = getLightPresetByTime();
        
        if (newLightPreset !== currentLightPreset && mapRef.current) {
            // Update the visual state
            setCurrentLightPreset(newLightPreset);
            
            // Actually update the map's lighting using Mapbox's configuration API
            mapRef.current.setConfigProperty('basemap', 'lightPreset', newLightPreset);

            // Optionally adjust ambient light intensity based on time of day
            const lightIntensity = {
                dawn: 0.5,
                day: 1.0,
                dusk: 0.3,
                night: 0.1
            }[newLightPreset];

            mapRef.current.setLight({
                intensity: lightIntensity,
                anchor: "viewport"
            });
        }
    }, [currentLightPreset, getLightPresetByTime]);

    // Initialize map with proper configuration
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
        
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLElement,
            style: 'mapbox://styles/mapbox/standard',
            center: mapStateRef.current.center,
            zoom: mapStateRef.current.zoom,
            pitch: mapStateRef.current.pitch,
            antialias: true
        });

        // Set initial light preset and configuration
        const initialLightPreset = getLightPresetByTime();
        setCurrentLightPreset(initialLightPreset);

        // Wait for map to load before setting initial lighting
        mapRef.current.on('load', () => {
            mapRef.current?.setConfigProperty('basemap', 'lightPreset', initialLightPreset);
            
            // Set initial light intensity
            const initialLightIntensity = {
                dawn: 0.5,
                day: 1.0,
                dusk: 0.3,
                night: 0.1
            }[initialLightPreset];

            mapRef.current?.setLight({
                intensity: initialLightIntensity,
                anchor: "viewport"
            });
        });

        // Update lighting every minute
        const lightingInterval = setInterval(updateMapLighting, 60000);

        // Handle map movement
        mapRef.current.on("move", () => {
            if (mapRef.current) {
                const mapCenter = mapRef.current.getCenter();
                mapStateRef.current = {
                    center: [mapCenter.lng, mapCenter.lat],
                    zoom: mapRef.current.getZoom(),
                    pitch: mapRef.current.getPitch()
                };
            }
        });

        return () => {
            clearInterval(lightingInterval);
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [updateMapLighting, getLightPresetByTime]);

    // Handle markers and user position updates
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for each event
        events.forEach((event) => {
            const el = document.createElement("div");
            el.className = getColorByStatus(event.status);

            // Add tooltip on hover
            const tooltip = new mapboxgl.Popup({
                offset: 15,
                closeButton: false,
                className: "bg-zinc-800/90 px-3 py-2 rounded-lg shadow-lg"
            }).setHTML(`
                <div class="text-white">
                    <h3 class="font-semibold">${event.title}</h3>
                    <p class="text-sm text-zinc-300">${event.location}</p>
                    <p class="text-sm text-zinc-300">${event.time}</p>
                </div>
            `);

            el.addEventListener("click", () => {
                onMarkerClick(event.id);
            });

            if (event.coords) {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat(event.coords)
                    .setPopup(tooltip)
                    .addTo(mapRef.current!);
                
                markersRef.current.push(marker);
            }
        });

        // Add user position marker if available
        if (userPos) {
            const userMarkerEl = document.createElement("div");
            userMarkerEl.className = "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

            // Add user location popup
            const userPopup = new mapboxgl.Popup({
                offset: 15,
                closeButton: false,
                className: "bg-zinc-800/90 px-3 py-2 rounded-lg shadow-lg"
            }).setHTML(`
                <div class="text-white">
                    <p class="font-semibold">Your Location</p>
                </div>
            `);

            const userMarker = new mapboxgl.Marker(userMarkerEl)
                .setLngLat(userPos)
                .setPopup(userPopup)
                .addTo(mapRef.current);
            
            markersRef.current.push(userMarker);

            // Fly to user location if it's the first time we're getting it
            const currentCenter = mapRef.current.getCenter();
            if (currentCenter.lng !== userPos[0] || currentCenter.lat !== userPos[1]) {
                mapRef.current.flyTo({
                    center: userPos,
                    zoom: 15,
                    essential: true,
                    duration: 1000
                });
            }
        }

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, [events, onMarkerClick, userPos]);

    return (
        <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
            <div
                id="map-container"
                ref={mapContainerRef}
                className="opacity-100 h-full w-full rounded-[20px] overflow-hidden"
            />
            
            {/* Reset Button */}
            <button 
                onClick={resetMapPosition}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-zinc-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 z-10"
                aria-label="Reset map view"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset View
            </button>
            
            {/* Light Preset Indicator */}
            <div className="absolute top-4 left-4 bg-zinc-800/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium z-10">
                {currentLightPreset === "dawn" && "Dawn 🌅"}
                {currentLightPreset === "day" && "Day ☀️"}
                {currentLightPreset === "dusk" && "Dusk 🌆"}
                {currentLightPreset === "night" && "Night 🌙"}
            </div>
            
            {/* Legend */}
            <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px] z-10">
                <div className="flex items-center gap-0">
                    <div className="h-2 w-2 rounded-full bg-red-400 flex-none"></div>
                    <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">
                        unavailable
                    </div>
                </div>
                <div className="flex items-center gap-0">
                    <div className="h-2 w-2 rounded-full bg-amber-400 flex-none"></div>
                    <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">
                        opening soon
                    </div>
                </div>
                <div className="flex items-center gap-0">
                    <div className="h-2 w-2 rounded-full bg-green-400 flex-none"></div>
                    <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">
                        open now
                    </div>
                </div>
            </div>
        </div>
    );
} 