const express = require("express");
const models = require("../models");
const router = express.Router();
const ratingModel = models.ratingModel;
const reservationModel = models.reservationModel;

function getDateAndTime() {
    const d = new Date();
    const date = d.getDate();
    const month = d.getMonth() + 1; //zero-based
    const year = d.getFullYear();
    const hour = d.getHours();
    const minutes = d.getMinutes();

    const insertedDate = `${date < 10 ? '0' + date : date}-${month < 10 ? '0' + month : month}-${year}`;
    const insertedTime = `${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}`;

    return {insertedDate, insertedTime};
}

/**
 * Get all ratings
 *
 * @returns message: Cannot get all ratings in DB
 */
router.get("/", (req, res) => {
	res.status(500).json({ error: "Action not allowed" });
	return;
});

/**
 * @apiDescription Retrieve all ratings associated with a user's reservations. This is particularly useful for
 * understanding a user's feedback on various reservations they've made. The endpoint requires a user ID and
 * returns all associated ratings, including details about the reservation, date, time, stars, and comments.
 *
 * @apiParam {Number} id Users unique ID.
 * 
 * @apiSuccess {Object[]} ratings List of ratings for all reservations
 * 
 * @apiError UserNotFound The id of the User was not found.
 * @apiError ErrorRetrievingRatings Error occurred while retrieving ratings.
 */
router.get('/:id', (req, res) => {
    const customerId = req.params.id;

    if (!customerId) {
        res.status(500).json({ error: "ID not valid!" });
        return;
    }

    const sql = "SELECT * FROM rating WHERE rating.reservation_id IN (SELECT reservation.id FROM reservation WHERE reservation.customer_id = ?)";

    reservationModel.all(sql, [customerId], (err, ratings) => {
        if (err) {
            // If there's an error executing the query, return an error message
            res.status(500).json({ error: "Error retrieving user ratings" });
        } else if (ratings.length === 0) {
            // If no ratings are found for the user, return a not found message
            res.status(404).json({ error: "No ratings found for user" });
        } else {
            // If ratings are found, return them in the response
            res.json(ratings);
        }
    });
});

/**
 * Save new rating, automatically set date and time to current date time, format "DD-MM-YYYY" and "HH:MM"
 */
router.post("/", (req, res) => {
	const { reservation_id, stars, comment } = req.body;

    if (!reservation_id || !stars || !comment) {
        res.status(500).json({ error: "Reservation ID, Stars or Comment is missing" });
        return;
    }

    const {insertedDate, insertedTime} = getDateAndTime();

    const sql = "INSERT INTO rating (reservation_id, stars, comment, date, time) VALUES(?,?,?,?,?)";
    ratingModel.run(sql, [reservation_id, stars, comment, insertedDate, insertedTime], err => {
        if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.status(201).json({ id: this.lastID });
    })
});

/**
 * update rating stars and comment, automatically set
 */
router.put("/", (req, res) => {
	const { rating_id, stars, comment } = req.body;

    if (!rating_id) {
        res.status(500).json({ error: "Reservation ID, Stars or Comment is missing" });
        return;
    }

    const {insertedDate, insertedTime} = getDateAndTime();
    const sql = "UPDATE rating SET stars = ?, comment = ?, date = ?, time = ? WHERE id = ?";

    ratingModel.run(sql, [stars, comment, insertedDate, insertedTime, rating_id], err => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes) {
            res.json({ message: "Rating updated", changes: this.changes });
        } else {
            res.status(404).json({ error: "Rating not found" });
        }
    })
});

/**
 * Delete a rating
 */
// router.delete("/:id", (req, res) => {
// 	const rating_id = req.params.id;

//     if (!rating_id) {
//         res.status(500).json({ error: "Reservation ID not valid" });
//         return;
//     }

//     const sql = `DELETE FROM rating WHERE id = ?`;

// 	ratingModel.run(sql, [rating_id], function (err) {
// 		if (err) {
// 			res.status(500).json({ error: err.message });
// 			return;
// 		}
// 		if (this.changes) {
// 			res.json({ message: "Rating deleted", changes: this.changes });
// 		} else {
// 			res.status(404).json({ error: "Rating not found" });
// 		}
// 	});
// });

module.exports = router;