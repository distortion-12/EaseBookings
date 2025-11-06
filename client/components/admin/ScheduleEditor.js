import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * A sub-component for managing the 7-day schedule within the StaffForm.
 * @param {object} initialSchedule - The initial schedule object from the staff member.
 * @param {function} onChange - Function to call when the schedule is updated.
 */
export default function ScheduleEditor({ initialSchedule, onChange }) {
  const [schedule, setSchedule] = useState(initialSchedule);

  // Update parent form whenever local schedule changes
  useEffect(() => {
    onChange(schedule);
  }, [schedule, onChange]);

  const handleDayChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    // Basic time validation (e.g., "09:00")
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || value === '') {
      handleDayChange(day, field, value);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-800">Working Hours</h4>
      {DAYS.map((day) => (
        <div key={day} className="p-3 border rounded-md bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="capitalize font-medium text-gray-700">{day}</span>
            <Switch
              checked={schedule[day].isWorking}
              onChange={(value) => handleDayChange(day, 'isWorking', value)}
              className={classNames(
                schedule[day].isWorking ? 'bg-blue-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  schedule[day].isWorking ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </div>
          
          {schedule[day].isWorking && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Start Time</label>
                <input
                  type="time"
                  step="900" // 15-minute steps
                  value={schedule[day].startTime}
                  onChange={(e) => handleDayChange(day, 'startTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">End Time</label>
                <input
                  type="time"
                  step="900"
                  value={schedule[day].endTime}
                  onChange={(e) => handleDayChange(day, 'endTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                />
              </div>
              {/* Note: We'd add break management here in a future version */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}