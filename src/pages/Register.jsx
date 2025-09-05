// src/pages/Register.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import Layout from '../components/Layout';
import { auth, db } from '../services/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; // Importez les fonctions Firestore
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Étape 1 : Sauvegarder le rôle de l'utilisateur dans Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        role: "client"
      });
      navigate('/');
    } catch (err) {
      setError("Échec de l'inscription. L'email est peut-être déjà utilisé ou le mot de passe est trop faible.");
      console.error(err);
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom align="center">
            Inscription
          </Typography>
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <TextField
              fullWidth
              label="Mot de passe"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
            >
              S'inscrire
            </Button>
            <Typography variant="body2" align="center">
              Déjà un compte ? <Link to="/login">Connectez-vous ici.</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Register;