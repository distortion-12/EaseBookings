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
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
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
                // If client is logged in, show a "Log Out" button
                <button
                  onClick={clientLogout}
                  className="text-red-600 font-medium px-4 py-2 rounded-md text-sm hover:bg-red-50"
                >
                  Log Out
                </button>
              ) : (
                // If not logged in, show the "Client Login" button
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 font-medium px-4 py-2 rounded-md text-sm hover:bg-blue-50"
                >
                  Client Login / Sign Up
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