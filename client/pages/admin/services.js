import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/common/Modal';
import ServiceForm from '@/components/admin/ServiceForm';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function ServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // We fetch the initial list of services when the component mounts.
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getServices(token);
      // We reverse the data to show the most recently created services first.
      setServices(data.reverse());
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
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
    setEditingService(null);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    let success = false;
    
    try {
      if (editingService) {
        // We update the existing service.
        const updated = await updateService(editingService._id, formData, token);
        if (updated) {
          setServices(services.map(s => s._id === updated._id ? updated : s));
          success = true;
        }
      } else {
        // We create a new service and add it to the list.
        const created = await createService(formData, token);
        if (created) {
          setServices([created, ...services]);
          success = true;
        }
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }

    setLoading(false);
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const success = await deleteService(id, token);
        if (success) {
          setServices(services.filter(s => s._id !== id));
        }
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  return (
    <AdminLayout title="Service Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage all available services for your business.
        </p>
      </div>

      {/* We display the list of services in a table, or a message if no services exist. */}
      {!loading && services.length === 0 ? (
           <div className='flex flex-col items-center justify-center h-[50vh]'>
            <p className='text-xl sm:text-2xl mb-4'>No Services Available or Posted</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Service
            </button>
           </div>
      ) : (
      <>
      <div className="overflow-x-auto">
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
            <thead>
                <tr>
                    <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>#</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-left'>Service Name</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Created On</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-center'>Duration / Price</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-left'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? 
                    <tr><td colSpan="5" className='py-4 text-center'>Loading services...</td></tr>
                    :
                    services.map((service, index) => (
                        <tr key={service._id} className='text-gray-700'>
                            <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{index + 1}</td>
                            <td className='py-2 px-4 border-b border-gray-200'>
                                <p className="font-medium text-gray-900">{service.name}</p>
                                <p className="text-xs text-gray-500">{service.description ? service.description.substring(0, 50) + '...' : ''}</p>
                            </td>
                            <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                                {format(new Date(service.createdAt), 'MMM dd, yyyy')}
                            </td>
                            <td className='py-2 px-4 border-b border-gray-200 text-center'>
                                {service.duration} min / ${service.price}
                            </td>
                            <td className='py-2 px-4 border-b border-gray-200'>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => openEditModal(service)}
                                        className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="p-2 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
      </div>

      <div className='mt-4 flex justify-end'>
        <button onClick={openCreateModal} className='bg-black text-white py-2 px-4 rounded'>
          Add New Service
        </button>
      </div>
      </>
      )}

      {/* We use a modal for creating and editing services. */}
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