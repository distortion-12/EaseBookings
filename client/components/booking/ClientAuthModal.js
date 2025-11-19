/*
 * This component renders a modal for client authentication (login and registration).
 * It uses tabs to switch between login and sign-up forms and handles form submission via the AuthContext.
 */

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import { Tab } from '@headlessui/react';

// Helper function to conditionally join class names.
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Modal component for client login and registration.
export default function ClientAuthModal({ isOpen, onClose }) {
  const { clientLogin, clientRegister } = useAuth();
  
  const [loading, setLoading] = useState(false);

  // State for login form inputs.
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State for registration form inputs.
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await clientLogin(loginEmail, loginPassword);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await clientRegister(regName, regEmail, regPassword, regPhone);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Client Account">
      <div className="w-full max-w-md">
        <Tab.Group>
          {/* Tab Navigation */}
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                )
              }
            >
              Log In
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                )
              }
            >
              Sign Up
            </Tab>
          </Tab.List>
          
          <Tab.Panels className="mt-4">
            {/* Login Form Panel */}
            <Tab.Panel>
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="loginEmail" className="sr-only">Email</label>
                    <span className='text-gray-500'>✉️</span> 
                    <input
                      id="loginEmail"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                      placeholder='Email Id'
                    />
                </div>
                
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="loginPassword" className="sr-only">Password</label>
                    <span className='text-gray-500'>🔒</span> 
                    <input
                      id="loginPassword"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                      placeholder='Password'
                    />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            </Tab.Panel>

            {/* Registration Form Panel */}
            <Tab.Panel>
              <form onSubmit={handleRegister} className="space-y-4">
                
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="regName" className="sr-only">Full Name</label>
                    <span className='text-gray-500'>👤</span> 
                    <input
                      id="regName"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                      placeholder='Full Name'
                    />
                </div>
                
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="regEmail" className="sr-only">Email</label>
                    <span className='text-gray-500'>✉️</span> 
                    <input
                      id="regEmail"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                      placeholder='Email Id'
                    />
                </div>
                
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="regPassword" className="sr-only">Password</label>
                    <span className='text-gray-500'>🔒</span> 
                    <input
                      id="regPassword"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength="6"
                      className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                      placeholder='Password'
                    />
                </div>
                
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="regPhone" className="sr-only">Phone (Optional)</label>
                    <span className='text-gray-500'>📞</span> 
                    <input
                      id="regPhone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                      placeholder='Phone (Optional)'
                    />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Modal>
  );
}