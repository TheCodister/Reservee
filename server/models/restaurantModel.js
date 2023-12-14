const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS restaurant (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    photo_url VARCHAR(255), 
    name VARCHAR(100) NOT NULL, 
    cuisine VARCHAR(50), 
    address VARCHAR(255), 
    phone_number VARCHAR(15), 
    seat_capacity INT)`);
});

module.exports = db;
