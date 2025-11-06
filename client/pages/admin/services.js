import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/common/Modal';
import ServiceForm from '@/components/admin/ServiceForm';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null); // null for create, object for edit

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null); // Clear form
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    let success = false;
    
    if (editingService) {
      // Update
      const updated = await updateService(editingService._id, formData);
      if (updated) {
        setServices(services.map(s => s._id === updated._id ? updated : s));
        success = true;
      }
    } else {
      // Create
      const created = await createService(formData);
      if (created) {
        setServices([...services, created]);
        success = true;
      }
    }

    setLoading(false);
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    // We should use a confirmation modal in a real app
    if (window.confirm('Are you sure you want to delete this service?')) {
      const success = await deleteService(id);
      if (success) {
        setServices(services.filter(s => s._id !== id));
      }
    }
  };

  return (
    <AdminLayout title="Service Management">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage all services offered by your business.
        </p>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Create Service
        </button>
      </div>

      {/* Services List/Table */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {loading && <li><p className="p-4">Loading services...</p></li>}
          {!loading && services.length === 0 && (
            <li><p className="p-4 text-gray-500">No services found. Click "Create Service" to get started.</p></li>
          )}
          {services.map((service) => (
            <li key={service._id}>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-md font-medium text-gray-900">
                    {service.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {service.description || 'No description'}
                  </p>
                </div>
                <div className="flex-1 min-w-0 text-center hidden sm:block">
                  <span className="text-gray-900">${service.price}</span> /{' '}
                  <span className="text-gray-500">{service.duration} min</span>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 rounded-md text-red-400 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingService ? 'Edit Service' : 'Create New Service'}
      >
        <ServiceForm
          initialData={editingService}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </Modal>
    </AdminLayout>
  );
}