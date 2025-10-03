// src/components/TransactionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TransactionForm = () => {
    const [formData, setFormData] = useState({
        productID: '',
        productName: '',
        amount: '',
        customerName: 'abc',
        status: 0,
        transactionDate: '',
    });
    const navigate = useNavigate();
    const { id } = useParams(); // Dapatkan ID dari URL jika ada (untuk mode edit)

    const isEditMode = Boolean(id); // Cek apakah ini mode edit atau tambah

    useEffect(() => {
        // Jika ini mode edit, ambil data yang ada dan isi form
        if (isEditMode) {
            axios.get(`http://localhost:4000/api/transactions/${id}`)
                .then(response => {
                    const data = response.data.data;
                    // Format tanggal agar sesuai dengan input
                    setFormData({
                        ...data,
                        transactionDate: new Date(data.transactionDate).toISOString().slice(0, 16)
                    });
                })
                .catch(error => console.error("Error fetching transaction data:", error));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Format tanggal kembali ke format database sebelum mengirim
        const submissionData = {
            ...formData,
            transactionDate: new Date(formData.transactionDate).toISOString().slice(0, 19).replace('T', ' ')
        };

        const request = isEditMode
            ? axios.put(`http://localhost:4000/api/transactions/${id}`, submissionData) // Kirim PUT jika edit
            : axios.post('http://localhost:4000/api/transactions', submissionData); // Kirim POST jika tambah

        request
            .then(() => {
                navigate('/'); // Kembali ke halaman utama setelah sukses
            })
            .catch(error => console.error("Error saving transaction:", error));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>{isEditMode ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '10px' }}>
                <input name="productID" value={formData.productID} onChange={handleChange} placeholder="Product ID" required />
                <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" required />
                <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" required />
                <input name="transactionDate" type="datetime-local" value={formData.transactionDate} onChange={handleChange} required />
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value={0}>SUCCESS</option>
                    <option value={1}>FAILED</option>
                </select>
                <button type="submit">Simpan</button>
            </form>
        </div>
    );
};

export default TransactionForm;