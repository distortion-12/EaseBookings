// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/components/layout/Footer.js

import Link from 'next/link';

// Mock social icons (Job Portal used placeholder SVGs)
const MOCK_ASSETS = {
  twitter_icon: 'https://placehold.co/38x38/1da1f2/ffffff?text=X',
  facebook_icon: 'https://placehold.co/38x38/4267b2/ffffff?text=F',
  instagram_icon: 'https://placehold.co/38x38/e1306c/ffffff?text=I',
}

export default function Footer() {

  return (
    // Matching Job Portal's footer wrapper
    <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20 border-t border-gray-200'>
      
      {/* Mock Logo */}
      <span className="text-2xl font-bold text-blue-600" style={{ minWidth: 160 }}>
        AppointEase
      </span>

      {/* Copyright text (Matching Job Portal's text layout) */}
      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
        Copyright {new Date().getFullYear()} © AppointEase.com | All rights reserved.
      </p>

      {/* Social Icons */}
      <div className='flex gap-2.5'>
        <img width={38} src={MOCK_ASSETS.twitter_icon} alt="Twitter" />
        <img width={38} src={MOCK_ASSETS.facebook_icon} alt="Facebook" />
        <img width={38} src={MOCK_ASSETS.instagram_icon} alt="Instagram" />
      </div>
    </div>
  );
}