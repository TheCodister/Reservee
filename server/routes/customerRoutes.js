// routes/customerRoutes.js
const express = require('express');
const db = require('../models/db'); // Replace with the correct path to your database file

const router = express.Router();

/**
 * @route POST /customers
 * @desc Create a new customer
 * @body { photo_url: string, name: string, gender: string, email: string, phone_number: string }
 * @returns {Object} The created customer with ID
 */
router.post('/', (req, res) => {
    const { photo_url, name, gender, email, phone_number } = req.body;
    const sql = `INSERT INTO customer (photo_url, name, gender, email, phone_number) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [photo_url, name, gender, email, phone_number], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

/**
 * @route GET /customers
 * @desc Get a list of all customers
 * @returns {Array} List of customers
 */
router.get('/', (req, res) => {
    const sql = `SELECT * FROM customer`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

/**
 * @route GET /customers/:id
 * @desc Get a single customer by ID
 * @param {Number} id - Customer's ID
 * @returns {Object} Customer data
 */
router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM customer WHERE id = ?`;

    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

/**
 * @route GET /customers/get/name/:name
 * @desc Get customers by name (partial match)
 * @param {String} name - Customer's name
 * @returns {Array} List of customers matching the name
 */
router.get('/get/name/:name', (req, res) => {
    const { name } = req.params;
    const sql = `SELECT * FROM customer WHERE name LIKE ?`;

    db.all(sql, [`%${name}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ message: 'No customers found with that name' });
        }
    });
});

/**
 * @route PUT /customers/:id
 * @desc Update a customer's information
 * @param {Number} id - Customer's ID
 * @body { photo_url: string, name: string, gender: string, email: string, phone_number: string }
 * @returns {Object} Message and number of changed rows
 */
router.put('/:id', (req, res) => {
    const { photo_url, name, gender, email, phone_number } = req.body;
    const sql = `UPDATE customer SET photo_url = ?, name = ?, gender = ?, email = ?, phone_number = ? WHERE id = ?`;

    db.run(sql, [photo_url, name, gender, email, phone_number, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes) {
            res.json({ message: 'Customer updated', changes: this.changes });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

/**
 * @route PATCH /customers/:id
 * @desc Partially update a customer's information
 * @param {Number} id - Customer's ID
 * @body { email?: string, phone_number?: string }
 * @returns {Object} Message and number of changed rows
 */
router.patch('/:id', (req, res) => {
    const { email, phone_number } = req.body;
    const sql = `UPDATE customer SET email = ?, phone_number = ? WHERE id = ?`;

    db.run(sql, [email, phone_number, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes) {
            res.json({ message: 'Customer updated', changes: this.changes });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

/**
 * @route DELETE /customers/:id
 * @desc Delete a customer
 * @param {Number} id - Customer's ID
 * @returns {Object} Message and number of changed rows
 */
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM customer WHERE id = ?`;

    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes) {
            res.json({ message: 'Customer deleted', changes: this.changes });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

module.exports = router;
