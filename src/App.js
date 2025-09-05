import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './pages/Store';
import ProductManager from './pages/ProductManager';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; // Importez la nouvelle page de profil
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import { ThemeModeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails'; 

function App() {
  return (
    <AuthProvider>
      <ThemeModeProvider>
        <CssBaseline />
        <Router>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Store />} />
              <Route path="/product/:productId" element={<ProductDetails />} /> 
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route 
                path="/manager" 
                element={
                  <AdminRoute>
                    <ProductManager />
                  </AdminRoute>
                } 
              />
            </Routes>
          </CartProvider>
        </Router>
      </ThemeModeProvider>
    </AuthProvider>
  );
}

export default App;