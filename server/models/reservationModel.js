const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS reservation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER, 
        restaurant_id INTEGER,
        date TEXT,
        time TEXT,
        timeslot INTEGER,
        fname VARCHAR(50),
        email VARCHAR(50),
        phone_number VARCHAR(15),
        seat_number INTEGER,
        note VARCHAR(300),
        FOREIGN KEY (customer_id) REFERENCES customer(id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
    )`);
});

// date text format "DD-MM-YYYY"
// time text format "HH:MM"

module.exports = db;