// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/components/layout/Drawer.js

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * The mobile drawer menu for the Platform Homepage.
 */
export default function Drawer({ isOpen, onClose, onCategoryClick }) {
  
  // Navigation Links for the drawer
  const navLinks = [
    { name: 'Home', href: '/', onClick: () => {} },
    { name: 'Help', href: '#', onClick: () => {} },
    { name: 'For Businesses', href: '/login', onClick: () => {} },
  ];

  const categoryLinks = [
    { name: 'Salons', slug: 'salons' },
    { name: 'Clinics', slug: 'clinics' },
    { name: 'Consultants', slug: 'consultants' },
    { name: 'Tutors', slug: 'tutors' },
  ];


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex-1 overflow-y-auto bg-white p-4">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                  <span className="text-xl font-bold text-blue-600">
                    AppointEase
                  </span>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <nav className="flex flex-col space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Browse by Category
                    </h3>
                    {categoryLinks.map(cat => (
                        <a
                            key={cat.slug}
                            href="#"
                            onClick={(e) => { e.preventDefault(); onCategoryClick(cat.slug); onClose(); }}
                            className="text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium transition-colors"
                        >
                            {cat.name}
                        </a>
                    ))}
                  
                    <hr className="my-4" />
                  
                    {navLinks.map(item => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => { 
                                if (item.href === '#') e.preventDefault(); 
                                item.onClick();
                                onClose(); 
                            }}
                            className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium transition-colors"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}