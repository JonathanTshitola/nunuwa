import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Alert, Divider } from '@mui/material';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase-config';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '', // Ajout du numéro de téléphone
    address: '',
    city: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Récupère les informations de l'utilisateur pour pré-remplir le formulaire
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setShippingInfo({
            name: data.name || '',
            phone: data.phone || '', // Pré-remplissage du numéro de téléphone
            address: data.address || '',
            city: data.city || ''
          });
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError("Vous devez être connecté pour passer une commande.");
      setLoading(false);
      return;
    }
    
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      setError("Veuillez remplir toutes les informations d'expédition.");
      setLoading(false);
      return;
    }

    try {
      const ordersCollectionRef = collection(db, 'orders');
      await addDoc(ordersCollectionRef, {
        userId: user.uid,
        userName: shippingInfo.name,
        userPhone: shippingInfo.phone, // Ajout du numéro de téléphone à la commande
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: subtotal,
        status: 'En attente',
        createdAt: new Date(),
      });

      clearCart();
      navigate('/confirmation');
      setLoading(false);

    } catch (err) {
      setError("Une erreur est survenue lors du placement de la commande.");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper 
          elevation={6} 
          sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1000, borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
            Finaliser la commande
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2, borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                Informations d'expédition
              </Typography>
              <Box component="form" onSubmit={handleCheckout}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  name="name"
                  margin="normal"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  name="phone"
                  margin="normal"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Adresse"
                  name="address"
                  margin="normal"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Ville"
                  name="city"
                  margin="normal"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? 'Traitement...' : 'Payer et commander'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                variant="outlined" 
                sx={{ p: { xs: 2, md: 3 }, height: '100%', bgcolor: 'action.hover', borderRadius: 2 }}
              >
                <Typography variant="h5" gutterBottom sx={{ mb: 2, borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                  Récapitulatif de la commande
                </Typography>
                <Box>
                  {cartItems.map((item) => (
                    <Paper key={item.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Box 
                            component="img"
                            src={item.imageUrl || 'https://via.placeholder.com/100'}
                            alt={item.name}
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                            {item.quantity} x {item.price.toFixed(2)} USD
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {subtotal.toFixed(2)} USD
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Checkout;