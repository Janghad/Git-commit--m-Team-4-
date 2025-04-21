/**
 * AddEventModal Component
 * 
 * A reusable modal component for creating new food events. It provides a form interface
 * for users to input event details including title, time, food offerings, and location.
 * 
 * Recent Updates:
 * - Added loading state management for form submission
 * - Implemented toast notifications for success/error feedback
 * - Updated button styling to match application theme
 * - Enhanced form validation and error handling
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
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BUILDINGS, DIETARY_TAGS } from '@/constants/eventData';
import { EventFormData, EventFormErrors, EventFormProps, FoodOffering } from '@/types/event';
import { toast } from 'react-hot-toast';

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
    initialData?: EventFormData;
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

export default function AddEventModal({ isOpen, onClose, onSubmit, initialData }: AddEventModalProps) {
    // State management for form data and validation errors
    const [formData, setFormData] = useState<EventFormData>({
        title: initialData?.title || '',
        startDateTime: initialData?.startDateTime || new Date(),
        endDateTime: initialData?.endDateTime || new Date(),
        location: initialData?.location || BUILDINGS[0],
        foodOfferings: initialData?.foodOfferings || [{ name: '', dietaryTags: [] }],
        description: initialData?.description || '',
        organizerName: initialData?.organizerName || '',
        organizerEmail: initialData?.organizerEmail || '',
        organizerPhone: initialData?.organizerPhone || '',
        maxAttendees: initialData?.maxAttendees,
        isPublic: initialData?.isPublic ?? true,
    });

    const [errors, setErrors] = useState<EventFormErrors>({});

    // Add loading state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: EventFormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!formData.startDateTime) {
            newErrors.startDateTime = 'Start date and time is required';
        }

        if (!formData.endDateTime) {
            newErrors.endDateTime = 'End date and time is required';
        }

        if (formData.endDateTime < formData.startDateTime) {
            newErrors.endDateTime = 'End time must be after start time';
        }

        if (!formData.location) {
            newErrors.location = 'Location is required';
        }

        if (!formData.organizerName?.trim()) {
            newErrors.organizerName = 'Organizer name is required';
        }

        if (!formData.organizerEmail?.trim()) {
            newErrors.organizerEmail = 'Organizer email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizerEmail)) {
            newErrors.organizerEmail = 'Invalid email format';
        }

        if (formData.organizerPhone && !/^\+?[\d\s-()]+$/.test(formData.organizerPhone)) {
            newErrors.organizerPhone = 'Invalid phone number format';
        }

        const foodOfferingErrors: string[] = [];
        formData.foodOfferings.forEach((offering, index) => {
            if (!offering.name.trim()) {
                foodOfferingErrors[index] = 'Food item name is required';
            }
        });

        if (foodOfferingErrors.length > 0) {
            newErrors.foodOfferings = foodOfferingErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handles form submission with loading state and error handling
     * @param {React.FormEvent} e - Form submission event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
                // Reset form to initial state
                setFormData({
                    title: '',
                    startDateTime: new Date(),
                    endDateTime: new Date(),
                    location: BUILDINGS[0],
                    foodOfferings: [{ name: '', dietaryTags: [] }],
                    description: '',
                    organizerName: '',
                    organizerEmail: '',
                    organizerPhone: '',
                    maxAttendees: undefined,
                    isPublic: true,
                });
                // Show success notification
                toast.success('Event created successfully!');
                onClose();
            } catch (error) {
                // Show error notification and update error state
                toast.error(error instanceof Error ? error.message : 'Failed to create event');
                setErrors(prev => ({
                    ...prev,
                    general: error instanceof Error ? error.message : 'An unexpected error occurred'
                }));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleFoodOfferingChange = (index: number, field: keyof FoodOffering, value: any) => {
        const newFoodOfferings = [...formData.foodOfferings];
        newFoodOfferings[index] = {
            ...newFoodOfferings[index],
            [field]: value,
        };
        setFormData({ ...formData, foodOfferings: newFoodOfferings });
    };

    const addFoodOffering = () => {
        setFormData({
            ...formData,
            foodOfferings: [...formData.foodOfferings, { name: '', dietaryTags: [] }],
        });
    };

    const removeFoodOffering = (index: number) => {
        if (formData.foodOfferings.length > 1) {
            setFormData({
                ...formData,
                foodOfferings: formData.foodOfferings.filter((_, i) => i !== index),
            });
        }
    };

    const toggleDietaryTag = (offeringIndex: number, tagId: string) => {
        const tag = DIETARY_TAGS.find(t => t.id === tagId);
        if (!tag) return;

        const newFoodOfferings = [...formData.foodOfferings];
        const offering = newFoodOfferings[offeringIndex];
        const tagIndex = offering.dietaryTags.findIndex(t => t.id === tag.id);

        if (tagIndex === -1) {
            offering.dietaryTags.push(tag);
        } else {
            offering.dietaryTags.splice(tagIndex, 1);
        }

        setFormData({ ...formData, foodOfferings: newFoodOfferings });
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
                <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-zinc-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
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
                        {/* Event Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
                                Event Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    errors.title ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter event title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDateTime" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    value={formData.startDateTime.toISOString().slice(0, 16)}
                                    onChange={(e) => setFormData({ ...formData, startDateTime: new Date(e.target.value) })}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.startDateTime ? 'border-red-500' : 'border-zinc-600'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.startDateTime && (
                                    <p className="mt-1 text-sm text-red-500">{errors.startDateTime}</p>
                                )}
                            </div>
                        <div>
                                <label htmlFor="endDateTime" className="block text-sm font-medium text-zinc-300 mb-2">
                                    End Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                    id="endDateTime"
                                    value={formData.endDateTime.toISOString().slice(0, 16)}
                                    onChange={(e) => setFormData({ ...formData, endDateTime: new Date(e.target.value) })}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.endDateTime ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                                {errors.endDateTime && (
                                    <p className="mt-1 text-sm text-red-500">{errors.endDateTime}</p>
                            )}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">
                                Location
                            </label>
                            <select
                                id="location"
                                value={formData.location.id}
                                onChange={(e) => {
                                    const building = BUILDINGS.find(b => b.id === e.target.value);
                                    if (building) {
                                        setFormData({ ...formData, location: building });
                                    }
                                }}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    errors.location ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                {BUILDINGS.map((building) => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Enter event description"
                            />
                        </div>

                        {/* Food Offerings */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-zinc-300">
                                    Food Offerings
                                </label>
                                <button
                                    type="button"
                                    onClick={addFoodOffering}
                                    className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Add Item
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {formData.foodOfferings.map((offering, index) => (
                                    <div key={index} className="p-4 border border-zinc-600 rounded-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <input
                                                type="text"
                                                value={offering.name}
                                                onChange={(e) => handleFoodOfferingChange(index, 'name', e.target.value)}
                                                placeholder="Food item name"
                                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                                    errors.foodOfferings?.[index] ? 'border-red-500' : 'border-zinc-600'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFoodOffering(index)}
                                                className="ml-2 text-zinc-400 hover:text-red-400"
                                                disabled={formData.foodOfferings.length === 1}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={offering.description || ''}
                                                onChange={(e) => handleFoodOfferingChange(index, 'description', e.target.value)}
                                                placeholder="Description (optional)"
                                                className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={offering.quantity || ''}
                                                    onChange={(e) => handleFoodOfferingChange(index, 'quantity', e.target.value)}
                                                    placeholder="Quantity (optional)"
                                                    className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={offering.servingSize || ''}
                                                    onChange={(e) => handleFoodOfferingChange(index, 'servingSize', e.target.value)}
                                                    placeholder="Serving size (optional)"
                                                    className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <select
                                                value={offering.temperature || ''}
                                                onChange={(e) => handleFoodOfferingChange(index, 'temperature', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select temperature (optional)</option>
                                                <option value="hot">Hot</option>
                                                <option value="cold">Cold</option>
                                                <option value="room temperature">Room Temperature</option>
                                            </select>

                                            <div>
                                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                                    Dietary Tags
                                                </label>
                                                <select
                                                    onChange={(e) => toggleDietaryTag(index, e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value=""
                                                >
                                                    <option value="">Add dietary tags</option>
                                                    {DIETARY_TAGS.map((tag) => (
                                                        <option key={tag.id} value={tag.id}>
                                                            {tag.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {offering.dietaryTags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300"
                                                        >
                                                            {tag.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleDietaryTag(index, tag.id)}
                                                                className="ml-1 text-blue-300 hover:text-blue-200"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organizer Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Organizer Information</h3>
                            
                            <div>
                                <label htmlFor="organizerName" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Name
                            </label>
                            <input
                                type="text"
                                    id="organizerName"
                                    value={formData.organizerName}
                                    onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.organizerName ? 'border-red-500' : 'border-zinc-600'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Enter organizer name"
                                />
                                {errors.organizerName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.organizerName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="organizerEmail" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="organizerEmail"
                                    value={formData.organizerEmail}
                                    onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.organizerEmail ? 'border-red-500' : 'border-zinc-600'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Enter organizer email"
                                />
                                {errors.organizerEmail && (
                                    <p className="mt-1 text-sm text-red-500">{errors.organizerEmail}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="organizerPhone" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Phone (optional)
                                </label>
                                <input
                                    type="tel"
                                    id="organizerPhone"
                                    value={formData.organizerPhone}
                                    onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.organizerPhone ? 'border-red-500' : 'border-zinc-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Enter phone number (optional)"
                                />
                                {errors.organizerPhone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.organizerPhone}</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Additional Settings</h3>
                            
                            <div>
                                <label htmlFor="maxAttendees" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Maximum Attendees (optional)
                                </label>
                                <input
                                    type="number"
                                    id="maxAttendees"
                                    min="1"
                                    value={formData.maxAttendees || ''}
                                    onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || undefined })}
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter maximum number of attendees"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="h-4 w-4 rounded border-zinc-600 text-blue-500 focus:ring-blue-500 bg-zinc-800"
                                />
                                <label htmlFor="isPublic" className="ml-2 block text-sm text-zinc-300">
                                    Make this event public
                                </label>
                            </div>
                        </div>

                        {errors.general && (
                            <p className="text-sm text-red-500">{errors.general}</p>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4">
                            {/* Cancel button - disabled during submission */}
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            {/* Submit button with loading state */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-green-600 text-white rounded-lg font-medium
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'}
                                    transition-colors duration-200 flex items-center justify-center min-w-[120px]`}
                            >
                                {isSubmitting ? (
                                    <>
                                        {/* Loading spinner */}
                                        <svg 
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                        >
                                            <circle 
                                                className="opacity-25" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4"
                                            />
                                            <path 
                                                className="opacity-75" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Event'
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 