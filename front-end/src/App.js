// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm'; 
import TransactionDetail from './components/TransactionDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rute untuk halaman utama */}
          <Route path="/" element={<TransactionList />} />
          
          {/* Rute untuk halaman tambah data */}
          <Route path="/add" element={<TransactionForm />} />

          {/* Rute untuk halaman edit data */}
          <Route path="/edit/:id" element={<TransactionForm />} />

          {/* Rute untuk halaman lihat detail transaksi */}
          <Route path="/view/:id" element={<TransactionDetail />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;