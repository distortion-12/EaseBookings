/*
 * This component renders a modal that allows users to select their account type.
 * Users can choose to log in as a customer (Client) or as a service provider (Business).
 */

import { useRouter } from 'next/router';
import Modal from './Modal';
import { UserIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

// Modal for selecting between Client and Business login.
export default function AuthModal({ isOpen, onClose, onClientClick }) {
  const router = useRouter();

  const handleBusinessClick = () => {
    onClose();
    router.push('/login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Account Type">
      <div className="space-y-4 py-4">
        <p className="text-gray-600 text-center mb-6">
          How do you want to use AppointEase?
        </p>

        {/* Client Login Option */}
        <button
          onClick={onClientClick}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white px-4 py-3 rounded-full font-medium shadow-md hover:bg-blue-700 transition-colors"
        >
          <UserIcon className="h-5 w-5" />
          <span>I'm a Customer (Book Appointments)</span>
        </button>

        {/* Business Login Option */}
        <button
          onClick={handleBusinessClick}
          className="w-full flex items-center justify-center space-x-3 border border-gray-500 text-gray-700 px-4 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          <BriefcaseIcon className="h-5 w-5" />
          <span>I'm a Service Provider (Business Login)</span>
        </button>
        
        <p className="text-sm text-center text-gray-500 pt-2">
            *Providers will be redirected to the full admin login page.
        </p>

      </div>
    </Modal>
  );
}