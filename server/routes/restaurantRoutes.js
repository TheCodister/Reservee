// routes/restaurantRoutes.js
const express = require('express');
const models = require('../models'); // Adjust the path based on your folder structure

const router = express.Router();
const restaurantModel = models.restaurantModel;

// Get all restaurants
router.get('/', (req, res) => {
  restaurantModel.all("SELECT * FROM restaurant", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new restaurant
router.post('/', (req, res) => {
  const { name } = req.body;
  restaurantModel.run("INSERT INTO restaurant (name) VALUES (?)", [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
});

module.exports = router;
