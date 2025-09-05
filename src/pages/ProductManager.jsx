import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Alert, Select, MenuItem, InputLabel, FormControl, CircularProgress, Card, CardContent, CardMedia, IconButton, Menu } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { db } from '../services/firebase-config';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Récupère les produits et les catégories en temps réel
  useEffect(() => {
    // Écoute des catégories
    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesList = snapshot.docs.map(doc => doc.data().name);
      setCategories(categoriesList);
    }, (err) => {
      console.error("Erreur lors de la récupération des catégories:", err);
    });

    // Écoute des produits
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      console.error("Erreur lors de la récupération des produits:", err);
      setError("Erreur lors du chargement des produits.");
      setLoading(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.imageUrl) {
      setError("Tous les champs sont requis.");
      setSubmitLoading(false);
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      createdAt: new Date(),
    };

    try {
      if (editingId) {
        // Mettre à jour un produit existant
        const productDoc = doc(db, 'products', editingId);
        await updateDoc(productDoc, productData);
        setSuccess("Produit mis à jour avec succès !");
      } else {
        // Ajouter un nouveau produit
        const productsCollectionRef = collection(db, "products");
        await addDoc(productsCollectionRef, productData);
        setSuccess("Produit ajouté avec succès !");
      }
      // Réinitialiser le formulaire
      setFormData({ name: '', price: '', description: '', category: '', imageUrl: '' });
      setEditingId(null);
    } catch (err) {
      setError("Erreur lors de la soumission du produit.");
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setError('');
    setSuccess('');
    try {
      await deleteDoc(doc(db, 'products', productId));
      setSuccess("Produit supprimé avec succès !");
    } catch (err) {
      setError("Erreur lors de la suppression du produit.");
      console.error(err);
    }
    handleCloseMenu();
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
    });
    setEditingId(product.id);
    handleCloseMenu();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Gestion des produits
        </Typography>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 600, mx: 'auto', my: 2 }}>
          <Typography variant="h6" gutterBottom align="center">
            {editingId ? "Modifier le produit" : "Ajouter un produit"}
          </Typography>
          <Box component="form" onSubmit={handleAddOrUpdateProduct} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom du produit"
              name="name"
              margin="normal"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Prix"
              name="price"
              margin="normal"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              margin="normal"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Catégorie"
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>-- Sélectionner une catégorie --</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem 
                    key={cat} 
                    value={cat}
                    // Change la couleur du texte si la catégorie est sélectionnée
                    sx={{ color: cat === formData.category ? 'primary.main' : 'inherit' }}
                  >
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="URL de l'image"
              name="imageUrl"
              margin="normal"
              value={formData.imageUrl}
              onChange={handleInputChange}
              sx={{ mt: 2 }}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
              disabled={submitLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {editingId ? "Mettre à jour le produit" : "Ajouter le produit"}
            </Button>
            {editingId && (
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', price: '', description: '', category: '', imageUrl: '' });
                }}
              >
                Annuler
              </Button>
            )}
          </Box>
        </Paper>
        
        <Typography variant="h5" gutterBottom align="center" sx={{ mt: 4 }}>
          Produits existants
        </Typography>
        {products.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            Aucun produit à afficher.
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl || 'https://via.placeholder.com/400x200?text=Pas+d%27image'}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Catégorie: {product.category}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {product.price} USD
                        </Typography>
                      </Box>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(e) => {
                          handleMenuClick(e);
                          setEditingId(product.id);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={isMenuOpen && editingId === product.id}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleEditProduct(product)}>
                          <EditIcon sx={{ mr: 1 }} /> Modifier
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteProduct(product.id)}>
                          <DeleteIcon sx={{ mr: 1 }} /> Supprimer
                        </MenuItem>
                      </Menu>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default ProductManager;