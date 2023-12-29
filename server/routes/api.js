const express = require('express');
const restaurantRoutes = require('./restaurantRoutes');
const customerRoutes = require('./customerRoutes');
const reservationRoutes = require('./reservationRoutes');
const router = express.Router();

// Use the restaurant and customer routes
router.use('/restaurants', restaurantRoutes);
router.use('/customers', customerRoutes);
router.use('/reservations', reservationRoutes)

module.exports = router;
