import React from 'react';

interface LocationPromptProps {
    loading: boolean;
    error: string | null;
}

/**
 * Component that displays location access status and prompts
 */
export default function LocationPrompt({ loading, error }: LocationPromptProps) {
    if (loading) {
        return (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Getting your location...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    return null;
} 