// This page renders the login form for business providers, allowing them to access their dashboard.
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard'); // Redirects the user to the dashboard if they are already authenticated.
    }
  }, [user, loading, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  
  if (loading || (!loading && user)) {
      // Renders a loading spinner while the authentication status is being checked.
      return (
        <div className="flex h-screen items-center justify-center">
            <div className='w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
        </div>
      );
  }

  return (
    <>
      <Head>
        <title>Provider Login - AppointEase</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12">
        {/* Renders the login form container with shadow and rounded corners. */}
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            Provider Login
          </h1>
          <p className="text-center text-gray-600">
            Welcome back! Please sign in to manage your business.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Renders the email input field with an icon and styling. */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <span className='text-gray-500'>✉️</span> {/* Renders a mock email icon for visual enhancement. */}
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Email Id'
              />
            </div>
            {/* Renders the password input field with an icon and styling. */}
            <div className='border border-gray-200 hover:border-blue-400 shadow-sm px-4 py-2 flex items-center gap-2 rounded-full'>
              <label htmlFor="password" className="sr-only">Password</label>
              <span className='text-gray-500'>🔒</span> {/* Renders a mock lock icon for visual enhancement. */}
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 p-0 shadow-none focus:ring-0 text-sm"
                placeholder='Password'
              />
            </div>
            
            {/* Renders the login button with primary styling. */}
            <button
              type="submit"
              className="w-full justify-center rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>

          {/* Renders the sign-up link for users who do not have an account. */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}