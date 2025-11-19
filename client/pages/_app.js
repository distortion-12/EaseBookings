// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/pages/_app.js

import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast'; // Assuming react-hot-toast is used for consistent notifications

/**
 * Custom App component to wrap the entire application.
 * It injects global styles and the AuthProvider context.
 */
export default function App({ Component, pageProps }) {
  
  // Wrap the application with AuthProvider to manage Provider and Client state
  return (
    <AuthProvider>
      <Component {...pageProps} />
      {/* Toaster for global, Job Portal-style notification popups */}
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '14px',
            fontFamily: 'Outfit, sans-serif' // Apply the custom font to toasts
          }
        }}
      />
    </AuthProvider>
  );
}