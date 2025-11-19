/*
 * This component renders a card displaying service details.
 * It shows the service name, description, price, duration, and provides a button to initiate booking.
 */

import { useRouter } from 'next/router';
import React from 'react';

// Mock assets for display purposes.
const MOCK_ASSETS = {
  company_icon: 'https://placehold.co/32x32/7e22ce/ffffff?text=S', 
};

// Component to display individual service information in a card format.
export default function ServiceCard({ service, businessSlug }) {
  const router = useRouter();

  // Format address for display.
  const address = service.business?.address;
  const locationString = typeof address === 'object' ? `${address.city || ''}` : address;

  // Prepare service data for rendering.
  const serviceToCardProps = {
    title: service.name,
    description: service.description,
    location: locationString || 'Location N/A',
    durationBadge: `${service.duration} min`,
    price: service.price,
    businessName: service.business?.businessName || 'Unknown Business',
  };

  const handleNavigation = () => {
    router.push(`/${businessSlug}?serviceId=${service._id}`); 
    window.scrollTo(0, 0);
  }

  return (
    <div className='border p-6 shadow rounded'>
      <div className='flex justify-between items-center'>
        <img className='h-8' src={MOCK_ASSETS.company_icon} alt={serviceToCardProps.businessName} />
      </div>
      <h4 className='font-medium text-xl mt-2'>{serviceToCardProps.title}</h4>
      <p className='text-gray-500 text-sm font-medium'>
          {serviceToCardProps.businessName}
      </p>
      <div className='flex items-center gap-3 mt-2 text-xs'>
        <span className='bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
            {serviceToCardProps.location}
        </span>
        <span className='bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
            {serviceToCardProps.durationBadge}
        </span>
      </div>
      <p className='text-gray-500 text-sm mt-4'>
        {serviceToCardProps.description.slice(0, 100)}{serviceToCardProps.description.length > 100 ? '...' : ''}
      </p>
      <p className='text-md font-medium text-gray-800 mt-2'>
        <span className='font-semibold'>Price:</span> ${serviceToCardProps.price}
      </p>
      <div className='mt-4 flex gap-4 text-sm'>
        <button onClick={handleNavigation} className='bg-blue-600 text-white px-4 py-2 rounded'>
          Book Now
        </button>
        <button onClick={handleNavigation} className='text-gray-500 border border-gray-500 rounded px-4 py-2'>
          Learn more
        </button>
      </div>
    </div>
  );
}