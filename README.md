# Spark!Bytes 🍽️

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.4-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Overview

Spark!Bytes is a modern web application developed for Boston University (BU) that revolutionizes the management and distribution of surplus food from campus events. Our mission is to reduce food waste while ensuring that excess food reaches those who need it most within the BU community.

### Core Features

- 🗺️ **Interactive Campus Map**: Real-time visualization of food events across BU campus
- 🔔 **Smart Notifications**: Instant alerts for new events and RSVP updates
- 👥 **Role-Based Access**: Separate interfaces for students and faculty
- 📱 **Responsive Design**: Seamless experience across all devices
- 🔒 **Secure Authentication**: Supabase-powered authentication system
- 📊 **Real-time Updates**: Live event status and RSVP tracking

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Headless UI
- **State Management**: React Context + Local State
- **Maps**: Mapbox GL JS
- **Notifications**: React Hot Toast

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **Real-time**: Supabase Realtime

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Testing**: Jest + React Testing Library
- **Build Tool**: Turbopack
- **Type Checking**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later
- Supabase account
- Mapbox account

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Janghad/Git-commit--m-Team-4-.git
   cd sparkbytes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Lint code:
   ```bash
   npm run lint
   ```

### Production Build

1. Create a production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── common/           # Shared components
│   ├── food/             # Food-related components
│   ├── layout/           # Layout components
│   └── notifications/    # Notification components
├── lib/                  # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── constants/           # Project constants
```

## Key Features

### Interactive Map
- Real-time event visualization
- Dynamic lighting based on time of day
- User location tracking
- Custom markers for different event types

### Event Management
- Create and edit events (faculty only)
- RSVP system with capacity tracking
- Real-time status updates
- Location-based event discovery

### User System
- Role-based access control
- Profile management
- Dietary preferences
- Event history

## Contributing







## Team

- Ryan Rodriguez - Full Stack Developer
- Ben Bucaj - Full Stack Developer
- Jason Anghad - Full Stack Developer
- Nicole Lin - Full Stack Developer

## License

This project is proprietary and confidential. All rights reserved.


