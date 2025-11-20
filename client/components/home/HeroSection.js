import { useState } from 'react';

// This component renders the main hero section of the homepage, featuring a search bar for services and locations, and a display of trusted partner logos.
export default function HeroSection({
  city,
  setCity,
  area,
  setArea,
  onSearch,
  availableCities = []
}) {
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Defines mock asset URLs for search and location icons to be used in the search input fields.
  const MOCK_ASSETS = {
    search_icon: 'https://placehold.co/16x16/94a3b8/ffffff?text=🔍',
    location_icon: 'https://placehold.co/16x16/94a3b8/ffffff?text=📍',
  };

  // Defines mock logo URLs for the "Trusted by" section to display partner logos.
  const MOCK_LOGOS = {
      logo1: 'https://placehold.co/60x24/1d4ed8/ffffff?text=Salon',
      logo2: 'https://placehold.co/60x24/059669/ffffff?text=Clinic',
      logo3: 'https://placehold.co/60x24/f97316/ffffff?text=Consult',
      logo4: 'https://placehold.co/60x24/7c3aed/ffffff?text=Tutor',
      logo5: 'https://placehold.co/60x24/475569/ffffff?text=Spa',
      logo6: 'https://placehold.co/60x24/d97706/ffffff?text=Gym',
  }

  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl'> 
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000+ Services to Book</h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Your Next Booking Starts Right Here - Explore the Best Service Offerings and Save Time!</p>
        
        {/* Renders the search form, allowing users to input search criteria for services and locations, and triggers the search function on submission. */}
        <form 
          onSubmit={(e) => onSearch(e, area, city)} 
          className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'
        >
            {/* Renders the input field for searching services, including a search icon and placeholder text. */}
            <div className='flex items-center flex-1'>
                <img className='h-4 sm:h-5' src={MOCK_ASSETS.search_icon} alt="Search Icon" />
                <input
                    type='text'
                    placeholder='Search for services (Haircut, Tax Consult)'
                    className='max-sm:text-xs p-2 rounded outline-none w-full border-0'
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />
            </div>
            {/* Renders the input field for searching locations (city or locality), including a location icon and placeholder text. */}
            <div className='flex items-center flex-1 relative'>
                <img className='h-4 sm:h-5' src={MOCK_ASSETS.location_icon} alt="Location Icon" />
                <input 
                    type='text'
                    placeholder='City or Locality'
                    className='max-sm:text-xs p-2 rounded outline-none w-full border-0'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                />
                {showCitySuggestions && (
                    <ul 
                        className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1 text-left"
                        onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking dropdown/scrollbar
                    >
                        {availableCities
                            .filter(c => c.toLowerCase().includes((city || '').toLowerCase()))
                            .map((c, index) => (
                            <li 
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                                onClick={() => {
                                    setCity(c);
                                    setShowCitySuggestions(false);
                                }}
                            >
                                {c}
                            </li>
                        ))}
                        {availableCities.filter(c => c.toLowerCase().includes((city || '').toLowerCase())).length === 0 && city && (
                             <li className="px-4 py-2 text-sm text-gray-500">No cities found</li>
                        )}
                    </ul>
                )}
            </div>
            <button type='submit' className='bg-blue-600 px-6 py-2 rounded text-white m-1'>Search</button>
        </form>
      </div>
        
      {/* Renders the "Trusted by" section, displaying a list of partner logos to build user trust. */}
      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
         <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
          <p className='font-medium'>Trusted by</p>
          <img className='h-6' src={MOCK_LOGOS.logo1} alt="Salon" />
          <img className='h-6' src={MOCK_LOGOS.logo2} alt="Clinic" />
          <img className='h-6' src={MOCK_LOGOS.logo3} alt="Consultant" />
          <img className='h-6' src={MOCK_LOGOS.logo4} alt="Tutor" />
          <img className='h-6' src={MOCK_LOGOS.logo5} alt="Spa" />
          <img className='h-6' src={MOCK_LOGOS.logo6} alt="Gym" />
          </div> 
      </div>
    </div>
  );
}