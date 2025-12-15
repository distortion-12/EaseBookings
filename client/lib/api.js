import axios from 'axios';
import toast from 'react-hot-toast';

// We've already configured axios defaults in AuthContext.js

// --- Service API ---
export const getServices = async () => {
  try {
    const res = await axios.get('/api/admin/services');
    return res.data.data;
  } catch (error) {
    toast.error('Could not fetch services.');
    return [];
  }
};

export const createService = async (serviceData) => {
  try {
    const res = await axios.post('/api/admin/services', serviceData);
    toast.success('Service created successfully!');
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to create service.');
    return null;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const res = await axios.put(`/api/admin/services/${id}`, serviceData);
    toast.success('Service updated successfully!');
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to update service.');
    return null;
  }
};

export const deleteService = async (id) => {
  try {
    await axios.delete(`/api/admin/services/${id}`);
    toast.success('Service deleted successfully!');
    return true;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to delete service.');
    return false;
  }
};

// --- Staff API ---

export const getStaff = async () => {
  try {
    const res = await axios.get('/api/admin/staff');
    return res.data.data;
  } catch (error) {
    toast.error('Could not fetch staff.');
    return [];
  }
};

export const createStaff = async (staffData) => {
  try {
    const res = await axios.post('/api/admin/staff', staffData);
    toast.success('Staff member created!');
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to create staff member.');
    return null;
  }
};

export const updateStaff = async (id, staffData) => {
  try {
    const res = await axios.put(`/api/admin/staff/${id}`, staffData);
    toast.success('Staff member updated!');
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to update staff member.');
    return null;
  }
};

export const deleteStaff = async (id) => {
  try {
    await axios.delete(`/api/admin/staff/${id}`);
    toast.success('Staff member deleted!');
    return true;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to delete staff member.');
    return false;
  }
};

// --- Appointment API (for Admin) ---

export const getBusinessAppointments = async (startDate, endDate) => {
  try {
    const res = await axios.get('/api/booking/admin/my-appointments', {
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });
    return res.data.data;
  } catch (error) {
    toast.error('Could not fetch appointments.');
    return [];
  }
};

// --- Booking + Payments (Client) ---

export const initiateBookingPayment = async (businessSlug, payload) => {
  try {
    const res = await axios.post(`/api/booking/${businessSlug}/payment/order`, payload);
    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.error || 'Unable to start payment. Please retry.';
    toast.error(message);
    return null;
  }
};