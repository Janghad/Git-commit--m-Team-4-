/**
 * FacultyCodeModal Component
 * 
 * A modal component for validating faculty code before accessing the Add Event functionality.
 * This component serves as a security checkpoint to ensure only authorized faculty members
 * can create new events.
 * 
 * Features:
 * - Simple form with code input
 * - Input validation
 * - Error feedback
 * - Consistent styling with other modals
 * 
 * @component
 * @example
 * ```tsx
 * <FacultyCodeModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSuccess={() => handleSuccess()}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Props for the FacultyCodeModal component
 * @interface FacultyCodeModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function to close the modal
 * @property {() => void} onSuccess - Callback function when code is validated successfully
 */
interface FacultyCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// Test faculty code (in production, this would come from a secure backend)
const VALID_FACULTY_CODE = '123';

export default function FacultyCodeModal({
    isOpen,
    onClose,
    onSuccess
}: FacultyCodeModalProps) {
    // State for the faculty code input
    const [facultyCode, setFacultyCode] = useState('');
    // State for error message
    const [error, setError] = useState<string | null>(null);
    // Loading state for button
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handles the form submission and validates the faculty code
     * @param {React.FormEvent} e - Form submission event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Simulate network delay for realistic interaction
        await new Promise(resolve => setTimeout(resolve, 500));

        if (facultyCode === VALID_FACULTY_CODE) {
            setIsSubmitting(false);
            onSuccess();
        } else {
            setError('Invalid code. Please try again.');
            setIsSubmitting(false);
        }
    };

    /**
     * Resets the form when the modal is closed
     */
    const handleClose = () => {
        setFacultyCode('');
        setError(null);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="relative z-50"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-bold text-white">
                            Faculty Authentication
                        </Dialog.Title>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <p className="text-zinc-300 mb-4">
                                Please enter your faculty code to proceed.
                            </p>
                            
                            <label htmlFor="faculty-code" className="block text-sm font-medium text-zinc-400 mb-2">
                                Faculty Code
                            </label>
                            <input
                                id="faculty-code"
                                type="text"
                                value={facultyCode}
                                onChange={(e) => setFacultyCode(e.target.value)}
                                className="w-full bg-zinc-700 text-white-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Enter code"
                                required
                                autoComplete="off"
                            />
                            
                            {error && (
                                <p className="mt-2 text-red-400 text-sm">{error}</p>
                            )}
                        </div>

                        {/* Request Access Information */}
                        <div className="mb-6 p-4 bg-zinc-700/50 rounded-lg border border-zinc-600">
                            <h4 className="text-sm font-medium text-zinc-300 mb-2">Need Access?</h4>
                            <p className="text-sm text-zinc-400">
                                Are you a faculty member interested in posting events?
                            </p>
                            <p className="text-sm text-zinc-400">
                                Please contact{' '}
                                <a
                                    href="mailto:sparkbytesbu@gmail.com"
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                    sparkbytesbu@gmail.com
                                </a>
                                {' '}to request a faculty access code.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-lg bg-green-600 text-white font-medium 
                                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-500'} 
                                    transition-colors`}
                            >
                                {isSubmitting ? 'Verifying...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 