const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // db.run(`DROP TABLE IF EXISTS rating`);

    db.run(`CREATE TABLE IF NOT EXISTS rating (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reservation_id INTEGER UNIQUE,
        date TEXT DEFAULT "01-01-1970",
        time TEXT DEFAULT "00:00",
        stars INTEGER NOT NULL CHECK (stars > 0 AND stars < 6),
        comment TEXT, 
        FOREIGN KEY (reservation_id) REFERENCES reservation(id)
    )`);
});

// date text format "DD-MM-YYYY"
// time text format "HH:MM"

module.exports = db;