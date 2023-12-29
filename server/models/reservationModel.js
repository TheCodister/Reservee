const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS reservation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER, 
        restaurant_id INTEGER,
        date TEXT,
        time TEXT,
        seat_number INTEGER,
        FOREIGN KEY (customer_id) REFERENCES customer(id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
    )`);
});

// date text format "DD-MM-YYYY"
// time text format "HH:MM"

module.exports = db;