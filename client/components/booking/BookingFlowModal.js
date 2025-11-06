import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { format, addDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// --- Mock Staff (for demo) ---
const MOCK_STAFF = [
  { _id: 'staff1', name: 'Alex Smith' },
  { _id: 'staff2', name: 'Maria Garcia' },
];

/**
 * The multi-step booking flow modal.
 */
export default function BookingFlowModal({ isOpen, onClose, service, businessSlug }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Time, 2: Details
  const [selectedStaff, setSelectedStaff] = useState(MOCK_STAFF[0]._id); // Default to first staff
  const [currentDate, setCurrentDate] =useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientDetails, setClientDetails] = useState({ name: '', email: '', phone: '' });

  // Reset state when modal is closed or service changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedSlot(null);
      setAvailableSlots([]);
    }
  }, [isOpen]);

  // Fetch availability when date or staff changes
  useEffect(() => {
    if (!isOpen || !service || !selectedStaff) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot(null);
      
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      // --- Real API Call ---
      // try {
      //   const res = await fetch(`/api/booking/${businessSlug}/availability?date=${dateStr}&serviceId=${service._id}&staffId=${selectedStaff}`);
      //   const data = await res.json();
      //   if (data.success) {
      //     setAvailableSlots(data.data); // data.data is an array of ISO strings
      //   }
      // } catch (error) {
      //   console.error("Failed to fetch slots", error);
      // }

      // --- Mock API Call ---
      setTimeout(() => {
        setAvailableSlots([
          '2025-11-10T09:00:00.000Z',
          '2025-11-10T09:30:00.000Z',
          '2025-11-10T10:45:00.000Z',
          '2025-11-10T13:00:00.000Z',
          '2025-11-10T14:15:00.000Z',
        ]);
        setLoadingSlots(false);
      }, 500); // Simulate network delay
    };

    fetchSlots();
  }, [isOpen, selectedDate, selectedStaff, service, businessSlug]);

  const handleDateChange = (day) => {
    setSelectedDate(day);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedSlot) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleDetailChange = (e) => {
    setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = async () => {
    console.log('Booking Confirmed:', {
      serviceId: service._id,
      staffId: selectedStaff,
      startTime: selectedSlot,
      client: clientDetails,
    });

    // --- Real API Call ---
    // try {
    //   const res = await fetch(`/api/booking/${businessSlug}/create`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       serviceId: service._id,
    //       staffId: selectedStaff,
    //       startTime: selectedSlot,
    //       client: clientDetails,
    //     })
    //   });
    //   const data = await res.json();
    //   if (data.success) {
    //     alert('Booking confirmed!');
    //     onClose();
    //   } else {
    //     alert(`Error: ${data.error}`);
    //   }
    // } catch (error) {
    //   alert('An unknown error occurred.');
    // }

    // --- Mock Booking ---
    alert('Booking confirmed! (Mock)');
    onClose();
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
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</span>
              Pick Time
            </span>
          </li>
          <li className="flex-1 border-t-2 border-dashed border-gray-300"></li>
          <li className="flex-1">
            <span className={`flex items-center font-medium ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</span>
              Your Details
            </span>
          </li>
        </ol>

        {/* --- Step 1: Pick Time --- [cite: 53-55] */}
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

              {/* Simple Calendar (Placeholder) */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
                  <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
                  <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
                {/* This is a simple day picker, not a full calendar */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {/* We'd map out days here. This is a simplified version. */}
                  <span onClick={() => handleDateChange(new Date())} className={`p-2 rounded-full cursor-pointer ${format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                    {format(new Date(), 'd')}
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
                      key={slotISO}
                      onClick={() => setSelectedSlot(slotISO)}
                      className={`w-full border rounded-md py-3 transition-colors ${selectedSlot === slotISO ? 'bg-blue-600 text-white' : 'border-blue-500 text-blue-500 hover:bg-blue-50'}`}
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
              onClick={handleNextStep}
              disabled={!selectedSlot}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            >
              Next: Your Details &rarr;
            </button>
          </div>
        </div>

        {/* --- Step 2: Your Details --- */}
        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" id="name" value={clientDetails.name} onChange={handleDetailChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" value={clientDetails.email} onChange={handleDetailChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
              <input type="tel" name="phone" id="phone" value={clientDetails.phone} onChange={handleDetailChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>

          {/* Footer for Step 2 */}
          <div className="pt-6 border-t mt-8 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300"
            >
              &larr; Back
            </button>
            <button
              onClick={handleConfirmBooking}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}