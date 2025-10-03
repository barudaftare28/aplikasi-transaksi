// src/components/TransactionList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TransactionList = () => {
    // State untuk menyimpan data yang sudah dikelompokkan
    const [groupedTransactions, setGroupedTransactions] = useState({});

    // useEffect akan berjalan sekali saat komponen pertama kali ditampilkan
    useEffect(() => {
        // Lakukan request GET ke API backend
        axios.get('http://localhost:4000/api/transactions')
            .then(response => {
                const data = response.data.data;

                // Logika untuk mengelompokkan data berdasarkan Tahun dan Bulan
                const grouped = data.reduce((acc, transaction) => {
                    const date = new Date(transaction.transactionDate);
                    const year = date.getFullYear();
                    // 'long' untuk mendapatkan nama bulan (e.g., "Juli")
                    const month = date.toLocaleString('id-ID', { month: 'long' }); 
                    const key = `${month} ${year}`;

                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(transaction);
                    return acc;
                }, {});

                setGroupedTransactions(grouped);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []); // Array kosong berarti efek ini hanya berjalan sekali

    const statusMap = { 0: 'SUCCESS', 1: 'FAILED' };

    const handleDelete = (id) => {
    // Minta konfirmasi dari pengguna sebelum menghapus
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (confirmDelete) {
        axios.delete(`http://localhost:4000/api/transactions/${id}`)
            .then(() => {
                alert("Data berhasil dihapus!");
                // Muat ulang halaman untuk melihat daftar yang diperbarui (cara termudah)
                window.location.reload();
            })
            .catch(error => {
                console.error("Error deleting data:", error);
                alert("Gagal menghapus data.");
            });
    }
};

    return (
        <div style={{ padding: '20px' }}>
            <h1>Daftar Transaksi</h1>
            <Link to="/add">
                <button>Tambah Data Baru</button>
            </Link>
            {/* Loop melalui setiap grup (misal: "Juli 2022") */}
            {Object.keys(groupedTransactions).map(groupKey => (
                <div key={groupKey} style={{ marginBottom: '2em' }}>
                    <h3>{groupKey}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', width: '40px' }}>No</th>
                                <th style={{ padding: '8px' }}>Product ID</th>
                                <th style={{ padding: '8px' }}>Product Name</th>
                                <th style={{ padding: '8px' }}>Amount</th>
                                <th style={{ padding: '8px' }}>Customer Name</th>
                                <th style={{ padding: '8px' }}>Status</th>
                                <th style={{ padding: '8px' }}>Transaction Date</th>
                                <th style={{ padding: '8px' }}>Actions</th> {/* <-- TAMBAHKAN HEADER INI */}

                            </tr>
                        </thead>
                        <tbody>
                            {/* Loop melalui setiap transaksi di dalam grup */}
                            {groupedTransactions[groupKey].map((tx, index) => (
                                <tr key={tx.id}>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ padding: '8px' }}>{tx.productID}</td>
                                    <td style={{ padding: '8px' }}>{tx.productName}</td>
                                    <td style={{ padding: '8px' }}>{tx.amount}</td>
                                    <td style={{ padding: '8px' }}>{tx.customerName}</td>
                                    <td style={{ 
                                        padding: '8px', 
                                        fontWeight: 'bold',
                                        color: tx.status === 0 ? 'green' : 'red' 
                                    }}>
                                        {statusMap[tx.status]}
                                    </td>                                    <td style={{ padding: '8px' }}>{tx.transactionDate}</td>
                                    <td style={{ padding: '8px' }}>
                                        <Link to={`/view/${tx.id}`}><button>View</button></Link>
                                        <Link to={`/edit/${tx.id}`}><button className="btn-edit">Edit</button></Link>
                                        <button className="btn-delete" onClick={() => handleDelete(tx.id)}>Delete</button>
                                        <button onClick={() => handleDelete(tx.id)}>Delete</button> {/* <-- TAMBAHKAN TOMBOL INI */}

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