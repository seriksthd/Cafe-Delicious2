import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import Menu from './pages/Menu';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <Navbar />
          <Cart />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </Provider>
  );
}

export default App;