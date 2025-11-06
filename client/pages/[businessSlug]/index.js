import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BusinessNavbar from '@/components/layout/BusinessNavbar';
import ServiceCard from '@/components/booking/ServiceCard';
import BookingFlowModal from '@/components/booking/BookingFlowModal';

// --- Mock Data (for demo) ---
// In a real app, this would be fetched from your API
const MOCK_BUSINESS_DATA = {
  name: 'The Glow Up Salon',
  address: '123 Beauty Ln, New York, NY 10001',
  phone: '(212) 555-1234',
  hours: '9:00 AM - 6:00 PM',
  bannerUrl: 'https://placehold.co/1200x200/f472b6/ffffff?text=Glow+Up+Salon',
};

const MOCK_SERVICES = [
  {
    _id: '1',
    name: "Women's Haircut & Style",
    description: 'A full cut, wash, and professional styling.',
    duration: 45,
    price: 65,
  },
  {
    _id: '2',
    name: 'Manicure & Pedicure Combo',
    description: 'Relaxing hand and foot treatment with your choice of polish.',
    duration: 60,
    price: 80,
  },
  {
    _id: '3',
    name: '60-Minute Deep Tissue Massage',
    description: 'Targeted massage to relieve chronic muscle tension.',
    duration: 60,
    price: 110,
  },
];
// --- End Mock Data ---

export default function BusinessBookingPage() {
  const router = useRouter();
  const { businessSlug } = router.query;

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch business and service data when the slug is available
  useEffect(() => {
    if (businessSlug) {
      // --- Real Fetching (would look like this) ---
      // const fetchBusinessData = async () => {
      //   try {
      //     // This is the new public endpoint we'd need to create:
      //     const res = await fetch(`/api/public/business/${businessSlug}`);
      //     const data = await res.json();
      //     setBusiness(data.business);
      //     setServices(data.services);
      //   } catch (error) {
      //     console.error("Failed to fetch business data", error);
      //   }
      // };
      // fetchBusinessData();

      // --- Using Mock Data (for now) ---
      setBusiness(MOCK_BUSINESS_DATA);
      setServices(MOCK_SERVICES);
    }
  }, [businessSlug]);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (!business) {
    return <div>Loading business...</div>; // Or a proper loading spinner
  }

  return (
    <>
      <Head>
        <title>Book at {business.name}</title>
      </Head>

      <BusinessNavbar businessName={business.name} />

      {/* Business Header */}
      <header className="bg-white shadow">
        <div className="relative h-48">
          <img
            className="w-full h-full object-cover"
            src={business.bannerUrl}
            alt={`${business.name} banner`}
          />
        </div>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-gray-600 mt-2">
            {business.address} | {business.phone}
          </p>
          <p className="text-green-600 font-semibold mt-1">
            Open today: {business.hours}
          </p>
        </div>
      </header>

      {/* Service List [cite: 51-52] */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Services</h2>
        <div className="space-y-6">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onBookClick={() => handleBookClick(service)}
            />
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      <BookingFlowModal
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
        businessSlug={businessSlug}
      />
    </>
  );
}