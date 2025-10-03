// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "transactions.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        const sql = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productID TEXT,
            productName TEXT,
            amount REAL,
            customerName TEXT,
            status INTEGER,
            transactionDate TEXT
        )`;
        db.run(sql, (err) => {
            if (err) {
                // Table already created
            } else {
                console.log('Table transactions created.');
                // Masukkan data awal dari JSON jika database baru dibuat
                const insert = 'INSERT INTO transactions (productID, productName, amount, customerName, status, transactionDate) VALUES (?,?,?,?,?,?)';
                // Anda bisa loop data JSON awal di sini dan memasukkannya
                // Contoh satu data:
                // db.run(insert, ["10001", "Test 1", 1000, "abc", 0, "2022-07-10 11:14:52"]);
            }
        });
    }
});

module.exports = db;