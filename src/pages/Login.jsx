import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Layout from '../components/Layout';
import { auth } from '../services/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError("Échec de la connexion. Veuillez vérifier votre email et mot de passe.");
      console.error(err);
    }
  };

  return (
    <Layout>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          p: 3,
        }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            width: '100%', 
            maxWidth: 450, 
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', mb: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Se connecter
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Mot de passe"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              variant="outlined"
              required
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Se connecter
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Pas encore de compte ? <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>Inscrivez-vous ici.</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Login;
