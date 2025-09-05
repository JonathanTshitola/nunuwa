import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Grid, CardMedia } from '@mui/material';
import { ArrowBack as ArrowBackIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { db } from '../services/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDocRef = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDocRef);

        if (productSnapshot.exists()) {
          setProduct({ ...productSnapshot.data(), id: productSnapshot.id });
        } else {
          setError("Produit introuvable.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du produit:", err);
        setError("Erreur lors du chargement des détails du produit.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Optional: Navigate to cart page after adding
      // navigate('/cart'); 
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>
          Retour à la boutique
        </Button>

        {product && (
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  image={product.imageUrl || "https://via.placeholder.com/600x600?text=Image+Produit"}
                  alt={product.name}
                  sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ my: 2, fontWeight: 'bold' }}>
                  {product.price.toFixed(2)} USD
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Catégorie : {product.category}
                </Typography>
                <Typography variant="body1" sx={{ mt: 3, lineHeight: 1.8 }}>
                  {product.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  startIcon={<AddShoppingCartIcon />}
                  sx={{ mt: 4, py: 1.5, px: 4, fontSize: '1.1rem', borderRadius: '50px' }}
                >
                  Ajouter au panier
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default ProductDetails;