/*
 * This file contains the controller functions for managing services.
 * It handles creating, retrieving, updating, and deleting services for a business.
 */

const Service = require('../models/Service');
const Business = require('../models/Business');

// Retrieves all services associated with the currently authenticated business.
exports.getServices = async (req, res) => {
  try {
    // Fetch services where the business ID matches the authenticated user's ID.
    const services = await Service.find({ business: req.business.id });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieves a specific service by its ID, ensuring the user is authorized to view it.
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Verify that the service belongs to the authenticated business.
    if (service.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Creates a new service for the authenticated business.
exports.createService = async (req, res) => {
  try {
    // Associate the new service with the authenticated business ID.
    req.body.business = req.business.id;

    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Updates an existing service, ensuring the user is authorized to make changes.
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Verify that the service belongs to the authenticated business.
    if (service.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Deletes a service, ensuring the user is authorized to perform the deletion.
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(44).json({ success: false, error: 'Service not found' });
    }

    // Verify that the service belongs to the authenticated business.
    if (service.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Remove the service from the database.
    await service.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};