// This component renders the footer section of the application, displaying the logo, copyright information, and social media links.
import Link from 'next/link';

// Defines mock URLs for social media icons to be displayed in the footer.
const MOCK_ASSETS = {
  twitter_icon: 'https://placehold.co/38x38/1da1f2/ffffff?text=X',
  facebook_icon: 'https://placehold.co/38x38/4267b2/ffffff?text=F',
  instagram_icon: 'https://placehold.co/38x38/e1306c/ffffff?text=I',
}

export default function Footer() {

  return (
    // Renders the main footer container with a top border and spacing.
    <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20 border-t border-gray-200'>
      
      {/* Renders the application logo or name in the footer. */}
      <span className="text-2xl font-bold text-blue-600" style={{ minWidth: 160 }}>
        AppointEase
      </span>

      {/* Renders the copyright text, dynamically updating the year. */}
      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
        Copyright {new Date().getFullYear()} © AppointEase.com | All rights reserved.
      </p>

      {/* Renders the social media icons with links to respective platforms. */}
      <div className='flex gap-2.5'>
        <img width={38} src={MOCK_ASSETS.twitter_icon} alt="Twitter" />
        <img width={38} src={MOCK_ASSETS.facebook_icon} alt="Facebook" />
        <img width={38} src={MOCK_ASSETS.instagram_icon} alt="Instagram" />
      </div>
    </div>
  );
}