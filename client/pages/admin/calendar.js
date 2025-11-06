import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BookingCalendar from '@/components/admin/BookingCalendar';
import { getBusinessAppointments } from '@/lib/api';
import { getStaff } from '@/lib/api';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Mock Detail Modal (for when an event is clicked)
const AppointmentDetailModal = ({ appt, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
      <h3 className="text-xl font-bold mb-4">Appointment Details</h3>
      <p><strong>Client:</strong> {appt.client.name}</p>
      <p><strong>Email:</strong> {appt.client.email}</p>
      <p><strong>Service:</strong> {appt.service.name}</p>
      <p><strong>Staff:</strong> {appt.staff.name}</p>
      <p><strong>Time:</strong> {new Date(appt.startTime).toLocaleTimeString()} - {new Date(appt.endTime).toLocaleTimeString()}</p>
      <button
        onClick={onClose}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
);

export default function CalendarPage() {
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('all'); // Filter by staff [cite: 36]
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Define the initial date range (current week)
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  });

  // Fetch staff for the filter dropdown
  useEffect(() => {
    const fetchStaff = async () => {
      const staff = await getStaff();
      setStaffList(staff);
    };
    fetchStaff();
  }, []);

  // Fetch appointments when date range or staff filter changes
  useEffect(() => {
    const fetchAppts = async () => {
      let data = await getBusinessAppointments(dateRange.start, dateRange.end);
      
      // Filter by staff if not 'all'
      if (selectedStaff !== 'all') {
        data = data.filter(appt => appt.staff._id === selectedStaff);
      }
      setAppointments(data);
    };
    
    fetchAppts();
  }, [dateRange, selectedStaff]);

  const handleRangeChange = (start, end) => {
    setDateRange({ start, end });
  };

  const handleEventClick = (event) => {
    setSelectedAppointment(event.resource); // The resource is the original appt object
  };

  return (
    <AdminLayout title="Booking Calendar">
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
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
        {/* We can add a "Manual Booking" button here [cite: 37] */}
        <button className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          Manual Booking
        </button>
      </div>

      {/* The Calendar Component */}
      <BookingCalendar
        appointments={appointments}
        onSelectEvent={handleEventClick}
        onRangeChange={handleRangeChange}
      />

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appt={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </AdminLayout>
  );
}