// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/pages/[businessSlug]/index.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import BusinessNavbar from '@/components/layout/BusinessNavbar';
import ServiceCard from '@/components/booking/ServiceCard';
import BookingFlowModal from '@/components/booking/BookingFlowModal';
import { CalendarIcon, ClockIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'; // Icons for details
import { format } from 'date-fns';

export default function BusinessBookingPage() {
  const router = useRouter();
  const { businessSlug, serviceId } = router.query;

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mock 'Already Applied' state
  const [isBooked, setIsBooked] = useState(false); 

  // Fetch business and service data
  useEffect(() => {
    if (!businessSlug) return;

    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        // 1. Fetch Business Details
        const businessRes = await axios.get(`${API_URL}/public/business/${businessSlug}`);
        if (businessRes.data.success) {
          setBusiness(businessRes.data.data);
        }

        // 2. Fetch Services
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
  
  // If serviceId is present and service found, show Service Detail View
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

  // Default View: Business Landing Page (Services List + Reviews)
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