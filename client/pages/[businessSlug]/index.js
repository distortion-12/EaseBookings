import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BusinessNavbar from '@/components/layout/BusinessNavbar';
import ServiceCard from '@/components/booking/ServiceCard';
import BookingFlowModal from '@/components/booking/BookingFlowModal';

// --- Mock Data (for demo) ---
// In a real app, this would be fetched from your API
const DEMO_BUSINESSES = {
  glowupsalon: {
    category: 'salons',
    name: 'The Glow Up Salon',
    address: '123 Beauty Ln, New York, NY 10001',
    phone: '(212) 555-1234',
    hours: '9:00 AM - 6:00 PM',
    bannerUrl: 'https://placehold.co/1200x200/f472b6/ffffff?text=Glow+Up+Salon',
    services: [
      { _id: 's1', name: "Women's Haircut & Style", description: 'A full cut, wash, and professional styling.', duration: 45, price: 65 },
      { _id: 's2', name: 'Manicure & Pedicure Combo', description: 'Relaxing hand and foot treatment with your choice of polish.', duration: 60, price: 80 },
      { _id: 's3', name: '60-Minute Deep Tissue Massage', description: 'Targeted massage to relieve chronic muscle tension.', duration: 60, price: 110 },
    ],
  },
  wellcareclinic: {
    category: 'clinics',
    name: 'WellCare Clinic',
    address: '75 Wellness Ave, New York, NY 10002',
    phone: '(212) 555-9001',
    hours: '8:00 AM - 5:00 PM',
    bannerUrl: 'https://placehold.co/1200x200/34d399/ffffff?text=WellCare+Clinic',
    services: [
      { _id: 'c1', name: 'General Consultation', description: 'Comprehensive primary care consultation.', duration: 30, price: 50 },
      { _id: 'c2', name: 'Dental Cleaning', description: 'Routine cleaning and hygiene check.', duration: 45, price: 90 },
      { _id: 'c3', name: 'Blood Work Panel', description: 'Standard diagnostic panel.', duration: 20, price: 70 },
    ],
  },
  smiledental: {
    category: 'clinics',
    name: 'Smile Dental',
    address: '14 Market St, San Francisco, CA 94103',
    phone: '(415) 555-7123',
    hours: '9:00 AM - 6:00 PM',
    bannerUrl: 'https://placehold.co/1200x200/22c55e/ffffff?text=Smile+Dental',
    services: [
      { _id: 'd1', name: 'Dental Checkup', description: 'Routine dental exam and x-rays.', duration: 40, price: 120 },
      { _id: 'd2', name: 'Teeth Whitening', description: 'Professional whitening treatment.', duration: 60, price: 200 },
      { _id: 'd3', name: 'Cavity Filling', description: 'Composite filling for cavities.', duration: 45, price: 150 },
    ],
  },
  urbancuts: {
    category: 'salons',
    name: 'Urban Cuts',
    address: '210 Mission St, San Francisco, CA 94105',
    phone: '(415) 555-1100',
    hours: '10:00 AM - 7:00 PM',
    bannerUrl: 'https://placehold.co/1200x200/60a5fa/ffffff?text=Urban+Cuts',
    services: [
      { _id: 'u1', name: "Men's Haircut", description: 'Classic and modern styles.', duration: 30, price: 40 },
      { _id: 'u2', name: 'Beard Trim', description: 'Precision beard grooming.', duration: 20, price: 25 },
      { _id: 'u3', name: 'Kids Haircut', description: 'Gentle and friendly cuts for kids.', duration: 25, price: 30 },
    ],
  },
  blissbeauty: {
    category: 'salons',
    name: 'Bliss Beauty',
    address: '500 Lakeshore Dr, Chicago, IL 60601',
    phone: '(312) 555-2222',
    hours: '9:00 AM - 5:30 PM',
    bannerUrl: 'https://placehold.co/1200x200/93c5fd/ffffff?text=Bliss+Beauty',
    services: [
      { _id: 'b1', name: 'Facial Therapy', description: 'Rejuvenating skin treatment.', duration: 50, price: 95 },
      { _id: 'b2', name: 'Aromatherapy Massage', description: 'Relaxing full-body massage.', duration: 60, price: 120 },
      { _id: 'b3', name: 'Brow Shaping', description: 'Precision brow styling.', duration: 20, price: 25 },
    ],
  },
  pulsehealth: {
    category: 'clinics',
    name: 'Pulse Health',
    address: '88 River Rd, Chicago, IL 60607',
    phone: '(312) 555-6677',
    hours: '7:30 AM - 4:30 PM',
    bannerUrl: 'https://placehold.co/1200x200/86efac/111111?text=Pulse+Health',
    services: [
      { _id: 'p1', name: 'Cardio Screening', description: 'ECG and blood pressure assessment.', duration: 30, price: 85 },
      { _id: 'p2', name: 'Nutrition Consult', description: 'Dietary planning session.', duration: 45, price: 100 },
      { _id: 'p3', name: 'Physio Session', description: 'Physiotherapy for recovery.', duration: 60, price: 130 },
    ],
  },
};
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
      const demo = DEMO_BUSINESSES[String(businessSlug).toLowerCase()];
      if (demo) {
        // Choose category-specific photo banner
        const cat = String(demo.category || '').toLowerCase();
        const bannerPhoto =
          cat === 'salons'
            ? 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/d34a4864987187.5ae48c9c9aa47.jpg'
            : cat === 'clinics'
            ? 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600&auto=format&fit=crop'
            : cat === 'consultants'
            ? 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop'
            : cat === 'tutors'
            ? 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop'
            : demo.bannerUrl;

        setBusiness({
          name: demo.name,
          address: demo.address,
          phone: demo.phone,
          hours: demo.hours,
          bannerUrl: bannerPhoto,
        });
        setServices(demo.services);
      } else {
        // Fallback to a simple placeholder
        setBusiness({
          name: 'Demo Business',
          address: '123 Demo St',
          phone: '(000) 000-0000',
          hours: '9:00 AM - 5:00 PM',
          bannerUrl: 'https://placehold.co/1200x200/cccccc/111111?text=Demo+Business',
        });
        setServices([]);
      }
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