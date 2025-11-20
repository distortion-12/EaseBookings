// This component renders the main navigation bar for the platform, featuring the logo, authentication buttons, and a mobile drawer toggle.
import { useState } from 'react';
import { useRouter } from 'next/router';
import Drawer from './Drawer';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext'; 

export default function PlatformNavbar({ onLoginClick }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { clientUser, clientLogout } = useAuth(); 

  // Defines a placeholder function for handling category clicks, as category navigation is not the primary focus of this component.
  const handleCategoryClick = (categorySlug) => {
    console.log(`Navigating to category: ${categorySlug}`);
  };

  return (
    <>
      {/* Renders the navigation bar container with shadow and sticky positioning. */}
      <nav className="shadow py-4 sticky top-0 z-40 bg-white">
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
            
          {/* Renders the application logo, which also serves as a link to the homepage. */}
          <a href="#" onClick={() => router.push('/')} className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="text-2xl font-bold text-blue-600">
              AppointEase
            </span>
          </a>
            
          {/* Renders the authentication buttons, displaying "Log Out" or "Login / Sign Up" based on the user's authentication status. */}
          <div className="flex items-center gap-4 max-sm:text-xs">
            {clientUser ? (
              // Renders the "Log Out" button for authenticated users.
              <button
                onClick={clientLogout}
                className="bg-red-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            ) : (
              // Renders the "Login / Sign Up" button for unauthenticated users, triggering the login action.
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

      {/* Renders the mobile drawer component, controlled by the state, to handle mobile navigation. */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
}