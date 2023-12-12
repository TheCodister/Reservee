// routes/restaurantRoutes.js
const express = require('express');
const models = require('../models'); // Adjust the path based on your folder structure

const router = express.Router();
const restaurantModel = models.restaurantModel;

// Get all restaurants
// Fetch all restaurants
router.get('/', (req, res) => {
  restaurantModel.all('SELECT * FROM restaurant', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new restaurant
router.post('/', (req, res) => {
  const {photo_url, name, cuisine, address, phone_number, seat_capacity } = req.body;

  // Validate required fields
  if (!photo_url || !name || !cuisine || !address || !phone_number || !seat_capacity) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  restaurantModel.run(
    'INSERT INTO restaurant (photo_url, name, cuisine, address, phone_number, seat_capacity) VALUES (?, ?, ?, ?, ?, ?)',
    [photo_url, name, cuisine, address, phone_number, seat_capacity],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, photo_url, name, cuisine, address, phone_number, seat_capacity });
    }
  );
});

router.get('/search', (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    res.status(400).json({ error: 'Keyword parameter is required for search' });
    return;
  }

  const query = `
    SELECT * FROM restaurant
    WHERE name LIKE ? COLLATE NOCASE OR address LIKE ? COLLATE NOCASE OR cuisine LIKE ? COLLATE NOCASE
  `;

  const searchTerm = `%${keyword}%`; // Add wildcard for partial matches

  restaurantModel.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
