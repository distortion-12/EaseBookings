import { useState } from 'react';
import { useRouter } from 'next/router';
import Drawer from './Drawer';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext'; // <-- 1. IMPORT useAuth

/**
 * The main navigation bar for the Platform Homepage.
 */
export default function PlatformNavbar({ onLoginClick }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { clientUser, clientLogout } = useAuth(); // <-- 2. GET THE CLIENT USER AND LOGOUT

  const handleCategoryClick = (categorySlug) => {
    console.log(`Navigating to category: ${categorySlug}`);
    router.push('/glowupsalon'); // Simulate click
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* ... (Hamburger Menu Icon) ... */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              {/* ... (Logo) ... */}
              <a href="#" onClick={() => router.push('/')} className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500">
                  AppointEase
                </span>
              </a>
              
              {/* ... (Desktop Nav Links) ... */}
              <div className="hidden lg:flex lg:items-center lg:space-x-2">
                <a
                  href="#"
                  onClick={() => router.push('/')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Help
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  For Businesses
                </a>
              </div>
            </div>
            
            {/* --- 3. UPDATED LOGIN BUTTON LOGIC --- */}
            <div className="flex items-center">
              {clientUser ? (
                // If client is logged in, show a "Log Out" button
                <button
                  onClick={clientLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow"
                >
                  Log Out
                </button>
              ) : (
                // If not logged in, show the "Login / Sign Up" button
                <button
                  onClick={onLoginClick}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
            {/* --- END OF UPDATE --- */}

          </div>
        </div>
      </nav>

      {/* The Mobile Drawer component */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
}