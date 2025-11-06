import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // <-- THIS IS THE FIX (Removed the curly braces {})
import toast from 'react-hot-toast';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ADMIN AUTH STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CLIENT AUTH STATE
  const [clientUser, setClientUser] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    checkAdminToken();
    checkClientToken();
  }, []);

  // --- HEADER HELPER ---
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // --- ADMIN AUTH FUNCTIONS ---
  const checkAdminToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // This line will now work
        if (decoded.exp * 1000 < Date.now()) {
          adminLogout();
        } else {
          setAuthHeader(token);
          await fetchAdminUser();
        }
      } catch (error) {
        adminLogout();
      }
    }
    setLoading(false);
  };
  
  const fetchAdminUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
    } catch (error) {
      adminLogout();
    }
  };

  const adminRegister = async (ownerName, businessName, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { ownerName, businessName, email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      await fetchAdminUser();
      toast.success('Account created successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      await fetchAdminUser();
      toast.success('Logged in successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setUser(null);
    router.push('/login');
  };

  // --- CLIENT AUTH FUNCTIONS ---
  const checkClientToken = async () => {
    const clientToken = localStorage.getItem('clientToken');
    if (clientToken) {
      try {
        const decoded = jwtDecode(clientToken); // This line will now work
        if (decoded.exp * 1000 < Date.now()) {
          clientLogout();
        } else {
          setClientUser({ id: decoded.id });
        }
      } catch (error) {
        clientLogout();
      }
    }
    setClientLoading(false);
  };

  const clientRegister = async (name, email, password, phone) => {
    try {
      const res = await axios.post('/api/client-auth/register', { name, email, password, phone });
      const { token } = res.data;
      localStorage.setItem('clientToken', token);
      const decoded = jwtDecode(token); // This line will now work
      setClientUser({ id: decoded.id });
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('--- REGISTRATION FAILED ---');
      console.log('Error object:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      } else if (error.request) {
        console.log('No response received. Server might be down or CORS error.');
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const clientLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/client-auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('clientToken', token);
      const decoded = jwtDecode(token); // This line will now work
      setClientUser({ id: decoded.id });
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      console.error('--- LOGIN FAILED ---');
      console.log('Error object:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      } else if (error.request) {
        console.log('No response received. Server might be down or CORS error.');
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const clientLogout = () => {
    localStorage.removeItem('clientToken');
    setClientUser(null);
    toast.success('Logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user, setUser, login: adminLogin, logout: adminLogout, register: adminRegister, loading,
        clientUser, clientLoading, clientLogin, clientRegister, clientLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);