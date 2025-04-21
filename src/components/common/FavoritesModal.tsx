/**
 * FavoritesModal Component
 * 
 * A modal component for displaying and managing favorited events.
 * This component serves as a centralized view for all events that a user has marked as favorite.
 * 
 * Features:
 * - Displays a list of favorited events with key information
 * - Provides quick access to view full event details
 * - Shows empty state when no favorites exist
 * - Maintains consistent styling with other modals
 * 
 * Design Considerations:
 * - Scrollable content area for long lists
 * - Responsive layout
 * - Clear visual hierarchy
 * - Interactive hover states
 * - Accessible controls
 * 
 * @component
 * @example
 * ```tsx
 * <FavoritesModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   favoriteEvents={userFavorites}
 *   onViewDetails={(event) => handleViewDetails(event)}
 * />
 * ```
 */

import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DashboardEvent } from '@/types/event';

/**
 * Props for the FavoritesModal component
 * @interface FavoritesModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function to close the modal
 * @property {DashboardEvent[]} favoriteEvents - Array of events marked as favorites
 * @property {(event: DashboardEvent) => void} onViewDetails - Callback when viewing event details
 */
interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    favoriteEvents: DashboardEvent[];
    onViewDetails: (event: DashboardEvent) => void;
}

export default function FavoritesModal({
    isOpen,
    onClose,
    favoriteEvents,
    onViewDetails
}: FavoritesModalProps) {
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
                <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-zinc-800 p-6 shadow-xl max-h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-bold text-white">
                            My Favorites
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
                    <div className="flex-1 overflow-y-auto">
                        {favoriteEvents.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-zinc-400">No favorite events yet</p>
                                <p className="text-sm text-zinc-500 mt-2">
                                    Events you favorite will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {favoriteEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-zinc-700/50 rounded-lg p-4 hover:bg-zinc-700/70 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {event.title}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                event.status === 'available'
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-amber-500/20 text-amber-300'
                                            }`}>
                                                {event.status === 'available' ? 'Available Now' : 'Starting Soon'}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-zinc-300 mb-4">
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
                                        </div>
                                        <button
                                            onClick={() => onViewDetails(event)}
                                            className="w-full bg-zinc-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 