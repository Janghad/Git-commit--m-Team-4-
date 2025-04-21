/**
 * SettingsModal Component
 * 
 * A modal component for displaying and managing user settings. This component follows
 * the same design patterns as the AddEventModal for consistency. It displays user
 * account information and provides options for account management.
 * 
 * @component
 * @example
 * ```tsx
 * <SettingsModal
 *   isOpen={isSettingsOpen}
 *   onClose={() => setIsSettingsOpen(false)}
 *   userData={{ username: "John Doe", email: "john@example.com" }}
 *   onSignOut={handleSignOut}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

/**
 * Props for the SettingsModal component
 * @interface SettingsModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function to close the modal
 * @property {object} userData - Object containing user data to display
 * @property {() => Promise<void>} onSignOut - Callback function to handle sign out
 */
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        username: string;
        email: string;
    };
    onSignOut: () => Promise<void>;
}

export default function SettingsModal({ isOpen, onClose, userData, onSignOut }: SettingsModalProps) {
    const [userRole, setUserRole] = useState<string>("Loading...");

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("auth_id", user.id)
                        .single();

                    if (data && !error) {
                        // Capitalize first letter of role
                        setUserRole(data.role.charAt(0).toUpperCase() + data.role.slice(1));
                    } else {
                        setUserRole("Not specified");
                    }
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                setUserRole("Error loading");
            }
        };

        fetchUserRole();
    }, []);

    /**
     * Handles the sign out process
     * Closes the modal and calls the provided onSignOut callback
     */
    const handleSignOut = async () => {
        try {
            await onSignOut();
            onClose(); // Close the modal after successful sign out
        } catch (error) {
            console.error('Error signing out:', error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
                    {/* Modal header */}
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-bold text-white">
                            Account Settings
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Settings content */}
                    <div className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Username
                            </label>
                            <div className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600">
                                {userData.username}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <div className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600">
                                {userData.email}
                            </div>
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Account Type
                            </label>
                            <div className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600">
                                {userRole}
                            </div>
                        </div>

                        {/* Password (placeholder) */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Password
                            </label>
                            <div className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600">
                                ••••••••
                            </div>
                            <button className="mt-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                                Change Password
                            </button>
                        </div>

                        {/* Sign Out button */}
                        <button
                            onClick={handleSignOut}
                            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <span>Sign Out</span>
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 