/*
 * This file contains the API client functions for communicating with the backend.
 * It includes a helper for making fetch requests and specific functions for provider (admin) and public (client) endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to handle API requests, including setting headers and handling errors.
const fetchApi = async (url, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        // Attach the authorization token if provided.
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const data = await response.json();

        if (!response.ok) {
            // Throw an error if the response status indicates failure.
            throw new Error(data.error || `API call failed with status ${response.status}`);
        }

        // Return the data payload from the response.
        return data.data; 
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
};

// ===============================================
//           PROVIDER (ADMIN) ENDPOINTS
// ===============================================

// Retrieves the list of services for the authenticated provider.
export const getServices = async (token) => {
    return fetchApi('/admin/services', 'GET', null, token);
};

// Creates a new service for the authenticated provider.
export const createService = async (formData, token) => {
    return fetchApi('/admin/services', 'POST', formData, token);
};

// Updates an existing service for the authenticated provider.
export const updateService = async (id, formData, token) => {
    return fetchApi(`/admin/services/${id}`, 'PUT', formData, token);
};

// Deletes a service for the authenticated provider.
export const deleteService = async (id, token) => {
    return fetchApi(`/admin/services/${id}`, 'DELETE', null, token);
};

// Retrieves the list of staff members for the authenticated provider.
export const getStaff = async (token) => {
    return fetchApi('/admin/staff', 'GET', null, token);
};

// Creates a new staff member for the authenticated provider.
export const createStaff = async (formData, token) => {
    return fetchApi('/admin/staff', 'POST', formData, token);
};

// Updates an existing staff member for the authenticated provider.
export const updateStaff = async (id, formData, token) => {
    return fetchApi(`/admin/staff/${id}`, 'PUT', formData, token);
};

// Deletes a staff member for the authenticated provider.
export const deleteStaff = async (id, token) => {
    return fetchApi(`/admin/staff/${id}`, 'DELETE', null, token);
};

// Retrieves appointments for the authenticated provider within a specified date range.
export const getBusinessAppointments = async (start, end, token) => {
    // Convert date objects to ISO strings for the API query parameters.
    const startDate = start.toISOString();
    const endDate = end.toISOString();
    return fetchApi(`/booking/admin/my-appointments?start=${startDate}&end=${endDate}`, 'GET', null, token);
};


// ===============================================
//           PUBLIC/CLIENT ENDPOINTS
// ===============================================

// Checks the availability of a service for a specific staff member on a given date.
export const getServiceAvailability = async (businessSlug, date, serviceId, staffId) => {
    // The date parameter is expected in "yyyy-MM-dd" format.
    return fetchApi(`/booking/${businessSlug}/availability?date=${date}&serviceId=${serviceId}&staffId=${staffId}`, 'GET');
};

// Creates a new booking for a client.
export const createBooking = async (businessSlug, bookingDetails) => {
    return fetchApi(`/booking/${businessSlug}/create`, 'POST', bookingDetails);
};