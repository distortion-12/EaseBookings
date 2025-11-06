import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * The mobile drawer menu for the Platform Homepage.
 */
export default function Drawer({ isOpen, onClose, onCategoryClick }) {
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
                <div className="flex justify-between items-center mb-6">
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
                <nav className="flex flex-col space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Browse by Category
                  </h3>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onCategoryClick('salons'); onClose(); }}
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    Salons
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onCategoryClick('clinics'); onClose(); }}
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    Clinics
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onCategoryClick('consultants'); onClose(); }}
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    Consultants
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onCategoryClick('tutors'); onClose(); }}
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    Tutors
                  </a>
                  <hr className="my-2" />
                  <a
                    href="#"
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    Help
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  >
                    For Businesses
                  </a>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}