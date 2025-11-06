import { useState, useEffect } from 'react';

/**
 * A form for creating or editing a service.
 * @param {object} initialData - The service data to edit, or null to create.
 * @param {function} onSubmit - The function to call when the form is submitted.
 * @param {boolean} loading - Whether the form is currently submitting.
 */
export default function ServiceForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    bufferTime: 0,
  });

  // Load initial data when it's provided (for editing)
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
      // Reset for creating a new service
      setFormData({ name: '', description: '', duration: 30, price: 0, bufferTime: 0 });
    }
  }, [initialData]);

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
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Service'}
        </button>
      </div>
    </form>
  );
}