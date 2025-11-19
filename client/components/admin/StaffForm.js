/*
 * This component renders a form for creating or editing staff member details.
 * It handles input validation, service assignment, and schedule management via the ScheduleEditor component.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ScheduleEditor from './ScheduleEditor';
import { getServices } from '@/lib/api';

// Form component for staff management.
export default function StaffForm({ initialData, onSubmit, loading }) {
  const { token } = useAuth();
  
  // Default schedule configuration for a new staff member.
  const defaultSchedule = {
    monday: { isWorking: true, startTime: '09:00', endTime: '17:00', breaks: [] },
    tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00', breaks: [] },
    wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00', breaks: [] },
    thursday: { isWorking: true, startTime: '09:00', endTime: '17:00', breaks: [] },
    friday: { isWorking: true, startTime: '09:00', endTime: '17:00', breaks: [] },
    saturday: { isWorking: false, startTime: '09:00', endTime: '17:00', breaks: [] },
    sunday: { isWorking: false, startTime: '09:00', endTime: '17:00', breaks: [] },
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    assignedServices: [],
    schedule: defaultSchedule,
  });
  const [allServices, setAllServices] = useState([]);

  // Fetch all available services to populate the assignment selection.
  useEffect(() => {
    const fetchServices = async () => {
      if (token) {
        try {
          const services = await getServices(token);
          setAllServices(services);
        } catch (error) {
          console.error("Failed to fetch services:", error);
        }
      }
    };
    fetchServices();
  }, [token]);

  // Populate form with initial data if editing, otherwise reset to defaults.
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        assignedServices: initialData.assignedServices ? initialData.assignedServices.map(s => s._id) : [],
        schedule: initialData.schedule || defaultSchedule,
      });
    } else {
      setFormData({
        name: '', email: '', phone: '', assignedServices: [],
        schedule: defaultSchedule,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (newSchedule) => {
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const handleServiceSelect = (e) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, assignedServices: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Details */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Staff Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Assigned Services */}
      <div>
        <label htmlFor="assignedServices" className="block text-sm font-medium text-gray-700">
          Assigned Services
        </label>
        <select
          id="assignedServices"
          name="assignedServices"
          multiple
          value={formData.assignedServices}
          onChange={handleServiceSelect}
          className="mt-1 block w-full h-40 rounded-md border-gray-300 shadow-sm"
        >
          {allServices.length === 0 && <option disabled>Loading services...</option>}
          {allServices.map(service => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule Editor */}
      <ScheduleEditor
        initialSchedule={formData.schedule}
        onChange={handleScheduleChange}
      />

      {/* Action Buttons */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full justify-center rounded bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Staff Member'}
        </button>
      </div>
    </form>
  );
}