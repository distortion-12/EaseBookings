// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/pages/admin/staff.js

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/common/Modal';
import StaffForm from '@/components/admin/StaffForm';
import { getStaff, createStaff, updateStaff, deleteStaff } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function StaffPage() {
  const { token } = useAuth();
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // null for create, object for edit

  // Fetch initial data
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Sort logic mimicking Job Portal: latest first
      const data = await getStaff(token);
      setStaff(data.reverse()); 
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staffMember) => {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null); // Clear form
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    let success = false;
    
    try {
      if (editingStaff) {
        // Update
        const updated = await updateStaff(editingStaff._id, formData, token);
        if (updated) {
          setStaff(staff.map(s => s._id === updated._id ? updated : s));
          success = true;
        }
      } else {
        // Create
        const created = await createStaff(formData, token);
        if (created) {
          setStaff([created, ...staff]); // Add to front
          success = true;
        }
      }
    } catch (error) {
      console.error("Failed to save staff:", error);
    }

    setLoading(false);
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This staff member might have upcoming appointments.')) {
      try {
        const success = await deleteStaff(id, token);
        if (success) {
          setStaff(staff.filter(s => s._id !== id));
        }
      } catch (error) {
        console.error("Failed to delete staff:", error);
      }
    }
  };
  
  if (!loading && staff.length === 0) {
     return (
        <AdminLayout title="Staff Management">
           <div className='flex items-center justify-center h-[70vh]'>
            <p className='text-xl sm:text-2xl'>No Staff Members Added</p>
           </div>
           <div className='mt-4 flex justify-end'>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Staff
            </button>
          </div>
          
          {/* Create/Edit Modal - Included here for empty state */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={editingStaff ? 'Edit Staff Member' : 'Create New Staff Member'}
          >
            <div className="max-h-[75vh] overflow-y-auto pr-2">
              <StaffForm
                initialData={editingStaff}
                onSubmit={handleFormSubmit}
                loading={loading}
              />
            </div>
          </Modal>
        </AdminLayout>
     );
  }

  return (
    <AdminLayout title="Staff Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage your staff, their schedules, and assigned services.
        </p>
      </div>

      {/* Staff Table - Mimicking Job Portal's table structure */}
      <div className="overflow-x-auto">
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
            <thead>
                <tr>
                    <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>#</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-left'>Name</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Email / Phone</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-center'>Services</th>
                    <th className='py-2 px-4 border-b border-gray-200 text-left'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? 
                    <tr><td colSpan="5" className='py-4 text-center'>Loading staff...</td></tr>
                    :
                    staff.map((staffMember, index) => (
                        <tr key={staffMember._id} className='text-gray-700'>
                            <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{index + 1}</td>
                            <td className='py-2 px-4 border-b border-gray-200 font-medium'>{staffMember.name}</td>
                            <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                                <p className="text-gray-900">{staffMember.email || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{staffMember.phone || 'N/A'}</p>
                            </td>
                            <td className='py-2 px-4 border-b border-gray-200 text-center'>
                                <span className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs'>
                                    {staffMember.assignedServices.length} Services
                                </span>
                            </td>
                            <td className='py-2 px-4 border-b border-gray-200'>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => openEditModal(staffMember)}
                                        className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(staffMember._id)}
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
          Add New Staff
        </button>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingStaff ? 'Edit Staff Member' : 'Create New Staff Member'}
      >
        {/* The modal is set to overflow, so the form inside can be long */}
        <div className="max-h-[75vh] overflow-y-auto pr-2">
          <StaffForm
            initialData={editingStaff}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
}