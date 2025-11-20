import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    password: '',
    phone: '',
    website: '',
    businessType: '',
    description: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const { register, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // If the user is already authenticated, we send them straight to the dashboard.
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  const { ownerName, businessName, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const extras = {
      phone: formData.phone,
      website: formData.website,
      businessType: formData.businessType,
      description: formData.description,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    };
    register(ownerName, businessName, email, password, extras);
  };
  
  if (loading || (!loading && user)) {
      // We show a simple spinner while checking the authentication status.
      return (
        <div className="flex h-screen items-center justify-center">
            <div className='w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
        </div>
      );
  }

  return (
    <>
      <Head>
        <title>Create Your Provider Account - AppointEase</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            Create Your Account
          </h1>
          <p className="text-center text-gray-600">
            Set up your business on AppointEase.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Owner Name Input */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="ownerName" className="sr-only">Your Full Name</label>
              <span className='text-gray-500'>👤</span>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={ownerName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Your Full Name'
              />
            </div>
            
            {/* Business Name Input */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="businessName" className="sr-only">Business Name</label>
              <span className='text-gray-500'>🏢</span>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={businessName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Business Name'
              />
            </div>

            {/* Email Input */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <span className='text-gray-500'>✉️</span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Email Address'
              />
            </div>

            {/* Password Input */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="password" className="sr-only">Password</label>
              <span className='text-gray-500'>🔒</span>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                value={password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Password'
              />
            </div>

            {/* Phone */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="phone" className="sr-only">Phone</label>
              <span className='text-gray-500'>📞</span>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Business Phone (optional)'
              />
            </div>

            {/* Website */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="website" className="sr-only">Website</label>
              <span className='text-gray-500'>🔗</span>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Website (optional)'
              />
            </div>

            {/* Business Type */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="businessType" className="sr-only">Business Type</label>
              <span className='text-gray-500'>🏷️</span>
              <input
                id="businessType"
                name="businessType"
                type="text"
                value={formData.businessType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Type of Business (e.g., Salon, Clinic)'
              />
            </div>

            {/* Address fields */}
            <div className="grid grid-cols-2 gap-2">
              <input name="street" value={formData.street} onChange={handleChange} placeholder="Street" className="rounded-md border p-2 text-sm" />
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="rounded-md border p-2 text-sm" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="rounded-md border p-2 text-sm" />
              <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="rounded-md border p-2 text-sm" />
              <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="rounded-md border p-2 text-sm col-span-2" />
            </div>

            {/* Description */}
            <div>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short description about your business (optional)" className="w-full rounded-md border p-2 text-sm" rows={3}></textarea>
            </div>
            
            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full justify-center rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>
          
          {/* Login Link */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}