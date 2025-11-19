/*
 * This file contains the Authentication Context and Provider.
 * It manages the global authentication state for both business providers (admins) and clients (customers),
 * including login, registration, logout, and token persistence.
 */

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Base URL for the backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Custom hook to access the authentication context.
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the application to provide authentication state.
export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // State for Provider (Business/Admin) authentication.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // State for Client (Customer/Public) authentication.
  const [clientUser, setClientUser] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientToken, setClientToken] = useState(null);

  // ===============================================
  //            PROVIDER (ADMIN) LOGIC
  // ===============================================

  // Fetches the authenticated provider's profile data using the stored token.
  const fetchProviderData = async (jwtToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/auth/me`, config);
      
      if (data.success) {
        setUser(data.data);
      } else {
        localStorage.removeItem('providerToken');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('providerToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handles provider login, stores the token, and fetches user data.
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (data.success) {
        localStorage.setItem('providerToken', data.token);
        setToken(data.token);
        toast.success('Provider login successful!');
        await fetchProviderData(data.token); // Fetch user data immediately
        return true;
      } else {
        toast.error(data.error || 'Login failed.');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during login.');
      return false;
    }
  };

  // Initiates provider registration and prompts for OTP verification.
  const register = async (ownerName, businessName, email, password, extras = {}) => {
    try {
      const payload = { ownerName, businessName, email, password, ...extras };
      const { data } = await axios.post(`${API_URL}/auth/register`, payload);

      if (data.success) {
        // Don't login yet, just return success to trigger OTP step
        toast.success('Registration initiated! Please check your email for OTP.');
        return true;
      } else {
        toast.error(data.error || 'Registration failed.');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during registration.');
      return false;
    }
  };

  // Verifies the OTP for provider registration and completes the login process.
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });

      if (data.success) {
        localStorage.setItem('providerToken', data.token);
        setToken(data.token);
        toast.success('Account verified! Redirecting to dashboard.');
        await fetchProviderData(data.token);
        return true;
      } else {
        toast.error(data.error || 'Verification failed.');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during verification.');
      return false;
    }
  };

  // Logs out the provider, clears state, and redirects to the login page.
  const logout = () => {
    localStorage.removeItem('providerToken');
    setToken(null);
    setUser(null);
    router.push('/login');
    toast('Logged out successfully.', { icon: '👋' });
  };


  // ===============================================
  //            CLIENT (CUSTOMER) LOGIC
  // ===============================================

  // Fetches the authenticated client's profile data using the stored token.
  const fetchClientData = async (jwtToken) => {
    // NOTE: This is a placeholder. A real implementation would hit a secure API endpoint.
    // For now, we mock success and set clientUser.
    setClientUser({ 
        name: 'Guest User', 
        email: 'guest@example.com' 
    });
    setClientLoading(false);
  };
  
  // Handles client login, stores the token, and fetches client data.
  const clientLogin = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/client-auth/login`, { email, password });
      
      if (data.success) {
        localStorage.setItem('clientToken', data.token);
        setClientToken(data.token);
        toast.success('Client login successful!');
        await fetchClientData(data.token);
        return true;
      } else {
        toast.error(data.error || 'Client login failed.');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during client login.');
      return false;
    }
  };
  
  // Handles client registration, stores the token, and logs the user in.
  const clientRegister = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post(`${API_URL}/client-auth/register`, { name, email, password, phone });

      if (data.success) {
        localStorage.setItem('clientToken', data.token);
        setClientToken(data.token);
        toast.success('Client registration successful! Logged in.');
        await fetchClientData(data.token);
        return true;
      } else {
        toast.error(data.error || 'Client registration failed.');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during client registration.');
      return false;
    }
  };

  // Logs out the client and clears their authentication state.
  const clientLogout = () => {
    localStorage.removeItem('clientToken');
    setClientToken(null);
    setClientUser(null);
    toast('Client logged out.', { icon: '👋' });
  };


  // ===============================================
  //                INITIALIZATION
  // ===============================================

  // Effect to initialize authentication state from local storage on component mount.
  useEffect(() => {
    const storedProviderToken = localStorage.getItem('providerToken');
    const storedClientToken = localStorage.getItem('clientToken');

    if (storedProviderToken) {
      setToken(storedProviderToken);
      fetchProviderData(storedProviderToken);
    } else {
      setLoading(false);
    }

    if (storedClientToken) {
      setClientToken(storedClientToken);
      fetchClientData(storedClientToken);
    } else {
      setClientLoading(false);
    }
    
  }, []); 

  const value = {
    // Provider (Admin) State/Functions
    user,
    token,
    loading,
    login,
    register,
    verifyOtp,
    logout,
    
    // Client (Customer) State/Functions
    clientUser,
    clientToken,
    clientLoading,
    clientLogin,
    clientRegister,
    clientLogout,
  };

  // Render a loading spinner while authentication state is being determined.
  if (loading || clientLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className='w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};