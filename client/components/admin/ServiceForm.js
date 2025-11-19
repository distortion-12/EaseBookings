/*
 * This component renders a form for creating or editing service details.
 * It handles input validation and submission for service name, description, duration, price, and buffer time.
 */

import { useState, useEffect } from 'react';

// Form component for service management.
export default function ServiceForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    bufferTime: 0,
  });

  // Populate form with initial data if editing, otherwise reset to defaults.
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        duration: initialData.duration || 30,
        price: initialData.price || 0,
        bufferTime: initialData.bufferTime || 0,
      });
    } else {
      setFormData({ name: '', description: '', duration: 30, price: 0, bufferTime: 0 });
    }
  }, [initialData]);

  // Handle input changes, converting numeric fields appropriately.
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Service Name
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (min)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            required
            min="0"
            step="5"
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700">
            Buffer (min)
          </label>
          <input
            type="number"
            name="bufferTime"
            id="bufferTime"
            min="0"
            step="5"
            value={formData.bufferTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full justify-center rounded bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Service'}
        </button>
      </div>
    </form>
  );
}