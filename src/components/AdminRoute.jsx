// src/components/AdminRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Vous pouvez afficher un spinner de chargement ici
    return <div>Chargement...</div>;
  }

  // Si l'utilisateur n'est pas connecté OU si son rôle n'est pas "admin"
  if (!user || user.role !== 'admin') {
    // Il est redirigé vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;