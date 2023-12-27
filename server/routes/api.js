const express = require('express');
const restaurantRoutes = require('./restaurantRoutes');
const customerRoutes = require('./customerRoutes');
const router = express.Router();

// Use the restaurant and customer routes
router.use('/restaurants', restaurantRoutes);
router.use('/customers', customerRoutes);

module.exports = router;
