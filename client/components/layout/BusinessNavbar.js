// This component renders the navigation bar for the business-specific pages, including a back link and client authentication controls.
import { useRouter } from 'next/router';
import { useState } from 'react';
import ClientAuthModal from '@/components/booking/ClientAuthModal';
import { useAuth } from '@/context/AuthContext';

export default function BusinessNavbar({ businessName }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clientUser, clientLogout } = useAuth(); // Retrieves the current client user and the logout function from the authentication context.

  return (
    <>
      <nav className="shadow py-4 sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Renders the left side of the navbar, containing the back link to the main platform and the business name. */}
            <div className="flex items-center space-x-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/');
                }}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                &larr; Back to AppointEase
              </a>
              <span className="text-xl font-bold text-gray-800">
                {businessName}
              </span>
            </div>
            
            {/* Renders the authentication buttons, displaying "Log Out" if the user is authenticated, or "Client Login" if not. */}
            <div className="flex items-center">
              {clientUser ? (
                // Renders the "Log Out" button for authenticated users.
                <button
                  onClick={clientLogout}
                  className="bg-red-600 text-white px-6 sm:px-9 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                // Renders the "Client Login" button for unauthenticated users, opening the authentication modal.
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Client Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Renders the client authentication modal, controlled by the state. */}
      <ClientAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}