import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEventModal from './AddEventModal';

describe('AddEventModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

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

    it('shows validation errors when submitting empty form', () => {
        render(<AddEventModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Create Event'));
        
        expect(screen.getByText('Event title is required')).toBeInTheDocument();
        expect(screen.getByText('Event time is required')).toBeInTheDocument();
        expect(screen.getByText('At least one food offering is required')).toBeInTheDocument();
        expect(screen.getByText('Location is required')).toBeInTheDocument();
    });

    it('submits the form with valid data', () => {
        render(<AddEventModal {...defaultProps} />);
        
        // Fill in the form
        fireEvent.change(screen.getByLabelText('Event Title'), {
            target: { value: 'Test Event' }
        });
        
        fireEvent.change(screen.getByLabelText('Event Time'), {
            target: { value: '2024-04-15T12:00' }
        });
        
        fireEvent.change(screen.getByLabelText('Food Offerings'), {
            target: { value: 'snacks' }
        });
        
        fireEvent.change(screen.getByLabelText('Location'), {
            target: { value: 'Test Location' }
        });

        fireEvent.click(screen.getByText('Create Event'));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            title: 'Test Event',
            time: '2024-04-15T12:00',
            foodOfferings: ['snacks'],
            location: 'Test Location'
        });
    });

    it('handles multiple food offerings selection', () => {
        render(<AddEventModal {...defaultProps} />);
        
        const select = screen.getByLabelText('Food Offerings');
        fireEvent.change(select, {
            target: { value: ['snacks', 'lunch'] }
        });

        expect(select).toHaveValue(['snacks', 'lunch']);
    });
}); 