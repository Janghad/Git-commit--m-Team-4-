/**
 * MyEventsModal Component
 * 
 * A modal component for displaying and managing events that the user has RSVP'd to.
 * This component serves as a centralized view for all events the user plans to attend.
 * 
 * Features:
 * - Displays a list of RSVP'd events with key information
 * - Provides quick access to view full event details
 * - Shows empty state when no RSVP'd events exist
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
 * <MyEventsModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   myEvents={userRsvpdEvents}
 *   onViewDetails={(event) => handleViewDetails(event)}
 * />
 * ```
 */

import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { DashboardEvent } from '@/types/event';

/**
 * Props for the MyEventsModal component
 * @interface MyEventsModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function to close the modal
 * @property {DashboardEvent[]} myEvents - Array of events the user has RSVP'd to
 * @property {(event: DashboardEvent) => void} onViewDetails - Callback when viewing event details
 */
interface MyEventsModalProps {
    isOpen: boolean;
    onClose: () => void;
    myEvents: DashboardEvent[];
    onViewDetails: (event: DashboardEvent) => void;
}

export default function MyEventsModal({
    isOpen,
    onClose,
    myEvents,
    onViewDetails
}: MyEventsModalProps) {
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
                            My Events
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
                        {myEvents.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-zinc-400">You haven&apos;t RSVP&apos;d</p>
                                <p className="text-sm text-zinc-500 mt-2">
                                    Events you RSVP to will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-zinc-700/50 rounded-lg p-4 hover:bg-zinc-700/70 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {event.title}
                                            </h3>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 flex items-center">
                                                <CheckIcon className="h-3 w-3 mr-1" />
                                                You&apos;re Going
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
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {event.attendees} attending
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