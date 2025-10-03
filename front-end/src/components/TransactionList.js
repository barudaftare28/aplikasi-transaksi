// src/components/TransactionList.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TransactionList = () => {
    // --- STATE MANAGEMENT ---
    const [transactions, setTransactions] = useState([]); // Untuk data mentah dari API
    const [sortConfig, setSortConfig] = useState({ key: 'transactionDate', direction: 'ascending' });
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // --- DATA FETCHING ---
    useEffect(() => {
        axios.get('http://localhost:4000/api/transactions')
            .then(response => {
                setTransactions(response.data.data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    // --- LOGIKA SORTING & GROUPING ---
    const sortedTransactions = useMemo(() => {
        let sortableItems = [...transactions];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                // Konversi amount ke angka untuk sorting numerik
                const valA = sortConfig.key === 'amount' ? Number(a[sortConfig.key]) : a[sortConfig.key];
                const valB = sortConfig.key === 'amount' ? Number(b[sortConfig.key]) : b[sortConfig.key];

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [transactions, sortConfig]);

    const groupedTransactions = useMemo(() => {
        return sortedTransactions.reduce((acc, transaction) => {
            const date = new Date(transaction.transactionDate);
            const year = date.getFullYear();
            const month = date.toLocaleString('id-ID', { month: 'long' });
            const key = `${month} ${year}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(transaction);
            return acc;
        }, {});
    }, [sortedTransactions]);

    // --- FUNGSI-FUNGSI HANDLER ---
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            axios.delete(`http://localhost:4000/api/transactions/${id}`)
                .then(() => {
                    alert("Data berhasil dihapus!");
                    window.location.reload();
                })
                .catch(error => console.error("Error deleting data:", error));
        }
    };

    const handleEdit = (transaction) => {
        setEditingId(transaction.id);
        setEditFormData(transaction);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (id) => {
        axios.put(`http://localhost:4000/api/transactions/${id}`, editFormData)
            .then(() => {
                setEditingId(null);
                window.location.reload();
            })
            .catch(error => console.error("Error updating data:", error));
    };

    const statusMap = { 0: 'SUCCESS', 1: 'FAILED' };

    // --- RENDER ---
    return (
        <div style={{ padding: '20px' }}>
            <h1>Daftar Transaksi</h1>
            <Link to="/add"><button>Tambah Data Baru</button></Link>

            {Object.keys(groupedTransactions).map(groupKey => (
                <div key={groupKey} style={{ marginBottom: '2em' }}>
                    <h3>{groupKey}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', width: '40px' }}>No.</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => requestSort('productID')}>Product ID</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => requestSort('productName')}>Product Name</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => requestSort('amount')}>Amount</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => requestSort('customerName')}>Customer Name</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => requestSort('status')}>Status</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => requestSort('transactionDate')}>Transaction Date</th>
                                <th style={{ padding: '8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedTransactions[groupKey].map((tx, index) => (
                                <tr key={tx.id}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td>{tx.productID}</td>
                                    <td onDoubleClick={() => handleEdit(tx)}>
                                        {editingId === tx.id ? (
                                            <input type="text" name="productName" value={editFormData.productName} onChange={handleInputChange} onBlur={() => handleSave(tx.id)} onKeyDown={(e) => { if (e.key === 'Enter') handleSave(tx.id) }} autoFocus />
                                        ) : ( tx.productName )}
                                    </td>
                                    <td style={{textAlign: 'center'}}>{tx.amount}</td>
                                    <td onDoubleClick={() => handleEdit(tx)}>
                                        {editingId === tx.id ? (
                                            <input type="text" name="customerName" value={editFormData.customerName} onChange={handleInputChange} onBlur={() => handleSave(tx.id)} onKeyDown={(e) => { if (e.key === 'Enter') handleSave(tx.id) }} />
                                        ) : ( tx.customerName )}
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: tx.status === 0 ? 'green' : 'red' }}>{statusMap[tx.status]}</td>
                                    <td>{tx.transactionDate}</td>
                                    <td>
                                        <Link to={`/view/${tx.id}`}><button>View</button></Link>
                                        <Link to={`/edit/${tx.id}`}><button className="btn-edit">Edit</button></Link>
                                        <button className="btn-delete" onClick={() => handleDelete(tx.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default TransactionList;