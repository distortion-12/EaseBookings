// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/components/layout/BusinessNavbar.js

import { useRouter } from 'next/router';
import { useState } from 'react';
import ClientAuthModal from '@/components/booking/ClientAuthModal';
import { useAuth } from '@/context/AuthContext';

export default function BusinessNavbar({ businessName }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clientUser, clientLogout } = useAuth(); // Get client user and logout

  return (
    <>
      <nav className="shadow py-4 sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* ... (left side) ... */}
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
            
            {/* --- UPDATED BUTTON --- */}
            <div className="flex items-center">
              {clientUser ? (
                // If client is logged in, show a "Log Out" button (Red button style from Job Portal)
                <button
                  onClick={clientLogout}
                  className="bg-red-600 text-white px-6 sm:px-9 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                // If not logged in, show the "Client Login" button (Blue button style from Job Portal)
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

      {/* --- ADD THE MODAL COMPONENT --- */}
      <ClientAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}