import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress, Grid } from '@mui/material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '', // Ajout du numéro de téléphone
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfileData({
              name: data.name || '',
              phone: data.phone || '', // Récupération du numéro de téléphone
              address: data.address || '',
              city: data.city || ''
            });
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des données de l'utilisateur:", err);
          setError("Erreur lors du chargement de votre profil.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: profileData.name,
        phone: profileData.phone, // Mise à jour du numéro de téléphone
        address: profileData.address,
        city: profileData.city
      });
      setSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError("Échec de la mise à jour du profil.");
    } finally {
      setIsSaving(false);
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

  return (
    <Layout>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 600, borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
            Mon Profil
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          {/* Affiche les informations en mode lecture */}
          {!isEditing ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Nom: <Typography component="span" variant="body1">{profileData.name || 'Non renseigné'}</Typography>
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Email: <Typography component="span" variant="body1">{user.email || 'Non renseigné'}</Typography>
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Téléphone: <Typography component="span" variant="body1">{profileData.phone || 'Non renseigné'}</Typography>
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Adresse: <Typography component="span" variant="body1">{profileData.address || 'Non renseigné'}</Typography>
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Ville: <Typography component="span" variant="body1">{profileData.city || 'Non renseigné'}</Typography>
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsEditing(true)}
                sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
              >
                Modifier mes informations
              </Button>
            </Box>
          ) : (
            /* Affiche le formulaire en mode édition */
            <Box component="form" onSubmit={handleUpdateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="name"
                    margin="normal"
                    value={profileData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro de téléphone"
                    name="phone"
                    margin="normal"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    name="address"
                    margin="normal"
                    value={profileData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ville"
                    name="city"
                    margin="normal"
                    value={profileData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
                disabled={isSaving}
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => setIsEditing(false)}
                sx={{ mt: 2 }}
              >
                Annuler
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default Profile;