import React from 'react';
import { Box, Typography, Grid, Paper, Button, IconButton, Card, CardMedia, CardContent, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Votre Panier
          </Typography>

          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                Votre panier est vide.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate('/')}
              >
                Commencer vos achats
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Vue pour grands écrans */}
              <Grid item xs={12} md={8} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Paper elevation={6} sx={{ p: 2, borderRadius: 2 }}>
                  {cartItems.map((item) => (
                    <Card key={item.id} sx={{ display: 'flex', mb: 2, p: 1, borderRadius: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                        image={item.imageUrl || 'https://via.placeholder.com/100'}
                        alt={item.name}
                      />
                      <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pl: 2 }}>
                        <Typography component="div" variant="h6" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {item.price} USD
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton size="small" onClick={() => decreaseQuantity(item.id)}>
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1, fontWeight: 'bold' }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => addToCart(item)}>
                            <AddIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)} sx={{ ml: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          {(item.price * item.quantity).toFixed(2)} USD
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Paper>
              </Grid>

              {/* Vue pour petits écrans */}
              <Grid item xs={12} md={8} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Grid container spacing={2}>
                  {cartItems.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Card elevation={3} sx={{ borderRadius: 2, p: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                        <CardMedia
                          component="img"
                          sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 1, mb: 1 }}
                          image={item.imageUrl || 'https://via.placeholder.com/150'}
                          alt={item.name}
                        />
                        <CardContent sx={{ p: 0 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {item.price} USD
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton size="small" onClick={() => decreaseQuantity(item.id)}>
                                <RemoveIcon />
                              </IconButton>
                              <Typography sx={{ mx: 1, fontWeight: 'bold' }}>{item.quantity}</Typography>
                              <IconButton size="small" onClick={() => addToCart(item)}>
                                <AddIcon />
                              </IconButton>
                            </Box>
                            <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="h6" align="right" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
                            {(item.price * item.quantity).toFixed(2)} USD
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Résumé de la commande */}
              <Grid item xs={12} md={4}>
                <Paper elevation={6} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    Résumé de la commande
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Articles ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</Typography>
                    <Typography>{subtotal.toFixed(2)} USD</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Livraison</Typography>
                    <Typography>Gratuit</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{subtotal.toFixed(2)} USD</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, py: 1.5 }}
                    onClick={() => navigate('/checkout')}
                  >
                    Passer à la caisse
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Cart;
