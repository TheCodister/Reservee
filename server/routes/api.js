const express = require('express');
const restaurantRoutes = require('./restaurantRoutes');

const router = express.Router();

// Use the restaurant and customer routes
router.use('/restaurants', restaurantRoutes);

module.exports = router;
