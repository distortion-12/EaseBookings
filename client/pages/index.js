// This page renders the homepage of the application, featuring a hero section, featured businesses, and a service listing.
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import PlatformNavbar from '@/components/layout/PlatformNavbar';
import HeroSection from '@/components/home/HeroSection';
import BusinessCard from '@/components/home/BusinessCard';
import AuthModal from '@/components/common/AuthModal';
import ClientAuthModal from '@/components/booking/ClientAuthModal';
import toast from 'react-hot-toast';
import Footer from '@/components/layout/Footer';
import ServiceListing from '@/components/ServiceListing'; // Imports the ServiceListing component to display the list of available services.

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClientAuthModalOpen, setIsClientAuthModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const router = useRouter();

  // Defines the state for search filters, including title (service/area) and location (city).
  const [searchFilter, setSearchFilter] = useState({
    title: '', // Stores the search term for service name or area.
    location: '', // Stores the search term for city or location.
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await axios.get(`${API_URL}/public/businesses`);
        if (res.data.success) {
          setBusinesses(res.data.data);
          
          // Extract cities from real businesses
          const realCities = res.data.data.map(b => b.address?.city).filter(Boolean);
          // Add dummy cities that are present in ServiceListing
          const dummyCities = ['New York', 'Los Angeles', 'Chicago'];
          
          setAvailableCities([...new Set([...realCities, ...dummyCities])]);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        // Fallback cities
        setAvailableCities(['New York', 'Los Angeles', 'Chicago']);
      }
    };
    fetchBusinesses();
  }, []);

  const openClientAuthModal = () => {
    setIsAuthModalOpen(false);
    setIsClientAuthModalOpen(true);
  };

  // Handles the search form submission, updates the filter state, and scrolls to the service list.
  const handleSearch = (e, area, city) => {
    e.preventDefault();
    setSearchFilter({
      title: area,
      location: city,
    });
    toast.success(`Searching for "${area}" in "${city}"...`);
    // Scrolls the view to the service listing section for better user experience.
    document.getElementById('service-list')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Filters the list of businesses based on the location search criteria.
  const filteredBusinesses = businesses.filter(business => {
      if (!searchFilter.location) return true;
      return (business.address?.city || '').toLowerCase().includes(searchFilter.location.toLowerCase());
  });

  return (
    <>
      <Head>
        <title>AppointEase - Effortless Booking, Managed.</title>
        <meta
          name="description"
          content="Find and book appointments with local businesses like salons, clinics, and consultants."
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <PlatformNavbar onLoginClick={() => setIsAuthModalOpen(true)} />

          {/* Renders the HeroSection component, passing search state and handlers. */}
          <HeroSection
            city={searchFilter.location}
            setCity={(value) => setSearchFilter(prev => ({...prev, location: value}))}
            area={searchFilter.title}
            setArea={(value) => setSearchFilter(prev => ({...prev, title: value}))}
            onSearch={handleSearch}
            availableCities={availableCities}
          />

          <main className="container 2xl:px-20 mx-auto px-4 py-8">
            
            {/* Renders the Featured Businesses section, displaying a grid of businesses based on the location filter. */}
            {filteredBusinesses.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {searchFilter.location ? `Businesses in ${searchFilter.location}` : 'New Businesses'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredBusinesses.slice(0, 4).map((business) => (
                    <BusinessCard key={business._id} business={business} />
                  ))}
                </div>
              </section>
            )}

            {/* Renders the ServiceListing component, passing the current search filters. */}
            <ServiceListing searchFilter={searchFilter} />
          </main>
        </div>

        {/* Renders the authentication modals for both providers and clients. */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onClientClick={openClientAuthModal}
        />
        <ClientAuthModal
          isOpen={isClientAuthModalOpen}
          onClose={() => setIsClientAuthModalOpen(false)}
        />

        <Footer />
      </div>
    </>
  );
}