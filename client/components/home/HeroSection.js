// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/components/home/HeroSection.js

/**
 * The main "hero" banner on the Platform Homepage, styled like the Job Portal Hero.
 */
export default function HeroSection({
  city,
  setCity,
  area,
  setArea,
  onSearch,
}) {
  // Mock assets for icons (Job Portal uses assets.search_icon, assets.location_icon)
  const MOCK_ASSETS = {
    search_icon: 'https://placehold.co/16x16/94a3b8/ffffff?text=🔍',
    location_icon: 'https://placehold.co/16x16/94a3b8/ffffff?text=📍',
  };

  // Mock logo data for the 'Trusted by' strip
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
        
        {/* Search form structure from Job Portal's Hero.jsx */}
        <form 
          onSubmit={(e) => onSearch(e, area, city)} 
          className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'
        >
            {/* Service/Title Search Input */}
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
            {/* Location Search Input */}
            <div className='flex items-center flex-1'>
                <img className='h-4 sm:h-5' src={MOCK_ASSETS.location_icon} alt="Location Icon" />
                <input 
                    type='text'
                    placeholder='City or Locality'
                    className='max-sm:text-xs p-2 rounded outline-none w-full border-0'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <button type='submit' className='bg-blue-600 px-6 py-2 rounded text-white m-1'>Search</button>
        </form>
      </div>
        
      {/* Trust logos/strip from Job Portal's Hero.jsx */}
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