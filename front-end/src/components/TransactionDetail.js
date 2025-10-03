// src/components/TransactionDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const TransactionDetail = () => {
    const [transaction, setTransaction] = useState(null);
    const { id } = useParams(); // Mengambil 'id' dari URL

    useEffect(() => {
        axios.get(`http://localhost:4000/api/transactions/${id}`)
            .then(response => {
                setTransaction(response.data.data);
            })
            .catch(error => console.error("Error fetching transaction details:", error));
    }, [id]);

    if (!transaction) return <p>Loading...</p>;

    const statusMap = { 0: 'SUCCESS', 1: 'FAILED' };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Detail Transaksi #{transaction.id}</h2>
            <div style={{ lineHeight: '1.8' }}>
                <p><strong>Product ID:</strong> {transaction.productID}</p>
                <p><strong>Product Name:</strong> {transaction.productName}</p>
                <p><strong>Amount:</strong> {transaction.amount}</p>
                <p><strong>Customer Name:</strong> {transaction.customerName}</p>
                <p><strong>Status:</strong> {statusMap[transaction.status]}</p>
                <p><strong>Transaction Date:</strong> {transaction.transactionDate}</p>
            </div>
            <br />
            <Link to="/"><button>Kembali ke Daftar</button></Link>
        </div>
    );
};

export default TransactionDetail;