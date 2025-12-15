const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// GET /api/business/category/:category - Get businesses by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { city } = req.query;

    const filter = { category };
    if (city) {
      filter.city = new RegExp(city, 'i'); // Case-insensitive match
    }

    const businesses = await Business.find(filter)
      .select('businessName address city phone hours category config.bookingPageSlug createdAt')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/business/:slug - Get single business by slug
router.get('/:slug', async (req, res) => {
  try {
    const business = await Business.findOne({ 'config.bookingPageSlug': req.params.slug })
      .select('businessName address city phone hours category config.bookingPageSlug');

    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
