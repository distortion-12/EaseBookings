/*
 * This component manages the multi-step booking process for a service.
 * It handles date and time selection, client details input, and payment processing via Stripe.
 */

import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { format, addDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with the publishable key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Mock staff data for demonstration purposes.
const MOCK_STAFF = [
  { _id: 'staff1', name: 'Alex Smith' },
  { _id: 'staff2', name: 'Maria Garcia' },
];

// Component to handle the Stripe payment form submission.
const CheckoutForm = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect URL after payment completion.
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      onPaymentError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id);
    } else {
      setErrorMessage("Payment failed or was cancelled.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : 'Pay & Confirm Booking'}
      </button>
    </form>
  );
};

// Main modal component for the booking flow.
export default function BookingFlowModal({ isOpen, onClose, service, businessSlug }) {
  const [currentStep, setCurrentStep] = useState(1); // Steps: 1=Time, 2=Details, 3=Payment
  const [selectedStaff, setSelectedStaff] = useState(MOCK_STAFF[0]._id);
  const [currentDate, setCurrentDate] =useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientDetails, setClientDetails] = useState({ name: '', email: '', phone: '' });
  const [clientSecret, setClientSecret] = useState('');

  // Reset state when the modal opens or closes.
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedSlot(null);
      setAvailableSlots([]);
      setClientSecret('');
    }
  }, [isOpen]);

  // Fetch available time slots when dependencies change.
  useEffect(() => {
    if (!isOpen || !service || !selectedStaff) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot(null);
      
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${API_URL}/booking/${businessSlug}/availability?date=${dateStr}&serviceId=${service._id}&staffId=${selectedStaff}`);
        const data = await res.json();
        if (data.success) {
          setAvailableSlots(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch slots", error);
      }
      setLoadingSlots(false);
    };

    fetchSlots();
  }, [isOpen, selectedDate, selectedStaff, service, businessSlug]);

  const handleDateChange = (day) => {
    setSelectedDate(day);
  };

  // Proceed to the next step in the booking flow.
  const handleNextStep = () => {
    if (currentStep === 1 && selectedSlot) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
        // Create a payment intent on the server.
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        fetch(`${API_URL}/payment/create-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serviceId: service._id }),
        })
        .then((res) => res.json())
        .then((data) => {
            setClientSecret(data.clientSecret);
            setCurrentStep(3);
        });
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
        setCurrentStep(2);
    }
  };

  const handleDetailChange = (e) => {
    setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    console.log('Payment Successful:', paymentIntentId);
    await handleConfirmBooking(paymentIntentId);
  };

  const handlePaymentError = (errorMsg) => {
      console.error("Payment Error:", errorMsg);
  };

  // Finalize the booking after successful payment.
  const handleConfirmBooking = async (paymentIntentId) => {
    console.log('Booking Confirmed:', {
      serviceId: service._id,
      staffId: selectedStaff,
      startTime: selectedSlot,
      client: clientDetails,
      paymentIntentId: paymentIntentId
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_URL}/booking/${businessSlug}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service._id,
          staffId: selectedStaff,
          startTime: selectedSlot,
          client: clientDetails,
          paymentIntentId: paymentIntentId
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Booking confirmed!');
        onClose();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('An unknown error occurred.');
    }
  };

  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book: ${service.name}`}
    >
      <div className="w-full">
        {/* Step Indicator */}
        <ol className="flex items-center w-full space-x-4 mb-8">
          <li className="flex-1">
            <span className={`flex items-center font-medium ${currentStep === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  1
              </span>
              Pick Time
            </span>
          </li>
          <li className="flex-1 border-t-2 border-dashed border-gray-300"></li>
          <li className="flex-1">
            <span className={`flex items-center font-medium ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  2
              </span>
              Details
            </span>
          </li>
          <li className="flex-1 border-t-2 border-dashed border-gray-300"></li>
          <li className="flex-1">
            <span className={`flex items-center font-medium ${currentStep === 3 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  3
              </span>
              Payment
            </span>
          </li>
        </ol>

        {/* Step 1: Pick Time */}
        <div className={currentStep === 1 ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Calendar & Staff */}
            <div>
              {/* Staff Selector */}
              <label htmlFor="staff" className="block text-sm font-medium text-gray-700">Select Staff</label>
              <select
                id="staff"
                name="staff"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                {MOCK_STAFF.map(staff => (
                  <option key={staff._id} value={staff._id}>{staff.name}</option>
                ))}
              </select>

              {/* Simple Calendar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => handleDateChange(addDays(currentDate, -1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
                  <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
                  <button type="button" onClick={() => handleDateChange(addDays(currentDate, 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
                {/* Day Picker */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    <span 
                      className={`col-span-7 p-2 rounded-md font-medium text-lg 
                        ${format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100'}`}
                    >
                        {format(selectedDate, 'EEE, MMM d')}
                    </span>
                </div>
              </div>
            </div>
            
            {/* Right: Time Slots */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select a Time (for {format(selectedDate, 'MMM d, yyyy')})</h3>
              {loadingSlots ? (
                <div>Loading slots...</div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                  {availableSlots.length > 0 ? availableSlots.map(slotISO => (
                    <button
                      type="button"
                      key={slotISO}
                      onClick={() => setSelectedSlot(slotISO)}
                      className={`w-full border rounded-full py-2 transition-colors text-sm font-medium
                        ${selectedSlot === slotISO ? 'bg-blue-600 text-white shadow-md border-blue-600' : 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'}`}
                    >
                      {format(new Date(slotISO), 'h:mm a')}
                    </button>
                  )) : (
                    <p className="col-span-3 text-gray-500">No available slots for this day.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer for Step 1 */}
          <div className="pt-6 border-t mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!selectedSlot}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              Next: Your Details &rarr;
            </button>
          </div>
        </div>

        {/* Step 2: Your Details */}
        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" id="name" value={clientDetails.name} onChange={handleDetailChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" value={clientDetails.email} onChange={handleDetailChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
              <input type="tel" name="phone" id="phone" value={clientDetails.phone} onChange={handleDetailChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>

          {/* Footer for Step 2 */}
          <div className="pt-6 border-t mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="border border-gray-500 text-gray-500 px-6 py-2 rounded-full font-medium hover:bg-gray-50"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Next: Payment &rarr;
            </button>
          </div>
        </div>

        {/* Step 3: Payment */}
        <div className={currentStep === 3 ? 'block' : 'hidden'}>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
                </Elements>
            )}
             {/* Footer for Step 3 */}
             <div className="pt-6 border-t mt-8 flex justify-start">
                <button
                type="button"
                onClick={handlePrevStep}
                className="border border-gray-500 text-gray-500 px-6 py-2 rounded-full font-medium hover:bg-gray-50"
                >
                &larr; Back
                </button>
            </div>
        </div>
      </div>
    </Modal>
  );
}