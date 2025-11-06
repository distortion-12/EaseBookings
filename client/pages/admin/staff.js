import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/common/Modal';
import StaffForm from '@/components/admin/StaffForm';
import { getStaff, createStaff, updateStaff, deleteStaff } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // null for create, object for edit

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getStaff();
    setStaff(data);
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
    
    if (editingStaff) {
      // Update
      const updated = await updateStaff(editingStaff._id, formData);
      if (updated) {
        setStaff(staff.map(s => s._id === updated._id ? updated : s));
        success = true;
      }
    } else {
      // Create
      const created = await createStaff(formData);
      if (created) {
        setStaff([...staff, created]);
        success = true;
      }
    }

    setLoading(false);
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This staff member might have upcoming appointments.')) {
      const success = await deleteStaff(id);
      if (success) {
        setStaff(staff.filter(s => s._id !== id));
      }
    }
  };

  return (
    <AdminLayout title="Staff Management">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage your staff, their schedules, and assigned services.
        </p>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add Staff
        </button>
      </div>

      {/* Staff List/Table */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {loading && <li><p className="p-4">Loading staff...</p></li>}
          {!loading && staff.length === 0 && (
            <li><p className="p-4 text-gray-500">No staff found. Click "Add Staff" to get started.</p></li>
          )}
          {staff.map((staffMember) => (
            <li key={staffMember._id}>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-md font-medium text-gray-900">
                    {staffMember.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {staffMember.email || 'No email'}
                  </p>
                </div>
                <div className="flex-1 min-w-0 text-center hidden sm:block">
                  <span className="text-gray-500">
                    {staffMember.assignedServices.length} assigned services
                  </span>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(staffMember)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(staffMember._id)}
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