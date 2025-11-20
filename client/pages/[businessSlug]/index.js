import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import BusinessNavbar from '@/components/layout/BusinessNavbar';
import ServiceCard from '@/components/booking/ServiceCard';
import BookingFlowModal from '@/components/booking/BookingFlowModal';
import { CalendarIcon, ClockIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function BusinessBookingPage() {
  const router = useRouter();
  const { businessSlug, serviceId } = router.query;

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // We track if the service is already booked (mock state).
  const [isBooked, setIsBooked] = useState(false); 

  // We fetch the business details and services when the slug is available.
  useEffect(() => {
    if (!businessSlug) return;

    const fetchData = async () => {
      // Check for demo slugs first
      if (businessSlug.endsWith('-demo')) {
          // Provide dummy data for demo businesses
          const demoData = {
              'zen-spa-demo': {
                  business: {
                      _id: 'dummy-biz-1',
                      businessName: 'Zen Spa',
                      description: 'Experience tranquility and rejuvenation at Zen Spa.',
                      address: { street: '123 Peace Ave', city: 'New York', state: 'NY', zip: '10001' },
                      phone: '555-0101',
                      website: 'https://zenspa.demo',
                      businessType: 'Spa',
                      createdAt: new Date().toISOString()
                  },
                  services: [
                      { _id: 'dummy-1', name: 'Relaxing Massage', description: 'A 60-minute full body massage.', price: 80, duration: 60, createdAt: new Date().toISOString() },
                      { _id: 'dummy-1b', name: 'Deep Tissue Massage', description: 'Intense massage for muscle relief.', price: 100, duration: 60, createdAt: new Date().toISOString() }
                  ]
              },
              'style-studio-demo': {
                  business: {
                      _id: 'dummy-biz-2',
                      businessName: 'Style Studio',
                      description: 'Modern cuts and styles for everyone.',
                      address: { street: '456 Fashion Blvd', city: 'Los Angeles', state: 'CA', zip: '90001' },
                      phone: '555-0202',
                      website: 'https://stylestudio.demo',
                      businessType: 'Salon',
                      createdAt: new Date().toISOString()
                  },
                  services: [
                      { _id: 'dummy-2', name: 'Haircut & Style', description: 'Professional haircut and styling.', price: 50, duration: 45, createdAt: new Date().toISOString() },
                      { _id: 'dummy-2b', name: 'Coloring', description: 'Full hair coloring service.', price: 120, duration: 120, createdAt: new Date().toISOString() }
                  ]
              },
              'bright-smiles-demo': {
                  business: {
                      _id: 'dummy-biz-3',
                      businessName: 'Bright Smiles',
                      description: 'Your family dental clinic.',
                      address: { street: '789 Tooth Rd', city: 'Chicago', state: 'IL', zip: '60601' },
                      phone: '555-0303',
                      website: 'https://brightsmiles.demo',
                      businessType: 'Clinic',
                      createdAt: new Date().toISOString()
                  },
                  services: [
                      { _id: 'dummy-3', name: 'Dental Checkup', description: 'Comprehensive exam and cleaning.', price: 120, duration: 30, createdAt: new Date().toISOString() }
                  ]
              }
          };

          const data = demoData[businessSlug];
          if (data) {
              setBusiness(data.business);
              setServices(data.services);
              setLoading(false);
              return;
          }
      }

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        // We fetch the business details.
        const businessRes = await axios.get(`${API_URL}/public/business/${businessSlug}`);
        if (businessRes.data.success) {
          setBusiness(businessRes.data.data);
        }

        // We fetch the services offered by the business.
        const servicesRes = await axios.get(`${API_URL}/public/business/${businessSlug}/services`);
        if (servicesRes.data.success) {
          setServices(servicesRes.data.data);
        }

      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessSlug]);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const found = services.find(s => s._id === serviceId);
      setService(found);
    } else {
      setService(null);
    }
  }, [serviceId, services]);

  const handleBookClick = () => {
    if (isBooked) return;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; 
  }

  if (!business) {
    return <div className="flex justify-center items-center h-screen">Business not found</div>;
  }
  
  // If a specific service is selected, we show the service detail view.
  if (service) {
    const postedDate = format(new Date(service.createdAt || Date.now()), 'MMM dd, yyyy');
    return (
      <>
        <Head>
          <title>{service.name} at {business.businessName}</title>
        </Head>

        <BusinessNavbar businessName={business.businessName} />
        
        <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
          <div className='bg-white text-black rounded-lg w-full'>
              
            <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
              <div className='flex flex-col md:flex-row items-center'>
                <div className='h-24 w-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border flex items-center justify-center text-2xl'>
                  {business.businessName[0]}
                </div>
                <div className='text-center md:text-left text-neutral-700'>
                  <h1 className='text-2xl sm:text-4xl font-medium'>{service.name}</h1>
                  <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'> 
                      <span className='flex items-center gap-1'>
                          <UserIcon className='w-4 h-4'/>
                          {business.businessName}
                      </span>
                      <span className='flex items-center gap-1'>
                          <CalendarIcon className='w-4 h-4'/>
                          {business.address?.city || 'Location'}
                      </span>
                      <span className='flex items-center gap-1'>
                          <ClockIcon className='w-4 h-4'/>
                          {service.duration} mins
                      </span>
                      <span className='flex items-center gap-1'>
                          <CurrencyDollarIcon className='w-4 h-4'/>
                          Price: ${service.price}
                      </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
                 <button 
                    onClick={handleBookClick} 
                    disabled={isBooked}
                    className='bg-blue-600 p-2.5 px-10 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400'
                 >
                   {isBooked ? 'Already Booked':'Book Now'}
                 </button> 
                 <p className='mt-1 text-gray-600'>Service Listed: {postedDate}</p>
              </div>
            </div>

            <div className='flex flex-col lg:flex-row justify-between items-start p-6'>
              <div className='w-full lg:w-2/3'>
                <h2 className='font-bold text-2xl mb-4'>Service Description</h2>
                <div className='text-gray-700 whitespace-pre-wrap'>
                  {service.description}
                </div>
                
                <button 
                    onClick={handleBookClick} 
                    disabled={isBooked}
                    className='bg-blue-600 p-2.5 px-10 text-white rounded-full mt-10 font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400'
                >
                   {isBooked ? 'Already Booked':'Book Now'}
                </button>
              </div>
              
              <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5 border-l border-gray-200 lg:pl-8'>
                <h2 className='font-bold text-xl mb-4'>More services from {business.businessName}</h2>
                {services.filter(s => s._id !== service._id).slice(0, 3).map((relService) => (
                  <ServiceCard 
                      key={relService._id} 
                      service={{...relService, business: business }} 
                      businessSlug={businessSlug} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <BookingFlowModal
          isOpen={isModalOpen}
          onClose={closeModal}
          service={service}
          businessSlug={businessSlug}
        />
      </>
    );
  }

  // Default View: Business Landing Page with services list.
  return (
    <>
      <Head>
        <title>{business.businessName} - AppointEase</title>
      </Head>
      <BusinessNavbar businessName={business.businessName} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">{business.businessName}</h1>
          <p className="text-gray-600 mb-4">{business.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>📍 {business.address?.street}, {business.address?.city}</span>
            <span>📞 {business.phone || 'N/A'}</span>
            <span>🌐 {business.website || 'N/A'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Services</h2>
            <div className="space-y-4">
              {services.map(s => (
                <ServiceCard 
                  key={s._id} 
                  service={{...s, business: business}} 
                  businessSlug={businessSlug} 
                />
              ))}
              {services.length === 0 && <p>No services listed yet.</p>}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-xl sticky top-4">
              <h3 className="font-bold text-lg mb-4">Business Info</h3>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold">Type:</span> {business.businessType || 'General'}</p>
                <p><span className="font-semibold">Member since:</span> {new Date(business.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}