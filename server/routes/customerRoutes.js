// routes/customerRoutes.js
const express = require('express');
const models = require('../models'); // Adjust the path based on your folder structure

const router = express.Router();
const customerModel = models.customerModel;

/**
 * @route POST /customers
 * @desc Create a new customer
 * @body { photo_url: string, name: string, gender: string, email: string, phone_number: string }
 * @returns {Object} The created customer with ID
 */
router.post("/", (req, res) => {
	const { photo_url, name, gender, email, phone_number } = req.body;

	if (!name || !gender || !email || !phone_number) {
		res.status(400).json({ error: "Name, gender, email, and phone number are required!" });
		return;
	}

	const sql = `INSERT INTO customer (photo_url, name, gender, email, phone_number) VALUES (?, ?, ?, ?, ?)`;

	customerModel.run(sql, [photo_url, name, gender, email, phone_number], function (err) {
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
router.get("/", (req, res) => {
	const sql = `SELECT * FROM customer`;

	customerModel.all(sql, [], (err, rows) => {
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
router.get("/:id", (req, res) => {
	const sql = `SELECT * FROM customer WHERE id = ?`;

    if (!req.params.id) {
        res.status(400).json({ error: "ID is not valid!" });
		return;
    }

	customerModel.get(sql, [req.params.id], (err, row) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (row) {
			res.json(row);
		} else {
			res.status(404).json({ error: "Customer not found" });
		}
	});
});

/**
 * @route GET /customers/get/name/:name
 * @desc Get customers by name (partial match)
 * @param {String} name - Customer's name
 * @returns {Array} List of customers matching the name
 */
router.get("/get/name/:name", (req, res) => {
	const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: "Name is required!" });
		return;
    }

	const sql = `SELECT * FROM customer WHERE name LIKE ?`;

	customerModel.all(sql, [`%${name}%`], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (rows.length > 0) {
			res.json(rows);
		} else {
			res.status(404).json({ message: "No customers found with that name" });
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
router.put("/:id", (req, res) => {
    const { photo_url, name, gender, email, phone_number } = req.body;

    // Initialize an array to hold the parts of the SQL query
    let updates = [];
    let queryParams = [];

    // Check for each field and if it exists, add it to the updates and queryParams
    if(photo_url !== undefined) {
        updates.push("photo_url = ?");
        queryParams.push(photo_url);
    }

    if(name !== undefined) {
        updates.push("name = ?");
        queryParams.push(name);
    }

    if(gender !== undefined) {
        updates.push("gender = ?");
        queryParams.push(gender);
    }

    if(email !== undefined) {
        updates.push("email = ?");
        queryParams.push(email);
    }

    if(phone_number !== undefined) {
        updates.push("phone_number = ?");
        queryParams.push(phone_number);
    }

    // If no fields are provided to update, return an error
    if(updates.length === 0) {
        res.status(400).json({ error: "No fields provided for update" });
        return;
    }

    // Join the updates for the SQL query and add the customer ID at the end of queryParams
    const sql = `UPDATE customer SET ${updates.join(", ")} WHERE id = ?`;
    queryParams.push(req.params.id);

    // Run the database query
    customerModel.run(sql, queryParams, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes) {
            res.json({ message: "Customer updated", changes: this.changes });
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    });
});


/**
 * @route DELETE /customers/:id
 * @desc Delete a customer
 * @param {Number} id - Customer's ID
 * @returns {Object} Message and number of changed rows
 */
router.delete("/:id", (req, res) => {
	const sql = `DELETE FROM customer WHERE id = ?`;

	customerModel.run(sql, [req.params.id], function (err) {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (this.changes) {
			res.json({ message: "Customer deleted", changes: this.changes });
		} else {
			res.status(404).json({ error: "Customer not found" });
		}
	});
});

module.exports = router;
