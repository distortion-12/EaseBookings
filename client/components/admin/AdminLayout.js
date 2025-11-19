/*
 * This component provides the layout structure for the admin dashboard.
 * It includes a responsive sidebar navigation, a top navbar with user profile actions, and handles authentication checks.
 */

import { Fragment, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  CalendarIcon,
  RectangleStackIcon,
  UsersIcon,
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Navigation configuration for the admin dashboard sidebar.
const navigation = [
  { name: 'Dashboard Home', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Manage Services', href: '/admin/services', icon: RectangleStackIcon },
  { name: 'Appointments Calendar', href: '/admin/calendar', icon: CalendarIcon },
  { name: 'Staff Management', href: '/admin/staff', icon: UsersIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if the user is not authenticated.
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Display a loading spinner while authentication status is being verified.
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className='w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Top Navigation Bar */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
            {/* Brand Logo linking to the homepage */}
            <Link href="/" className='max-sm:w-32 cursor-pointer text-2xl font-bold text-blue-600'>
                AppointEase
            </Link>
            
            {/* User Profile Dropdown */}
            {user && (
                <div className='flex items-center gap-3'>
                    <p className='max-sm:hidden'>Welcome, {user.ownerName}</p>
                    <Menu as="div" className="relative group">
                      <Menu.Button className="-m-1.5 flex items-center p-1.5 cursor-pointer">
                        <div className='w-8 h-8 border rounded-full bg-gray-200 flex items-center justify-center'>
                          {user.ownerName.charAt(0)}
                        </div>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                      >
                          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={logout}
                                    className={classNames(
                                      active ? 'bg-gray-50' : '',
                                      'block w-full text-left px-4 py-2 text-sm leading-6 text-gray-900'
                                    )}
                                  >
                                    Log out
                                  </button>
                                )}
                            </Menu.Item>
                          </Menu.Items>
                      </Transition>
                    </Menu>
                </div>
            )}
        </div>
      </div>


      {/* Main Layout Container */}
      <div className='flex flex-1'>
        {/* Desktop Sidebar Navigation */}
        <div className='w-[220px] min-h-full border-r-2 border-gray-200 max-lg:hidden'>
          <ul className='flex flex-col pt-5 text-gray-800'>
            {navigation.map((item) => (
                <li key={item.name}>
                    <Link
                    href={item.href}
                    className={classNames(
                        router.pathname === item.href
                        ? 'bg-blue-100 border-r-4 border-blue-500 text-blue-600' // Active state styling
                        : 'hover:bg-gray-100 text-gray-800',
                        'group flex gap-x-3 items-center p-3 text-sm leading-6 font-semibold w-full'
                    )}
                    >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                    </Link>
                </li>
            ))}
          </ul>
        </div>
        
        {/* Page Content Area */}
        <main className='flex-1 p-2 sm:p-5'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    {title}
                </h1>
            </div>
            {children}
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <div className="fixed inset-0 bg-black/70" />
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
                    <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1 bg-white">
                        <div className='flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4'>
                            <div className="flex h-16 shrink-0 items-center justify-between">
                                <span className="text-blue-600 text-xl font-bold">Menu</span>
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="-m-2.5 p-2.5 text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={classNames(
                                                router.pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100',
                                                'group flex gap-x-3 items-center rounded-md p-2 text-sm leading-6 font-semibold'
                                            )}
                                            >
                                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                            {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </Dialog>
      </Transition.Root>
      
      {/* Mobile Menu Toggle Button */}
      <button
          type="button"
          className="fixed top-4 left-4 z-40 p-2.5 text-gray-700 lg:hidden bg-white rounded-md shadow"
          onClick={() => setSidebarOpen(true)}
      >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

    </div>
  );
}