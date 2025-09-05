import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Search as SearchIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { db } from '../services/firebase-config';
import ProductDetail from '../pages/ProductDetails';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const { addToCart } = useCart();

  // Fetches categories and products from Firestore
  useEffect(() => {
    // Fetches unique categories
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);
        setCategories(categoriesList);
      } catch (err) {
      }
    };
    fetchCategories();

    // Listens for real-time updates on products
    const productsCollection = collection(db, 'products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      setError("Erreur lors du chargement des produits.");
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (event, product) => {
    event.stopPropagation(); // Prevents the link from being triggered
    event.preventDefault(); // Prevents default link behavior
    addToCart(product);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getFilteredAndGroupedProducts = () => {
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

    const grouped = filteredProducts.reduce((acc, product) => {
      const categoryName = product.category || 'Non catégorisé';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {});

    return grouped;
  };

  const groupedProducts = getFilteredAndGroupedProducts();

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
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Nos Produits
        </Typography>

        {/* Section de recherche et de filtre centrée */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ p: 1, mb: 4, display: 'flex', gap: 2, alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <TextField
              label="Rechercher des produits"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                  width: { xs: '100%', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      border: '1px solid #1976d2'
                  }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel size="small">Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                label="Catégorie"
                onChange={handleCategoryChange}
                size="small"
                sx={{ borderRadius: '8px', border: '1px solid #1976d2' }}
              >
                <MenuItem
                  value=""
                  sx={{ color: selectedCategory === '' ? 'primary.main' : 'inherit' }}
                >
                  <em>Toutes</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{ color: selectedCategory === category ? 'primary.main' : 'inherit' }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Box>

        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map(categoryName => (
            <Box key={categoryName} sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid rgba(0,0,0,0.1)', pb: 1, mb: 3, fontWeight: 'bold' }}>
                {categoryName}
              </Typography>
              <Grid container spacing={3}>
                {groupedProducts[categoryName].map(product => (
                  <Grid item key={product.id} xs={12} sm={6} md={3}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: 2, 
                        transition: 'transform 0.2s, box-shadow 0.2s', 
                        position: 'relative', // Necessary for absolute positioning of overlay
                        overflow: 'hidden', // Hides anything that overflows the Card
                        '&:hover': { 
                          transform: 'translateY(-5px)', 
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          '& .product-overlay': { // Select the overlay on hover
                            opacity: 1,
                          },
                          '& .add-to-cart-button': { // Select the button on hover
                            transform: 'translateY(0)',
                          }
                        } 
                      }}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={product.imageUrl || "https://via.placeholder.com/400x300?text=Image+Produit"}
                            alt={product.name}
                            sx={{ height: 160, objectFit: 'cover' }}
                          />
                          {/* The hover overlay */}
                          <Box 
                            className="product-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              cursor: 'pointer'
                            }}
                          >
                            <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                              Voir détail
                            </Typography>
                          </Box>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                            {product.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              {product.price.toFixed(2)} USD
                            </Typography>
                            {/* Always visible add-to-cart button */}
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={(event) => handleAddToCart(event, product)}
                              sx={{
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '50px',
                                transition: 'transform 0.3s ease',
                              }}
                            >
                              <AddShoppingCartIcon fontSize="small" />
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Aucun produit trouvé.
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default Store;
