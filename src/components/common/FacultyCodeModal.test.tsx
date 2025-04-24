import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FacultyCodeModal from './FacultyCodeModal';

describe('FacultyCodeModal', () => {
    const mockClose = jest.fn();
    const mockSuccess = jest.fn();
    
    beforeEach(() => {
        mockClose.mockClear();
        mockSuccess.mockClear();
    });
    
    it('renders the modal when isOpen is true', () => {
        render(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        expect(screen.getByText('Faculty Authentication')).toBeInTheDocument();
        expect(screen.getByText('Please enter your faculty code to proceed.')).toBeInTheDocument();
        expect(screen.getByLabelText('Faculty Code')).toBeInTheDocument();
    });
    
    it('does not call onSuccess when an invalid code is entered', async () => {
        render(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        const input = screen.getByLabelText('Faculty Code');
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        
        fireEvent.change(input, { target: { value: 'incorrect-code' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Invalid code. Please try again.')).toBeInTheDocument();
        });
        
        expect(mockSuccess).not.toHaveBeenCalled();
    });
    
    it('calls onSuccess when the correct code is entered', async () => {
        render(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        const input = screen.getByLabelText('Faculty Code');
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        
        fireEvent.change(input, { target: { value: '123' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockSuccess).toHaveBeenCalledTimes(1);
        });
    });
    
    it('calls onClose when the Cancel button is clicked', () => {
        render(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        
        expect(mockClose).toHaveBeenCalledTimes(1);
    });
    
    it('calls onClose when the X button is clicked', () => {
        render(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        const closeButton = screen.getByLabelText('Close modal');
        fireEvent.click(closeButton);
        
        expect(mockClose).toHaveBeenCalledTimes(1);
    });
    
    it('resets the form when closed', () => {
        const { rerender } = render(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        const input = screen.getByLabelText('Faculty Code');
        fireEvent.change(input, { target: { value: 'some-code' } });
        
        // Close and reopen the modal
        rerender(
            <FacultyCodeModal 
                isOpen={false}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        rerender(
            <FacultyCodeModal 
                isOpen={true}
                onClose={mockClose}
                onSuccess={mockSuccess}
            />
        );
        
        // Input should be empty after reopening
        const newInput = screen.getByLabelText('Faculty Code');
        expect(newInput).toHaveValue('');
    });
}); 