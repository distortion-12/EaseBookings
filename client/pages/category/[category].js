import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import PlatformNavbar from '@/components/layout/PlatformNavbar';
import Footer from '@/components/layout/Footer';
import CategoryCard from '@/components/home/CategoryCard';
import axios from 'axios';

// Demo dataset per category with demo cities
const DEMO_DATA = {
  salons: {
    title: 'Top Salons',
    businesses: [
      { slug: 'glowupsalon', name: 'Glow Up Salon', city: 'New York', bannerUrl: 'https://placehold.co/1200x200/f472b6/ffffff?text=Glow+Up+Salon', description: 'Hair, nails, and beauty.' },
      { slug: 'urbancuts', name: 'Urban Cuts', city: 'San Francisco', bannerUrl: 'https://placehold.co/1200x200/60a5fa/ffffff?text=Urban+Cuts', description: 'Modern styles and classic cuts.' },
      { slug: 'blissbeauty', name: 'Bliss Beauty', city: 'Chicago', bannerUrl: 'https://placehold.co/1200x200/93c5fd/ffffff?text=Bliss+Beauty', description: 'Spa and salon services.' },
    ],
  },
  clinics: {
    title: 'Trusted Clinics',
    businesses: [
      { slug: 'wellcareclinic', name: 'WellCare Clinic', city: 'New York', bannerUrl: 'https://placehold.co/1200x200/34d399/ffffff?text=WellCare+Clinic', description: 'Primary care and wellness.' },
      { slug: 'smiledental', name: 'Smile Dental', city: 'San Francisco', bannerUrl: 'https://placehold.co/1200x200/22c55e/ffffff?text=Smile+Dental', description: 'Family dentistry and hygiene.' },
      { slug: 'pulsehealth', name: 'Pulse Health', city: 'Chicago', bannerUrl: 'https://placehold.co/1200x200/86efac/111111?text=Pulse+Health', description: 'Diagnostics and consultation.' },
    ],
  },
  consultants: {
    title: 'Business & Legal Consultants',
    businesses: [
      { slug: 'insightadvisors', name: 'Insight Advisors', city: 'New York', bannerUrl: 'https://placehold.co/1200x200/f59e0b/ffffff?text=Insight+Advisors', description: 'Business strategy and growth.' },
      { slug: 'lexlegal', name: 'Lex Legal', city: 'San Francisco', bannerUrl: 'https://placehold.co/1200x200/fbbf24/111111?text=Lex+Legal', description: 'Legal consulting for startups.' },
      { slug: 'opsgurus', name: 'Ops Gurus', city: 'Chicago', bannerUrl: 'https://placehold.co/1200x200/fde68a/111111?text=Ops+Gurus', description: 'Operational excellence consulting.' },
    ],
  },
  tutors: {
    title: 'Top Tutors',
    businesses: [
      { slug: 'mathmasters', name: 'Math Masters', city: 'New York', bannerUrl: 'https://placehold.co/1200x200/f87171/ffffff?text=Math+Masters', description: 'Math tutoring for all grades.' },
      { slug: 'codecamp', name: 'Code Camp', city: 'San Francisco', bannerUrl: 'https://placehold.co/1200x200/ef4444/ffffff?text=Code+Camp', description: 'Programming lessons and bootcamps.' },
      { slug: 'musicmentors', name: 'Music Mentors', city: 'Chicago', bannerUrl: 'https://placehold.co/1200x200/fca5a5/111111?text=Music+Mentors', description: 'Instrument and vocal training.' },
    ],
  },
};

const DEMO_CITIES = ['New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Seattle'];

export default function CategoryPage() {
  const router = useRouter();
  const { category, city, q } = router.query;
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const dataset = DEMO_DATA[category] || { title: 'Category', businesses: [] };

  useEffect(() => {
    if (category) {
      fetchBusinesses();
    }
  }, [category, city]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const params = city ? `?city=${encodeURIComponent(city)}` : '';
      const res = await axios.get(`${apiUrl}/api/business/category/${category}${params}`);
      
      // Convert API businesses to match demo format
      const apiBusinesses = res.data.data.map(b => ({
        slug: b.config?.bookingPageSlug || b._id,
        name: b.businessName,
        city: b.city,
        description: `${b.address} | ${b.phone}`,
        bannerUrl: `https://placehold.co/1200x200/93c5fd/ffffff?text=${encodeURIComponent(b.businessName)}`,
      }));

      // Merge with demo data
      const allBusinesses = [...apiBusinesses, ...dataset.businesses];
      const filtered = city 
        ? allBusinesses.filter(b => b.city.toLowerCase() === city.toLowerCase())
        : allBusinesses;
      
      setBusinesses(filtered);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      // Fallback to demo data
      const filtered = city
        ? dataset.businesses.filter(b => b.city.toLowerCase() === city.toLowerCase())
        : dataset.businesses;
      setBusinesses(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{dataset.title} — AppointEase</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <PlatformNavbar onLoginClick={() => {}} />

        {/* Category Banner (category-specific photos) */}
        <header className="bg-white shadow">
          <div className="relative h-40 sm:h-48">
            {(() => {
              const cat = String(category || '').toLowerCase();
              const src =
                cat === 'salons'
                  ? 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/d34a4864987187.5ae48c9c9aa47.jpg'
                  : cat === 'clinics'
                  ? 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600&auto=format&fit=crop'
                  : cat === 'consultants'
                  ? 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop'
                  : cat === 'tutors'
                  ? 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1600&auto=format&fit=crop';
              return (
                <img
                  className="w-full h-full object-cover"
                  src={src}
                  alt={(category || 'Category') + ' banner'}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/1600x300/93c5fd/ffffff?text=Category+Banner';
                  }}
                />
              );
            })()}
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{dataset.title}</h1>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">City:</label>
              <select
                className="border rounded-md px-2 py-1"
                value={city || ''}
                onChange={(e) => router.push({ pathname: router.pathname, query: { category, city: e.target.value, q } })}
              >
                <option value="">All</option>
                {DEMO_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-600 col-span-full text-center">Loading businesses...</p>
            ) : businesses.length > 0 ? (
              businesses.map((b) => (
                <CategoryCard
                  key={b.slug}
                  name={b.name}
                  description={b.description}
                  imageUrl={b.bannerUrl}
                  onClick={() => router.push(`/${b.slug}`)}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">No businesses found in this category{city ? ` for ${city}` : ''}.</p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
