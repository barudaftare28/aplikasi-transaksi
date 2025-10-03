// seed.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./transactions.db');

// Impor data dari file JSON Anda
const jsonData = require('./viewData (5).json');
const transactionsData = jsonData.data; // Ambil array 'data' dari JSON

db.serialize(() => {
    const insertStmt = db.prepare(`
        INSERT INTO transactions (productID, productName, amount, customerName, status, transactionDate) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    console.log('🌱 Starting to seed the database...');

    transactionsData.forEach(tx => {
        insertStmt.run(
            tx.productID,
            tx.productName,
            parseFloat(tx.amount), // Pastikan amount adalah angka
            tx.customerName,
            tx.status,
            tx.transactionDate
        );
    });

    insertStmt.finalize();

    console.log('✅ Seeding complete. All data from JSON has been inserted.');
});

db.close();