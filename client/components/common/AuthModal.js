import Modal from './Modal';
import { useRouter } from 'next/router';
import { UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

/**
 * The "Client or Owner?" popup modal.
 */
// <-- ADD 'onClientClick' TO PROPS
export default function AuthModal({ isOpen, onClose, onClientClick }) { 
  const router = useRouter();

  const handleAdminClick = () => {
    onClose();
    router.push('/login');
  };

  // --- UPDATE THIS FUNCTION ---
  const handleClientClick = () => {
    onClose();
    // Instead of logging, call the function from the parent page
    onClientClick(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to AppointEase"
    >
      <p className="text-sm text-gray-700 mb-6">
        How are you using our platform today?
      </p>
      <div className="space-y-4">
        <button
          onClick={handleClientClick} // <-- This button now works
          className="w-full flex items-center p-6 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
        >
          <UserIcon className="w-8 h-8 text-blue-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              I'm a Client
            </h3>
            <p className="text-gray-600">I want to book or manage appointments.</p>
          </div>
        </button>
        <button
          onClick={handleAdminClick}
          className="w-full flex items-center p-6 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
        >
          <BuildingOfficeIcon className="w-8 h-8 text-green-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              I'm a Business Owner
            </h3>
            <p className="text-gray-600">I want to manage my business.</p>
          </div>
        </button>
      </div>
    </Modal>
  );
}