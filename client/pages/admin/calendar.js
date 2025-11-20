import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import BookingCalendar from '@/components/admin/BookingCalendar';
import { getBusinessAppointments } from '@/lib/api';
import { getStaff } from '@/lib/api';
import { startOfWeek, endOfWeek } from 'date-fns';

// We display a modal with appointment details when an event is clicked.
const AppointmentDetailModal = ({ appt, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Appointment Details</h3>
      <div className='space-y-3 text-gray-700'>
        <p><strong>Client:</strong> <span className='font-medium'>{appt.client.name}</span> ({appt.client.email})</p>
        <p><strong>Service:</strong> <span className='font-medium'>{appt.service.name}</span> (${appt.service.price})</p>
        <p><strong>Staff:</strong> <span className='font-medium'>{appt.staff.name}</span></p>
        <p><strong>Time:</strong> {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString()}</p>
        <p><strong>Status:</strong> 
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ml-2 
              ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {appt.status}
          </span>
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);

export default function CalendarPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('all'); 
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // We initialize the date range to the current week.
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  });

  // We fetch the list of staff members to populate the filter dropdown.
  useEffect(() => {
    const fetchStaff = async () => {
      if (token) {
        try {
          const staff = await getStaff(token);
          setStaffList(staff);
        } catch (error) {
          console.error("Failed to fetch staff:", error);
        }
      }
    };
    fetchStaff();
  }, [token]);

  // We fetch appointments whenever the date range or the selected staff filter changes.
  useEffect(() => {
    const fetchAppts = async () => {
      if (token) {
        try {
          let data = await getBusinessAppointments(dateRange.start, dateRange.end, token);
          
          // If a specific staff member is selected, we filter the appointments accordingly.
          if (selectedStaff !== 'all') {
            data = data.filter(appt => appt.staff._id === selectedStaff);
          }
          setAppointments(data);
        } catch (error) {
          console.error("Failed to fetch appointments:", error);
        }
      }
    };
    
    fetchAppts();
  }, [dateRange, selectedStaff, token]);

  const handleRangeChange = (start, end) => {
    setDateRange({ start, end });
  };

  const handleEventClick = (event) => {
    setSelectedAppointment(event.resource);
  };

  return (
    <AdminLayout title="Appointments Calendar">
      {/* We provide filters and actions for the calendar view. */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <label htmlFor="staffFilter" className="text-sm font-medium text-gray-700">
            Filter by Staff:
          </label>
          <select
            id="staffFilter"
            name="staffFilter"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Staff</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
        {/* Manual booking button */}
        <button className="inline-flex items-center gap-x-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700">
          Manual Booking
        </button>
      </div>

      {/* We render the calendar component with the fetched appointments. */}
      <BookingCalendar
        appointments={appointments}
        onSelectEvent={handleEventClick}
        onRangeChange={handleRangeChange}
      />

      {/* We show the appointment detail modal if an appointment is selected. */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appt={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </AdminLayout>
  );
}