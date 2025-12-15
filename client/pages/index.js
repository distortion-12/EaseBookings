import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PlatformNavbar from '@/components/layout/PlatformNavbar';
import HeroSection from '@/components/home/HeroSection';
import CategoryCard from '@/components/home/CategoryCard';
import AuthModal from '@/components/common/AuthModal';
import ClientAuthModal from '@/components/booking/ClientAuthModal';
import toast from 'react-hot-toast';
import Footer from '@/components/layout/Footer'; // <-- 1. IMPORT THE FOOTER

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClientAuthModalOpen, setIsClientAuthModalOpen] = useState(false);
  const router = useRouter();

  // --- STATE FOR SEARCH ---
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');

  const handleCategoryClick = (categorySlug) => {
    router.push(`/category/${categorySlug}`);
  };

  const openClientAuthModal = () => {
    setIsAuthModalOpen(false);
    setIsClientAuthModalOpen(true);
  };

  // --- SEARCH HANDLER ---
  const handleSearch = (e) => {
    e.preventDefault();
    const qCity = city.trim();
    const qArea = area.trim();
    toast.success(`Searching for "${qArea}" in "${qCity}"...`);
    router.push(`/category/salons?city=${encodeURIComponent(qCity)}&q=${encodeURIComponent(qArea)}`);
  };

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

          <HeroSection
            city={city}
            setCity={setCity}
            area={area}
            setArea={setArea}
            onSearch={handleSearch}
          />

          {/* Categories Section */}
          <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryCard
                name="Salons"
                description="Hair, nails, and beauty."
                imageUrl="https://placehold.co/400x300/60a5fa/ffffff?text=Salons"
                onClick={() => handleCategoryClick('salons')}
              />
              <CategoryCard
                name="Clinics"
                description="Health and wellness."
                imageUrl="https://placehold.co/400x300/34d399/ffffff?text=Clinics"
                onClick={() => handleCategoryClick('clinics')}
              />
              <CategoryCard
                name="Consultants"
                description="Business and legal advice."
                imageUrl="https://placehold.co/400x300/fbbf24/ffffff?text=Consultants"
                onClick={() => handleCategoryClick('consultants')}
              />
              <CategoryCard
                name="Tutors"
                description="Academic and music lessons."
                imageUrl="https://placehold.co/400x300/f87171/ffffff?text=Tutors"
                onClick={() => handleCategoryClick('tutors')}
              />
            </div>
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

        <Footer /> {/* <-- 2. ADD THE FOOTER HERE */}
      </div>
    </>
  );
}