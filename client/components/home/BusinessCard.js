/*
 * This component renders a card displaying business information.
 * It shows the business name, type, location, and description, with a link to the business's booking page.
 */

import React from 'react';
import { useRouter } from 'next/router';
import { BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Component to display a summary card for a business.
export default function BusinessCard({ business }) {
  const router = useRouter();

  const handleVisit = () => {
    router.push(`/${business.bookingPageSlug}`);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold mr-4">
            {business.businessName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{business.businessName}</h3>
            <p className="text-sm text-gray-500">{business.businessType || 'Business'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>{business.address?.city || 'Location N/A'}, {business.address?.state}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{business.description || 'No description available.'}</span>
        </div>
      </div>

      <button
        onClick={handleVisit}
        className="w-full bg-white border border-blue-600 text-blue-600 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors"
      >
        Visit Page
      </button>
    </div>
  );
}
