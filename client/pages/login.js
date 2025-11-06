import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link'; // <--- IMPORT LINK

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard'); // Redirect if already logged in
    }
  }, [user, loading, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  
  if (loading || (!loading && user)) {
      return <div>Loading...</div>; // Show loading or redirect
  }

  return (
    <>
      <Head>
        <title>Admin Login - AppointEase</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            Admin Login
          </h1>
          <p className="text-center text-gray-600">
            Log in to manage your business.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* ... (email and password inputs) ... */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.targe.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>

          {/* --- ADD THIS LINK --- */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign Up
            </Link>
          </p>
          {/* --- END OF LINK --- */}

        </div>
      </div>
    </>
  );
}