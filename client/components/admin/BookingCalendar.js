import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { useMemo } from 'react';

// Setup the localizer by wrapping the functions
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Start week on Monday
  getDay,
  locales,
});

/**
 * The main calendar component that displays appointments.
 * @param {Array} appointments - The raw appointment data from the API.
 * @param {function} onSelectEvent - Function to call when an event is clicked.
 * @param {function} onRangeChange - Function to call when the calendar's date range changes.
 */
export default function BookingCalendar({ appointments, onSelectEvent, onRangeChange }) {
  // Format the raw appointment data into "events" for the calendar
  const events = useMemo(() => {
    return appointments.map((appt) => ({
      title: `${appt.client.name} - ${appt.service.name} (${appt.staff.name})`,
      start: new Date(appt.startTime),
      end: new Date(appt.endTime),
      resource: appt, // Store the original appointment object
    }));
  }, [appointments]);

  // Handle the view changing (e.g., month to week) or date changing
  const handleRangeChange = (range) => {
    if (!onRangeChange) return;

    // 'range' can be an object with start/end (for month/week) or an array (for agenda)
    if (Array.isArray(range)) {
      onRangeChange(range[0], range[range.length - 1]);
    } else {
      onRangeChange(range.start, range.end);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[70vh]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week" // Default to week view [cite: 35]
        views={['day', 'week', 'month']} // Show Day, Week, and Month formats [cite: 35]
        step={30} // 30-minute slots
        timeslots={2} // Two slots per hour (30 min)
        min={new Date(0, 0, 0, 8, 0, 0)} // Day starts at 8:00 AM
        max={new Date(0, 0, 0, 20, 0, 0)} // Day ends at 8:00 PM
        onSelectEvent={onSelectEvent}
        onRangeChange={handleRangeChange}
        popup
      />
    </div>
  );
}