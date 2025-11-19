// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/pages/index.js

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
import ServiceListing from '@/components/ServiceListing'; // Import the new listing component

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClientAuthModalOpen, setIsClientAuthModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();

  // --- Search Filter State (Mimics Job Portal's searchFilter state) ---
  const [searchFilter, setSearchFilter] = useState({
    title: '', // For Service Name/Area search (Job Title)
    location: '', // For City search (Job Location)
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await axios.get(`${API_URL}/public/businesses`);
        if (res.data.success) {
          setBusinesses(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };
    fetchBusinesses();
  }, []);

  const openClientAuthModal = () => {
    setIsAuthModalOpen(false);
    setIsClientAuthModalOpen(true);
  };

  // --- Search Handler: Updates the filter state and scrolls ---
  const handleSearch = (e, area, city) => {
    e.preventDefault();
    setSearchFilter({
      title: area,
      location: city,
    });
    toast.success(`Searching for "${area}" in "${city}"...`);
    // Scroll to the listing section after search
    document.getElementById('service-list')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Filter businesses based on location search
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

          {/* Hero Section - Pass search handler and values */}
          <HeroSection
            city={searchFilter.location}
            setCity={(value) => setSearchFilter(prev => ({...prev, location: value}))}
            area={searchFilter.title}
            setArea={(value) => setSearchFilter(prev => ({...prev, title: value}))}
            onSearch={handleSearch}
          />

          <main className="container 2xl:px-20 mx-auto px-4 py-8">
            
            {/* Featured Businesses Section */}
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

            {/* Service Listing Section - Pass the filter state */}
            <ServiceListing searchFilter={searchFilter} />
          </main>
        </div>

        {/* Modals */}
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