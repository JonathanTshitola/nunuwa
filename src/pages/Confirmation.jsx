import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * @file Confirmation.jsx
 * @description Page de confirmation de commande pour un paiement par dépôt manuel.
 * Affiche un message de succès et les instructions pour le paiement par mobile money.
 */
const Confirmation = () => {
  return (
    <Layout>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600 }}>
          <Typography variant="h4" gutterBottom>
            Merci pour votre commande !
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            Pour finaliser votre achat, veuillez faire un dépôt du montant total sur le numéro de mobile money suivant :
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
            +243 XX XX XX XXX
          </Typography>
          <Typography variant="body2" color="text.secondary">
            
            <br />
            Votre commande sera expédiée dès que nous aurons reçu la confirmation de votre paiement.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/" 
            sx={{ mt: 4 }}
          >
            Retourner au magasin
          </Button>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Confirmation;
