// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/components/layout/PlatformNavbar.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import Drawer from './Drawer';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext'; 

/**
 * The main navigation bar for the Platform Homepage, styled like the Job Portal Navbar.
 */
export default function PlatformNavbar({ onLoginClick }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { clientUser, clientLogout } = useAuth(); 

  // Mock function as category links are not the focus here
  const handleCategoryClick = (categorySlug) => {
    console.log(`Navigating to category: ${categorySlug}`);
  };

  return (
    <>
      {/* Shadow and py-4 match Job Portal styling */}
      <nav className="shadow py-4 sticky top-0 z-40 bg-white">
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
            
          {/* Logo/App Name (Mimics Job Portal's logo behavior) */}
          <a href="#" onClick={() => router.push('/')} className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="text-2xl font-bold text-blue-600">
              AppointEase
            </span>
          </a>
            
          {/* Auth Buttons */}
          <div className="flex items-center gap-4 max-sm:text-xs">
            {clientUser ? (
              // If client is logged in, show a "Log Out" button
              <button
                onClick={clientLogout}
                className="bg-red-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            ) : (
              // If not logged in, show the "Login / Sign Up" button
              <button
                onClick={onLoginClick}
                className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* The Mobile Drawer component - Kept for mobile navigation structure, even if visually minimized */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
}