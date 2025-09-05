import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Alert, Container, Grid, Card, CardContent } from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { db } from '../services/firebase-config';
import { collection, onSnapshot, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState('');
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      const ordersCollectionRef = collection(db, 'orders');
      const q = query(ordersCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
          };
        });

        // Triez les commandes en mémoire après les avoir récupérées.
        ordersData.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());

        // Mappez et formatez la date après le tri.
        const formattedOrders = ordersData.map(order => ({
            ...order,
            createdAt: order.createdAt?.toDate().toLocaleDateString('fr-FR'),
        }));
        setOrders(formattedOrders);
        setLoading(false);
      }, (err) => {
        setError("Erreur lors du chargement des commandes.");
        console.error(err);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteOrder = async (orderId) => {
    setDeleteError('');
    setDeleteSuccess('');
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setDeleteSuccess("La commande a été supprimée avec succès.");
      setTimeout(() => {
        setDeleteSuccess('');
      }, 3000);
    } catch (err) {
      setDeleteError("Erreur lors de la suppression de la commande.");
      console.error(err);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    setConfirmError('');
    setConfirmSuccess('');
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: 'Payé' });
      setConfirmSuccess("Paiement confirmé avec succès !");
      setTimeout(() => {
        setConfirmSuccess('');
      }, 3000);
    } catch (err) {
      setConfirmError("Erreur lors de la confirmation du paiement.");
      console.error(err);
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
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Layout>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Accès refusé. Cette page est réservée aux administrateurs.
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Commandes en cours
        </Typography>
        {deleteSuccess && <Alert severity="success" sx={{ mb: 2 }}>{deleteSuccess}</Alert>}
        {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
        {confirmSuccess && <Alert severity="success" sx={{ mb: 2 }}>{confirmSuccess}</Alert>}
        {confirmError && <Alert severity="error" sx={{ mb: 2 }}>{confirmError}</Alert>}

        {/* Vue pour grands écrans */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main', '& > th': { color: 'white', fontWeight: 'bold' } }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Nom du client</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Adresse de livraison</TableCell>
                  <TableCell>Articles</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.userPhone}</TableCell>
                    <TableCell>{order.shippingAddress}, {order.shippingCity}</TableCell>
                    <TableCell>
                      <ul>
                        {order.items.map(item => (
                          <li key={item.id}>
                            {item.name} ({item.quantity})
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{order.total.toFixed(2)} USD</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {order.status !== 'Payé' && (
                          <Tooltip title="Confirmer le paiement">
                            <IconButton color="primary" onClick={() => handleConfirmPayment(order.id)}>
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Supprimer la commande">
                          <IconButton color="error" onClick={() => handleDeleteOrder(order.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Aucune commande trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Vue pour petits écrans */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {orders.length > 0 ? (
            <Grid container spacing={3}>
              {orders.map((order) => (
                <Grid item xs={12} key={order.id}>
                  <Card elevation={3} sx={{ borderRadius: 2, p: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Commande #{order.id.substring(0, 8)}...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {order.createdAt}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Client: {order.userName}
                      </Typography>
                      <Typography variant="body1">
                        Total: <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{order.total.toFixed(2)} USD</Box>
                      </Typography>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        Statut: {order.status}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Articles:
                      </Typography>
                      <ul>
                        {order.items.map(item => (
                          <li key={item.id}>
                            {item.name} ({item.quantity})
                          </li>
                        ))}
                      </ul>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {order.status !== 'Payé' && (
                          <Tooltip title="Confirmer le paiement">
                            <IconButton color="primary" onClick={() => handleConfirmPayment(order.id)}>
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Supprimer la commande">
                          <IconButton color="error" onClick={() => handleDeleteOrder(order.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary">
              Aucune commande trouvée.
            </Typography>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Orders;
