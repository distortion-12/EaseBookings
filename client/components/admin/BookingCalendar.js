/*
 * This component renders an interactive calendar for managing appointments.
 * It uses 'react-big-calendar' to display events in month, week, and day views, allowing admins to visualize their schedule.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


// Initialize the localizer for react-big-calendar using date-fns.
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Set Monday as the start of the week.
  getDay,
  locales,
});

// Custom styling function for calendar events based on their status.
const customEventStyles = (event, start, end, isSelected) => {
    let style = {
        // Green background for Confirmed appointments, Blue for others.
        backgroundColor: event.status === 'Confirmed' ? '#10B981' : '#3B82F6', 
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
        cursor: 'pointer',
    };

    if (isSelected) {
        style.border = '2px solid #1E40AF'; // Highlight selected events with a darker border.
        style.opacity = 1;
    }

    return {
        style: style,
    };
};

// Main BookingCalendar component.
export default function BookingCalendar({ appointments, onSelectEvent, onRangeChange }) {
  const [view, setView] = useState('week'); // Default to week view.
  const [date, setDate] = useState(new Date()); // Track the currently displayed date.

  // Transform raw appointment data into calendar-compatible event objects.
  const events = useMemo(() => {
    return appointments.map(appt => ({
        title: `${appt.service.name} (${appt.client.name.split(' ')[0]})`,
        start: new Date(appt.startTime),
        end: new Date(appt.endTime),
        resource: appt, // Store the full appointment object for detailed views.
        status: appt.status,
    }));
  }, [appointments]);
  
  // Handle navigation between dates and views.
  const onNavigate = (newDate, newView) => {
    setDate(newDate);
    // Calculate the visible date range to fetch relevant appointments.
    const viewStart = localizer.startOf(newDate, newView);
    const viewEnd = localizer.endOf(newDate, newView);
    onRangeChange(viewStart, viewEnd);
  }

  // Set the initial date range on component mount.
  useEffect(() => {
    const initialStart = localizer.startOf(date, view);
    const initialEnd = localizer.endOf(date, view);
    onRangeChange(initialStart, initialEnd);
  }, []); 

  // Custom toolbar component for the calendar header.
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    return (
        <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            {/* Navigation Controls */}
            <div className='flex space-x-2'>
                <button
                    onClick={goToBack}
                    className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    <ChevronLeftIcon className='w-5 h-5' />
                </button>
                <button
                    onClick={goToNext}
                    className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    <ChevronRightIcon className='w-5 h-5' />
                </button>
            </div>
            
            {/* Current Date Label */}
            <h2 className="text-xl font-semibold text-gray-900 mx-4">
                {localizer.format(toolbar.date, 'MMMM yyyy')}
            </h2>

            {/* View Switcher Buttons */}
            <div className='flex space-x-2 text-sm'>
                <button
                    onClick={goToToday}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors"
                >
                    Today
                </button>
                {toolbar.views.map(v => (
                    <button
                        key={v}
                        onClick={() => toolbar.onView(v)}
                        className={v === toolbar.view
                            ? "bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors" // Active view style
                            : "bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors" // Inactive view style
                        }
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
  };
  
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-100'>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        resizable
        selectable
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        onView={setView}
        date={date}
        views={['month', 'week', 'day']} 
        defaultView="week"
        components={{
            toolbar: CustomToolbar,
        }}
        eventPropGetter={customEventStyles}
      />
    </div>
  );
}