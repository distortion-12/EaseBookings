// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/pages/register.js

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [otp, setOtp] = useState('');
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
  const { register, verifyOtp, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard'); // Redirect if already logged in
    }
  }, [user, loading, router]);

  const { ownerName, businessName, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
    const success = await register(ownerName, businessName, email, password, extras);
    if (success) {
        setStep(2);
    }
  };

  const handleOtpSubmit = async (e) => {
      e.preventDefault();
      const success = await verifyOtp(email, otp);
      if (success) {
          router.push('/admin/dashboard');
      }
  };
  
  if (loading || (!loading && user)) {
      // Simple spinning loader mimicking Job Portal's Loading.jsx
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
        {/* Styled like a form/modal wrapper */}
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            {step === 1 ? 'Create Your Account' : 'Verify Email'}
          </h1>
          <p className="text-center text-gray-600">
            {step === 1 ? 'Set up your business on AppointEase.' : `Enter the OTP sent to ${email}`}
          </p>
          
          {step === 1 ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
                
                {/* Owner Name Input - Styled like Job Portal Recruiter Login */}
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                <label htmlFor="ownerName" className="sr-only">Your Full Name</label>
                <span className='text-gray-500'>👤</span> {/* Mock person icon */}
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
                
                {/* Business Name Input - Styled like Job Portal Recruiter Login */}
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                <label htmlFor="businessName" className="sr-only">Business Name</label>
                <span className='text-gray-500'>🏢</span> {/* Mock company icon */}
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

                {/* Email Input - Styled like Job Portal Recruiter Login */}
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <span className='text-gray-500'>✉️</span> {/* Mock email icon */}
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

                {/* Address fields (compact) */}
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

                {/* Password Input - Styled like Job Portal Recruiter Login */}
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                <label htmlFor="password" className="sr-only">Password</label>
                <span className='text-gray-500'>🔒</span> {/* Mock lock icon */}
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
                
                {/* Sign Up Button (Matching Job Portal CTA: bg-blue-600, rounded-full, py-2) */}
                <button
                type="submit"
                className="w-full justify-center rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                Sign Up
                </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleOtpSubmit}>
                <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
                    <label htmlFor="otp" className="sr-only">OTP</label>
                    <span className='text-gray-500'>🔑</span>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                        placeholder='Enter 6-digit OTP'
                    />
                </div>
                <button
                    type="submit"
                    className="w-full justify-center rounded-full border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Verify & Login
                </button>
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full justify-center rounded-full border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    Back
                </button>
            </form>
          )}
          
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