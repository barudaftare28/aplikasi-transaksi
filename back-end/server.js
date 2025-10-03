// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
app.use(cors());
app.use(express.json()); // Untuk parsing body JSON dari request

const PORT = 4000;

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// === API ENDPOINTS ===

// 1. GET: Mengambil semua transaksi
app.get("/api/transactions", (req, res) => {
    const sql = "SELECT * FROM transactions ORDER BY transactionDate DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// 2. GET: Mengambil satu transaksi berdasarkan ID
app.get("/api/transactions/:id", (req, res) => {
    const sql = "SELECT * FROM transactions WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

// 3. POST: Menambah transaksi baru
app.post("/api/transactions", (req, res) => {
    const { productID, productName, amount, customerName, status, transactionDate } = req.body;
    const sql = 'INSERT INTO transactions (productID, productName, amount, customerName, status, transactionDate) VALUES (?,?,?,?,?,?)';
    const params = [productID, productName, amount, customerName, status, transactionDate];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(201).json({
            "message": "success",
            "data": { id: this.lastID, ...req.body }
        });
    });
});

// 4. PUT: Mengedit transaksi berdasarkan ID
app.put("/api/transactions/:id", (req, res) => {
    const { productID, productName, amount, customerName, status, transactionDate } = req.body;
    const sql = `
        UPDATE transactions set 
           productID = ?, 
           productName = ?, 
           amount = ?, 
           customerName = ?, 
           status = ?, 
           transactionDate = ? 
        WHERE id = ?`;
    const params = [productID, productName, amount, customerName, status, transactionDate, req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({"error": res.message});
            return;
        }
        res.json({
            message: "success",
            data: req.body,
            changes: this.changes
        });
    });
});

// 5. DELETE: Menghapus transaksi berdasarkan ID
app.delete("/api/transactions/:id", (req, res) => {
    const sql = "DELETE FROM transactions WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "deleted",
            "changes": this.changes
        });
    });
});