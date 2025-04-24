import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RsvpButton from './RsvpButton';

describe('RsvpButton', () => {
    const mockToggle = jest.fn();
    
    beforeEach(() => {
        mockToggle.mockClear();
    });
    
    it('renders correctly when not RSVP\'d', () => {
        render(
            <RsvpButton 
                eventId={1}
                count={5}
                isRsvpd={false}
                onToggle={mockToggle}
            />
        );
        
        // Button should show "RSVP"
        expect(screen.getByRole('button', { name: /rsvp to event/i })).toBeInTheDocument();
        expect(screen.getByText('RSVP')).toBeInTheDocument();
        
        // Should show attendee count
        expect(screen.getByText('5 people attending')).toBeInTheDocument();
    });
    
    it('renders correctly when RSVP\'d', () => {
        render(
            <RsvpButton 
                eventId={1}
                count={5}
                isRsvpd={true}
                onToggle={mockToggle}
            />
        );
        
        // Button should show "I'm Going"
        expect(screen.getByRole('button', { name: /cancel attendance/i })).toBeInTheDocument();
        expect(screen.getByText('I\'m Going')).toBeInTheDocument();
        
        // Should show attendee count
        expect(screen.getByText('5 people attending')).toBeInTheDocument();
    });
    
    it('calls onToggle with the eventId when clicked', () => {
        render(
            <RsvpButton 
                eventId={123}
                count={5}
                isRsvpd={false}
                onToggle={mockToggle}
            />
        );
        
        fireEvent.click(screen.getByRole('button'));
        expect(mockToggle).toHaveBeenCalledTimes(1);
        expect(mockToggle).toHaveBeenCalledWith(123);
    });
    
    it('displays singular form when count is 1', () => {
        render(
            <RsvpButton 
                eventId={1}
                count={1}
                isRsvpd={false}
                onToggle={mockToggle}
            />
        );
        
        expect(screen.getByText('1 person attending')).toBeInTheDocument();
    });
    
    it('disables the button when disabled prop is true', () => {
        render(
            <RsvpButton 
                eventId={1}
                count={10}
                isRsvpd={false}
                onToggle={mockToggle}
                disabled={true}
            />
        );
        
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByText('This event has reached maximum capacity')).toBeInTheDocument();
        
        // Click should not trigger onToggle
        fireEvent.click(screen.getByRole('button'));
        expect(mockToggle).not.toHaveBeenCalled();
    });
    
    it('does not show capacity message when RSVP\'d, even if disabled', () => {
        render(
            <RsvpButton 
                eventId={1}
                count={10}
                isRsvpd={true}
                onToggle={mockToggle}
                disabled={true}
            />
        );
        
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.queryByText('This event has reached maximum capacity')).not.toBeInTheDocument();
    });
}); 