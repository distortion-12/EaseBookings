import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { format } from 'date-fns';
import PlatformNavbar from '@/components/layout/PlatformNavbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { initiateBookingPayment } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { clientUser } = useAuth();
  const [pendingBooking, setPendingBooking] = useState(null);
  const [depositPercent, setDepositPercent] = useState(30);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure user is logged in
    if (!clientUser) {
      router.push('/login');
      return;
    }

    // Retrieve pending booking from session storage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('pendingBooking');
      if (stored) {
        try {
          const booking = JSON.parse(stored);
          setPendingBooking(booking);
        } catch (err) {
          console.error('Failed to parse pending booking', err);
          toast.error('Session expired. Please book again.');
          router.push('/');
        }
      } else {
        toast.error('No booking in progress. Please start fresh.');
        router.push('/');
      }
    }
  }, [clientUser, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.head.appendChild(script);
  }, []);

  const calculateAmount = () => {
    if (!pendingBooking) return 0;
    return Math.round(
      (pendingBooking.servicePrice * depositPercent) / 100 * 100
    ); // in paise
  };

  const displayAmount = () => {
    const paise = calculateAmount();
    return (paise / 100).toFixed(2);
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    if (!pendingBooking) {
      toast.error('Booking details not found.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay order on backend
      const orderData = await initiateBookingPayment(pendingBooking.businessSlug, {
        serviceId: pendingBooking.serviceId,
        staffId: pendingBooking.staffId,
        startTime: pendingBooking.startTime,
        client: pendingBooking.client,
        depositPercent,
      });

      if (!orderData) {
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay payment modal
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'EaseBookings',
        description: `Deposit for ${pendingBooking.serviceName}`,
        image: 'https://via.placeholder.com/100',
        prefill: {
          name: pendingBooking.client.name,
          email: pendingBooking.client.email,
          contact: pendingBooking.client.phone || '',
        },
        theme: {
          color: '#3b82f6',
        },
        method: {
          card: paymentMethod === 'card' ? true : false,
          upi: paymentMethod === 'upi' ? true : false,
          netbanking: false,
          wallet: false,
        },
        handler: (response) => {
          // The webhook will handle this server-side
          if (response.razorpay_payment_id) {
            toast.success('Payment successful! Your booking is confirmed.');
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('pendingBooking');
            }
            setTimeout(() => {
              router.push('/');
            }, 2000);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error(
              'Payment cancelled. Your slot is reserved for 10 minutes.'
            );
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to start payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pendingBooking) {
    return (
      <>
        <Head>
          <title>Checkout - EaseBookings</title>
        </Head>
        <PlatformNavbar />
        <main className="max-w-7xl mx-auto py-12 px-4 text-center">
          <p>Loading checkout...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - EaseBookings</title>
      </Head>
      <PlatformNavbar />

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Summary */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Service:</span>{' '}
                    {pendingBooking.serviceName}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{' '}
                    {pendingBooking.serviceDuration} minutes
                  </p>
                  <p>
                    <span className="font-medium">Date & Time:</span>{' '}
                    {format(new Date(pendingBooking.startTime), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p>
                    <span className="font-medium">Service Price:</span> ₹
                    {pendingBooking.servicePrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Deposit Selection */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Pay Now
                </h2>
                <p className="text-gray-600 mb-4">
                  Choose the amount to pay as a deposit:
                </p>
                <div className="space-y-3">
                  {[30, 50, 100].map((pct) => (
                    <label
                      key={pct}
                      className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="deposit"
                        value={pct}
                        checked={depositPercent === pct}
                        onChange={(e) => setDepositPercent(Number(e.target.value))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 flex-grow">
                        <span className="font-medium text-gray-900">
                          {pct}% Deposit
                        </span>
                        <span className="ml-2 text-gray-600">
                          ₹
                          {(
                            (pendingBooking.servicePrice * pct) /
                            100
                          ).toFixed(2)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <p className="text-gray-600 mb-4">Select a payment method:</p>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 flex-grow">
                      <span className="font-medium text-gray-900">
                        Credit / Debit Card
                      </span>
                      <span className="block text-gray-600 text-sm">
                        Visa, Mastercard, Rupay
                      </span>
                    </span>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="method"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 flex-grow">
                      <span className="font-medium text-gray-900">
                        UPI (Unified Payments Interface)
                      </span>
                      <span className="block text-gray-600 text-sm">
                        Google Pay, PhonePe, Paytm, etc.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Client Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Details
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{' '}
                    {pendingBooking.client.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {pendingBooking.client.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{' '}
                    {pendingBooking.client.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Service Price</span>
                    <span className="font-medium">
                      ₹{pendingBooking.servicePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {depositPercent}% Deposit Due Now
                      </span>
                      <span className="font-bold text-lg">
                        ₹{displayAmount()}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4 text-sm text-gray-600">
                    <p>
                      Remaining balance of{' '}
                      <strong>
                        ₹
                        {(
                          pendingBooking.servicePrice -
                          parseFloat(displayAmount())
                        ).toFixed(2)}
                      </strong>{' '}
                      will be payable at the time of service.
                    </p>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : `Pay ₹${displayAmount()}`}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Powered by Razorpay. Secure payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
