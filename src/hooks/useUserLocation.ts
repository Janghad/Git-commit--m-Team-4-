import { useState, useEffect } from 'react';

interface LocationState {
    coords: [number, number] | null;
    error: string | null;
    loading: boolean;
}

/**
 * Custom hook for managing user location
 * @returns Object containing coordinates, error state, and loading state
 */
export function useUserLocation() {
    const [locationState, setLocationState] = useState<LocationState>({
        coords: null,
        error: null,
        loading: true
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationState(prev => ({
                ...prev,
                error: "Geolocation is not supported by your browser",
                loading: false
            }));
            return;
        }

        // Success handler
        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLocationState({
                coords: [longitude, latitude], // Mapbox expects [lng, lat]
                error: null,
                loading: false
            });
        };

        // Error handler
        const handleError = (error: GeolocationPositionError) => {
            let errorMessage = "Failed to get location";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Please allow location access to see nearby events";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable";
                    break;
                case error.TIMEOUT:
                    errorMessage = "Location request timed out";
                    break;
            }
            setLocationState({
                coords: null,
                error: errorMessage,
                loading: false
            });
        };

        // Watch position options
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        // Start watching position
        const watchId = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            options
        );

        // Cleanup
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return locationState;
} 