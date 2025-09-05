// src/theme/Theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Un bleu distinctif pour NUNUWA (vous pouvez le changer)
    },
    secondary: {
      main: '#ff4081', // Une couleur d'accent (rose vif par exemple)
    },
    background: {
      default: '#f5f5f5', // Un fond légèrement gris clair pour l'ensemble de l'application
      paper: '#ffffff', // Un fond blanc pour les cartes et papiers
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Police par défaut
    h4: {
      fontWeight: 600, // Pour rendre les titres H4 plus prononcés
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Des boutons légèrement plus arrondis
          textTransform: 'none', // Pas de majuscules automatiques
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Des cartes avec des bords plus arrondis
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Une ombre légère
        },
      },
    },
  },
});

export default theme;