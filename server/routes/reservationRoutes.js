const express = require('express');
const models = require('../models'); 
const router = express.Router();
const reservationModel = models.reservationModel;


// Fetch all restaurants
router.get('/', (req, res) => {
    reservationModel.all('SELECT * FROM reservation', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
});

// API endpoint to add a new reservation by customer_id, restaurant_id, date, time, number_of_seats
router.post('/reserve', (req, res) => {
    const { customer_id, restaurant_id, date, time, timeslot, fname, email, phone_number, number_of_seats, note } = req.body;
  
    // Check seat availability
    const startTime = time;
    const beforeTime = calculateBeforeTime(time); 
    getTotalAvailableSeats(restaurant_id, (err, seatCapacity) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        getTotalReservedSeats(restaurant_id, date, beforeTime, startTime, (err, totalReservedSeats) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

        const totalAvailableSeats = seatCapacity - totalReservedSeats;
  
        if (totalAvailableSeats >= number_of_seats) {
          // Reservation is possible, insert into the database
          reservationModel.run(
            `
            INSERT INTO reservation (customer_id, restaurant_id, date, time, timeslot, fname, email, phone_number, seat_number, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [customer_id, restaurant_id, date, time, timeslot, fname, email, phone_number, number_of_seats, note],
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
              }
  
              res.json({ success: true, message: 'Reservation successful' });
            }
          );
        } else {
          // Not enough available seats
          res.status(400).json({ error: 'Not enough available seats' });
        }
      });
    });
  });

// API endpoint to get a reservation by reservation ID
router.get('/reservation/:reservation_id', (req, res) => {
  const reservation_id = req.params.reservation_id;

  reservationModel.all(
      `
      SELECT *
      FROM reservation
      WHERE id = ?
  `,
      [reservation_id],
      (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      res.json({ reservations: rows });
      }
  );
});

// API endpoint to get a reservation by customer ID
router.get('/customer/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;

    reservationModel.all(
        `
        SELECT *
        FROM reservation
        WHERE customer_id = ?
        ORDER BY date DESC, time DESC
    `,
        [customer_id],
        (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json({ reservations: rows });
        }
    );
});

// API endpoint to get a reservation by restaurant ID
router.get('/restaurant/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id;

  reservationModel.all(
      `
      SELECT *
      FROM reservation
      WHERE restaurant_id = ?
      ORDER BY date DESC, time DESC
  `,
      [restaurant_id],
      (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      res.json({ reservations: rows });
      }
  );
});

// API endpoint to delete a reservation by ID
router.delete('/:reservation_id', (req, res) => {
    const reservation_id = req.params.reservation_id;
    reservationModel.get(
      `
      SELECT *
      FROM reservation
      WHERE id = ?
    `,
      [reservation_id],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (!row) {
          res.status(404).json({ error: 'Reservation not found' });
          return;
        }
  
        reservationModel.run(
          `
          DELETE FROM reservation
          WHERE id = ?
        `,
          [reservation_id],
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }
  
            res.json({ message: 'Reservation canceled successfully' });
          }
        );
      }
    );
  });

// API endpoint to update the information of a reservation by ID
router.put('/infos/:reservation_id', (req, res) => {
  const reservation_id = req.params.reservation_id;
  const { fname, email, phone_number, note } = req.body;

  reservationModel.get(
    `
    SELECT *
    FROM reservation
    WHERE id = ?
  `,
    [reservation_id],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'Reservation not found' });
        return;
      }

      reservationModel.run(
        `
        UPDATE reservation
        SET fname = ?, email = ?, phone_number = ?, note = ?
        WHERE id = ?
      `,
        [fname, email, phone_number, note, reservation_id],
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          // Reservation successfully updated
          res.json({ message: 'Reservation updated successfully' });
        }
      );
    }
  );
});

// API endpoint to update the date, time, number of seats of a reservation by ID
router.put('/:reservation_id', (req, res) => {
    const reservation_id = req.params.reservation_id;
    const { date, time, timeslot, number_of_seats } = req.body;
  
    reservationModel.get(
      `
      SELECT *
      FROM reservation
      WHERE id = ?
    `,
      [reservation_id],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (!row) {
          res.status(404).json({ error: 'Reservation not found' });
          return;
        }
        const startTime = time;
        const beforeTime = calculateBeforeTime(startTime); 
        const restaurant_id = row.restaurant_id;

        getTotalAvailableSeats(restaurant_id, (err, seatCapacity) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }
    
            getTotalReservedSeatsExcept(reservation_id, restaurant_id, date, beforeTime, startTime, (err, totalReservedSeats) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
                }
                const totalAvailableSeats = seatCapacity - totalReservedSeats;
                if (totalAvailableSeats >= number_of_seats) {
                    reservationModel.run(
                        `
                        UPDATE reservation
                        SET date = ?, time = ?, timeslot = ?, seat_number = ?
                        WHERE id = ?
                        `,
                        [date, time, timeslot, number_of_seats, reservation_id],
                        (err) => {
                            if (err) {
                            console.error(err);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                            }
                
                            res.json({ message: 'Reservation updated successfully' });
                        }
                    );
                }
                
            });
        });
      }
    );
});
  
function getTotalAvailableSeats(restaurant_id, callback) {
    reservationModel.get(
      `
      SELECT seat_capacity
      FROM restaurant
      WHERE id = ?
    `,
      [restaurant_id],
      (err, row) => {
        if (err) {
          console.error(err);
          callback(err, null);
          return;
        }
  
        if (!row) {
          // Restaurant not found
          callback(null, 0);
          return;
        }
  
        const seatCapacity = row.seat_capacity || 0;
        callback(null, seatCapacity);
      }
    );
}
  
function getTotalReservedSeats(restaurant_id, date, startTime, endTime, callback) {
    reservationModel.get(
        `
        SELECT COUNT(*) as total_reserved_seats
        FROM reservation
        WHERE restaurant_id = ? AND date = ? AND time BETWEEN ? AND ?
    `,
        [restaurant_id, date, startTime, endTime],
        (err, row) => {
        if (err) {
            callback(err, null);
            return;
        }

        const totalReservedSeats = row.total_reserved_seats || 0;
        callback(null, totalReservedSeats);
        }
    );
}

function getTotalReservedSeatsExcept(reservation_id, restaurant_id, date, startTime, endTime, callback) {
  reservationModel.get(
      `
      SELECT COUNT(*) as total_reserved_seats
      FROM reservation
      WHERE restaurant_id = ? AND date = ? AND time BETWEEN ? AND ? AND id <> ?
  `,
      [restaurant_id, date, startTime, endTime, reservation_id],
      (err, row) => {
      if (err) {
          callback(err, null);
          return;
      }

      const totalReservedSeats = row.total_reserved_seats || 0;
      callback(null, totalReservedSeats);
      }
  );
}

function calculateBeforeTime(startTime) {
    const [hours, minutes] = startTime.split(':');
    let beforeHour = parseInt(hours, 10) - 1;
  
    if (beforeHour < 0) {
      beforeHour = 23; 
    }
  
    const formattedbeforeHour = beforeHour.toString().padStart(2, '0');
  
    const beforeTime = `${formattedbeforeHour}:${minutes}`;
  
    return beforeTime;
}

module.exports = router;