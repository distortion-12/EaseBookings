import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  
  // We wrap the application with AuthProvider to manage authentication state for both providers and clients.
  return (
    <AuthProvider>
      <Component {...pageProps} />
      {/* We use Toaster for global notification popups. */}
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '14px',
            fontFamily: 'Outfit, sans-serif'
          }
        }}
      />
    </AuthProvider>
  );
}