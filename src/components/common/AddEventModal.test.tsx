import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEventModal from './AddEventModal';
import { BUILDINGS, DIETARY_TAGS } from '@/constants/eventData';
import { EventFormData } from '@/types/event';

describe('AddEventModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn().mockImplementation(() => Promise.resolve());

    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the modal when isOpen is true', () => {
        render(<AddEventModal {...defaultProps} />);
        expect(screen.getByText('Add New Event')).toBeInTheDocument();
    });

    it('does not render the modal when isOpen is false', () => {
        render(<AddEventModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Add New Event')).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        render(<AddEventModal {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Close modal'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('shows validation errors when submitting empty form', async () => {
        render(<AddEventModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Create Event'));
        
        await waitFor(() => {
            expect(screen.getByText('Title is required')).toBeInTheDocument();
            expect(screen.getByText('Organizer name is required')).toBeInTheDocument();
            expect(screen.getByText('Organizer email is required')).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        render(<AddEventModal {...defaultProps} />);
        
        // Fill in required fields
        fireEvent.change(screen.getByLabelText('Event Title'), {
            target: { value: 'Test Event' }
        });

        const now = new Date();
        const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

        fireEvent.change(screen.getByLabelText('Start Date & Time'), {
            target: { value: now.toISOString().slice(0, 16) }
        });

        fireEvent.change(screen.getByLabelText('End Date & Time'), {
            target: { value: later.toISOString().slice(0, 16) }
        });

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test Organizer' }
        });

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' }
        });

        // Fill in food offering
        const foodItemInput = screen.getByPlaceholderText('Food item name');
        fireEvent.change(foodItemInput, {
            target: { value: 'Pizza' }
        });

        // Submit form
        fireEvent.click(screen.getByText('Create Event'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Test Event',
                organizerName: 'Test Organizer',
                organizerEmail: 'test@example.com',
                foodOfferings: [expect.objectContaining({
                    name: 'Pizza',
                    dietaryTags: []
                })],
                location: BUILDINGS[0],
                isPublic: true
            }));
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles food offering management', () => {
        render(<AddEventModal {...defaultProps} />);
        
        // Add new food offering
        fireEvent.click(screen.getByText('Add Item'));
        const foodItems = screen.getAllByPlaceholderText('Food item name');
        expect(foodItems).toHaveLength(2);

        // Fill in food offerings
        fireEvent.change(foodItems[0], { target: { value: 'Pizza' } });
        fireEvent.change(foodItems[1], { target: { value: 'Salad' } });

        // Add dietary tags
        const dietarySelects = screen.getAllByText('Add dietary tags');
        fireEvent.change(dietarySelects[0], { target: { value: DIETARY_TAGS[0].id } });

        // Remove second food offering
        const removeButtons = screen.getAllByLabelText('Remove food offering');
        fireEvent.click(removeButtons[1]);

        // Should be back to one food item
        expect(screen.getAllByPlaceholderText('Food item name')).toHaveLength(1);
    });

    it('initializes with provided data', () => {
        const now = new Date();
        const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

        const initialData = {
            title: 'Initial Event',
            startDateTime: now,
            endDateTime: later,
            location: BUILDINGS[0],
            foodOfferings: [{ name: '', dietaryTags: [] }],
            description: '',
            organizerName: 'Initial Organizer',
            organizerEmail: 'initial@example.com',
            organizerPhone: '',
            maxAttendees: undefined,
            isPublic: false
        } as EventFormData;

        render(<AddEventModal {...defaultProps} initialData={initialData} />);

        expect(screen.getByLabelText('Event Title')).toHaveValue('Initial Event');
        expect(screen.getByLabelText('Name')).toHaveValue('Initial Organizer');
        expect(screen.getByLabelText('Email')).toHaveValue('initial@example.com');
        expect(screen.getByLabelText('Make this event public')).not.toBeChecked();
    });

    it('validates email format', async () => {
        render(<AddEventModal {...defaultProps} />);
        
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'invalid-email' }
        });

        fireEvent.click(screen.getByText('Create Event'));

        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        });
    });

    it('validates end time is after start time', async () => {
        render(<AddEventModal {...defaultProps} />);
        
        const now = new Date();
        const earlier = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours earlier

        fireEvent.change(screen.getByLabelText('Start Date & Time'), {
            target: { value: now.toISOString().slice(0, 16) }
        });

        fireEvent.change(screen.getByLabelText('End Date & Time'), {
            target: { value: earlier.toISOString().slice(0, 16) }
        });

        fireEvent.click(screen.getByText('Create Event'));

        await waitFor(() => {
            expect(screen.getByText('End time must be after start time')).toBeInTheDocument();
        });
    });
}); 