const Service = require('../models/Service');
const Business = require('../models/Business');

// @desc    Get all services for the logged-in business
exports.getServices = async (req, res) => {
  try {
    // req.business.id comes from the 'protect' middleware
    const services = await Service.find({ business: req.business.id });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Check ownership
    if (service.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new service
exports.createService = async (req, res) => {
  try {
    // Add the business ID from the logged-in user to the request body
    req.body.business = req.business.id;

    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a service
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Check ownership
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

// @desc    Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(44).json({ success: false, error: 'Service not found' });
    }

    // Check ownership
    if (service.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await service.deleteOne(); // use deleteOne() Mongoose document method

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};