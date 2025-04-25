# Faculty-Only Event Editing Functionality

## Overview

This feature enhancement restricts the ability to edit events to only the faculty members who created them. The implementation includes:

1. Authentication validation against the current user's role and email
2. UI feedback to indicate editing permissions
3. Toast notifications for unauthorized access attempts
4. Integration with Supabase authentication

## Key Components

### 1. EventDetailsModal Component

The `EventDetailsModal` component has been enhanced to include:

- **Authorization State**: Tracks whether the current user has edit permissions
  ```typescript
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  ```

- **Authorization Check**: The `useEffect` hook fetches the current user and checks if they're a faculty member who created the event
  ```typescript
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Get current user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        // Get user profile to check role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("auth_id", user.id)
          .single();
        
        // Check if user is faculty AND is the event organizer
        if (profile && 
            profile.role === "faculty" && 
            (profile.email === event.organizerEmail)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      checkAuthorization();
    }
  }, [isOpen, event.organizerEmail]);
  ```

- **Edit Button Handler**: The `handleEditClick` function enforces the authorization check
  ```typescript
  const handleEditClick = () => {
    if (!isAuthorized) {
      toast.error("Only the faculty member who created this event can edit it.");
      return;
    }
    
    if (onEditEvent) {
      onEditEvent(event);
    } else {
      toast.error("Edit functionality not available");
    }
  };
  ```

- **Dynamic Button Styling**: The Edit button's appearance changes based on authorization status
  ```tsx
  <button
    type="button"
    onClick={handleEditClick}
    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
      isAuthorized 
        ? 'bg-green-600 text-white hover:bg-green-500'
        : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500 cursor-not-allowed'
    }`}
    aria-label={isAuthorized ? "Edit event" : "Only the organizer can edit this event"}
    title={isAuthorized ? "Edit event" : "Only the faculty member who created this event can edit it"}
  >
    {isLoading ? 'Checking...' : 'Edit'}
  </button>
  ```

### 2. Dashboard Page Component

The `Dashboard` component has been enhanced to handle event editing:

- **Edit Handler Function**: The `handleEditEvent` function provides a callback for the edit operation
  ```typescript
  const handleEditEvent = (event: DashboardEvent) => {
    // In a real implementation, this would open an edit form with the event data
    toast.success(`Editing event: ${event.title}`);
    
    // Close the details modal
    setIsEventDetailsModalOpen(false);
    
    // Show a confirmation toast
    toast(`Faculty member ${event.organizerName} is editing this event`);
  };
  ```

- **Passing Handler to Modal**: The edit handler is passed to the `EventDetailsModal` component
  ```tsx
  <EventDetailsModal
    isOpen={isEventDetailsModalOpen}
    onClose={() => {
      setIsEventDetailsModalOpen(false);
      setSelectedEvent(null);
    }}
    event={selectedEvent}
    isFavorited={isEventFavorited(selectedEvent)}
    onToggleFavorite={handleToggleFavorite}
    isRsvpd={hasUserRsvpd(selectedEvent.id)}
    onToggleRsvp={handleToggleRsvp}
    onEditEvent={handleEditEvent}
  />
  ```

## Authentication Flow

1. When the EventDetailsModal opens, it fetches the current user's information from Supabase
2. It retrieves the user's profile from the `profiles` table to check their role
3. Authorization is granted only if:
   - The user is logged in
   - The user has a "faculty" role
   - The user's email matches the event's organizer email
4. The Edit button is styled appropriately based on this check
5. Attempting to click Edit when unauthorized displays an error toast

## UI/UX Considerations

- **Loading State**: While authorization is being checked, the button displays "Checking..."
- **Visual Feedback**: Unauthorized users see a grayed-out button
- **Accessibility**: The button includes appropriate ARIA labels and title attributes
- **Error Feedback**: Unauthorized access attempts trigger toast notifications

## Potential Future Enhancements

1. Add a full event editing form to actually modify event details
2. Implement real-time updates to the database when events are edited
3. Add audit logging for event modifications
4. Allow department admins to edit events in their department 