# Spark!Bytes - BU Food Surplus Management System

## Project Overview
Spark!Bytes is a software application system developed for Boston University (BU) that facilitates the access and management of surplus food from various BU events and sources. The core idea is to reduce food waste and ensure that extra food reaches eligible BU constituents in a timely and organized fashion.

## Project Structure
```
src/
├── app/                    # Next.js app directory (pages and layouts)
│   ├── (auth)/            # Authentication related pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── food/          # Food management
│   │   ├── notifications/ # Notification center
│   │   └── profile/       # User profile
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── common/           # Shared components (buttons, inputs, etc.)
│   ├── food/             # Food-related components
│   ├── layout/           # Layout components (header, footer, etc.)
│   └── notifications/    # Notification components
├── lib/                  # Utility functions and shared logic
│   ├── supabase/        # Supabase client and utilities
│   ├── auth/            # Authentication utilities
│   └── api/             # API utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── styles/              # Global styles and theme
└── constants/           # Constants and configuration

```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Development Dependencies

The project uses TypeScript for type safety and better development experience. The following type definitions are required:

```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

These packages provide TypeScript type definitions for:
- React (`@types/react`)
- React DOM (`@types/react-dom`)
- Node.js (`@types/node`)

## Development Guidelines

### Component Structure
- Place reusable components in `components/`
- Group related components in subdirectories
- Use index files for clean exports

### State Management
- Use React Context for global state
- Use local state for component-specific state
- Use Supabase for persistent data

## Team Responsibilities

### Frontend Development
- UI/UX implementation
- Component development
- State management
- API integration

### Backend Development
- Supabase setup and configuration
- Database schema design
- API route implementation
- Authentication system

### Testing
- Unit tests for components
- Integration tests for features
- E2E tests for critical paths

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## Mapbox Integration

The project uses Mapbox GL JS for interactive campus mapping and event visualization. The map component provides real-time updates of food events and building statuses across the BU campus.

### Mapbox Features
- Interactive campus map with custom styling
- Real-time event markers with status indicators
- Dynamic lighting based on time of day (dawn, day, dusk, night)
- User location tracking
- Building status visualization
- Custom markers for different event types

### Setup
1. Create a Mapbox account and obtain an access token
2. Add your Mapbox token to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

### Map Component Usage
```typescript
import Map from '@/components/map/Map';

// Example usage
<Map 
  events={events}
  onMarkerClick={(eventId) => handleMarkerClick(eventId)}
  userPos={[latitude, longitude]}
/>
```

### Map Status Indicators
- 🟢 Green: Available events/food
- 🟡 Amber: Upcoming events
- 🔴 Red: Unavailable/closed events

### Map Controls
- Reset View: Returns to default campus view
- Time-based Lighting: Automatically adjusts map lighting based on time of day
- Interactive Markers: Click markers to view event details
