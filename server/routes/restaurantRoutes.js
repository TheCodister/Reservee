// routes/restaurantRoutes.js
const express = require("express");
const models = require("../models");
const router = express.Router();
const restaurantModel = models.restaurantModel;

// Get all restaurants
// Fetch all restaurants
router.get("/", (req, res) => {
  restaurantModel.all(
    "SELECT *, NULL as menu_urls FROM restaurant",
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Add a new restaurant
router.post("/", (req, res) => {
  const {
    photo_url,
    menu_urls,
    name,
    description,
    price_range,
    cuisine,
    address,
    phone_number,
    seat_capacity,
  } = req.body;

  // Validate required fields
  if (
    !photo_url ||
    !menu_urls ||
    !name ||
    !description ||
    !price_range ||
    !cuisine ||
    !address ||
    !phone_number ||
    !seat_capacity
  ) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  restaurantModel.run(
    "INSERT INTO restaurant (photo_url, menu_urls, name, description, price_range, cuisine, address, phone_number, seat_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      photo_url,
      menu_urls,
      name,
      description,
      price_range,
      cuisine,
      address,
      phone_number,
      seat_capacity,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        photo_url,
        menu_urls,
        name,
        description,
        price_range,
        cuisine,
        address,
        phone_number,
        seat_capacity,
      });
    }
  );
});

// API endpoint to get a restaurant by restaurant ID
router.get("/:restaurant_id", (req, res) => {
  const restaurant_id = req.params.restaurant_id;

  restaurantModel.all(
    `
      SELECT *
      FROM restaurant
      WHERE id = ?
  `,
    [restaurant_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({ restaurants: rows });
    }
  );
});

// API endpoint to get a menu by restaurant ID
router.get("/menus/:restaurant_id", (req, res) => {
  const restaurant_id = req.params.restaurant_id;

  restaurantModel.all(
    `
      SELECT json(menu_urls) AS menu_json
      FROM restaurant 
      WHERE id = ?
  `,
    [restaurant_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (rows.length > 0) {
        const menuJsonString = rows[0].menu_json;
        const menuJson = JSON.parse(menuJsonString);
        res.json({ menus: menuJson });
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    }
  );
});

router.get("/search", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    res.status(400).json({ error: "Keyword parameter is required for search" });
    return;
  }

  const query = `
    SELECT * FROM restaurant
    WHERE name LIKE ? COLLATE NOCASE OR address LIKE ? COLLATE NOCASE 
    OR cuisine LIKE ? COLLATE NOCASE OR description LIKE ? COLLATE NOCASE
  `;

  const searchTerm = `%${keyword}%`; // Add wildcard for partial matches

  restaurantModel.all(
    query,
    [searchTerm, searchTerm, searchTerm],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

module.exports = router;
