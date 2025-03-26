/**
 * Header Component
 * This component represents the main navigation header of the application.
 * It includes the application logo/name and navigation links.
 */

import Link from 'next/link';
import { APP_CONFIG } from '@/constants/config';

/**
 * Header component that displays the main navigation bar
 * @returns {JSX.Element} A header element containing the app name and navigation links
 */
export default function Header() {
  return (
    // Main header container with white background and subtle shadow
    <header className="bg-white shadow-sm">
      {/* Navigation container with max width and responsive padding */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for header content */}
        <div className="flex justify-between h-16">
          {/* Left side: App name/logo */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
            </Link>
          </div>
          
          {/* Right side: Navigation links */}
          <div className="flex items-center space-x-4">
            {/* Login link */}
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            {/* Sign up link */}
            <Link href="/signup" className="text-gray-600 hover:text-gray-900">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 