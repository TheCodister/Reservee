const express = require('express');
const restaurantRoutes = require('./restaurantRoutes');
const customerRoutes = require('./customerRoutes');
const reservationRoutes = require('./reservationRoutes');
const ratingRoutes = require('./ratingRoutes');
const router = express.Router();

// Use the restaurant and customer routes
router.use('/restaurants', restaurantRoutes);
router.use('/customers', customerRoutes);
router.use('/reservations', reservationRoutes);
router.use('/ratings', ratingRoutes);

module.exports = router;
