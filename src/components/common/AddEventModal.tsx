/**
 * AddEventModal Component
 * 
 * A reusable modal component for creating new food events. It provides a form interface
 * for users to input event details including title, time, food offerings, and location.
 * The component includes form validation, error handling, and a clean UI that matches
 * the application's design system.
 * 
 * @component
 * @example
 * ```tsx
 * <AddEventModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSubmit={(eventData) => handleEventCreation(eventData)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Props for the AddEventModal component
 * @interface AddEventModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function to close the modal
 * @property {(event: any) => void} onSubmit - Callback function to handle form submission
 */
interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (event: any) => void;
}

/**
 * Predefined food options for the event form
 * @constant {Array<{id: string, name: string}>}
 */
const foodOptions = [
    { id: 'snacks', name: 'Snacks' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'dessert', name: 'Dessert' },
];

/**
 * Form data interface for the event creation form
 * @interface FormData
 */
interface FormData {
    title: string;
    time: string;
    foodOfferings: string[];
    location: string;
}

/**
 * Form errors interface for validation
 * @interface FormErrors
 */
interface FormErrors {
    title: string;
    time: string;
    foodOfferings: string;
    location: string;
}

export default function AddEventModal({ isOpen, onClose, onSubmit }: AddEventModalProps) {
    // State management for form data and validation errors
    const [formData, setFormData] = useState<FormData>({
        title: '',
        time: '',
        foodOfferings: [],
        location: '',
    });

    const [errors, setErrors] = useState<FormErrors>({
        title: '',
        time: '',
        foodOfferings: '',
        location: '',
    });

    /**
     * Handles changes to form input fields
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handles selection of multiple food offerings
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the select element
     */
    const handleFoodSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const selected: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData(prev => ({
            ...prev,
            foodOfferings: selected
        }));
    };

    /**
     * Validates the form data and sets error messages
     * @returns {boolean} True if the form is valid, false otherwise
     */
    const validateForm = (): boolean => {
        const newErrors = {
            title: '',
            time: '',
            foodOfferings: '',
            location: '',
        };

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }
        if (!formData.time) {
            newErrors.time = 'Event time is required';
        }
        if (formData.foodOfferings.length === 0) {
            newErrors.foodOfferings = 'At least one food offering is required';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => !error);
    };

    /**
     * Handles form submission
     * @param {React.FormEvent} e - The form submission event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            // Reset form and close modal on successful submission
            setFormData({
                title: '',
                time: '',
                foodOfferings: [],
                location: '',
            });
            onClose();
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
                <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-zinc-800 p-6 shadow-xl">
                    {/* Modal header */}
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-bold text-white">
                            Add New Event
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Event Title Field */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
                                Event Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border ${
                                    errors.title ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter event title"
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                            />
                            {errors.title && (
                                <p id="title-error" className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Time Field */}
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-zinc-300 mb-2">
                                Event Time
                            </label>
                            <input
                                type="datetime-local"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border ${
                                    errors.time ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.time}
                                aria-describedby={errors.time ? "time-error" : undefined}
                            />
                            {errors.time && (
                                <p id="time-error" className="mt-1 text-sm text-red-500">{errors.time}</p>
                            )}
                        </div>

                        {/* Food Offerings Field */}
                        <div>
                            <label htmlFor="foodOfferings" className="block text-sm font-medium text-zinc-300 mb-2">
                                Food Offerings
                            </label>
                            <select
                                id="foodOfferings"
                                name="foodOfferings"
                                multiple
                                value={formData.foodOfferings}
                                onChange={handleFoodSelection}
                                className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border ${
                                    errors.foodOfferings ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.foodOfferings}
                                aria-describedby={errors.foodOfferings ? "food-offerings-error" : undefined}
                            >
                                {foodOptions.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            {errors.foodOfferings && (
                                <p id="food-offerings-error" className="mt-1 text-sm text-red-500">{errors.foodOfferings}</p>
                            )}
                        </div>

                        {/* Location Field */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border ${
                                    errors.location ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter event location"
                                aria-invalid={!!errors.location}
                                aria-describedby={errors.location ? "location-error" : undefined}
                            />
                            {errors.location && (
                                <p id="location-error" className="mt-1 text-sm text-red-500">{errors.location}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 