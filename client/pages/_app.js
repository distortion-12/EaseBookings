import '../styles/globals.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext'; // <-- IMPORT

export default function App({ Component, pageProps }) {
  return (
    // <--- WRAP your app
    <AuthProvider>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </AuthProvider>
    // <---
  );
}