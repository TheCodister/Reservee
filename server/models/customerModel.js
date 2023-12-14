const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    photo_url VARCHAR(255), 
    name VARCHAR(100) NOT NULL, 
    gender VARCHAR(50),
    email VARCHAR(50),
    phone_number VARCHAR(15))`);
});

module.exports = db;