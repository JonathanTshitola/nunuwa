import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Button, Container } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Person as PersonIcon, Menu as MenuIcon, ExitToApp as ExitToAppIcon, Storefront as StorefrontIcon } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logOut } = useAuth();
  const { toggleThemeMode, themeMode } = useThemeMode();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logOut();
    handleMenuClose();
    navigate('/');
  };

  const renderDesktopMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="desktop-profile-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Profil</MenuItem>
      {user && user.role === 'admin' && (
        <MenuItem onClick={() => { navigate('/manager'); handleMenuClose(); }}>Gestion des produits</MenuItem>
      )}
      <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="mobile-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate('/')}>
        <IconButton size="large" color="inherit">
          <StorefrontIcon />
        </IconButton>
        <Typography>Boutique</Typography>
      </MenuItem>
      {user && (
        <MenuItem onClick={() => navigate('/orders')}>
          <IconButton size="large" color="inherit">
            <ExitToAppIcon />
          </IconButton>
          <Typography>Mes commandes</Typography>
        </MenuItem>
      )}
      <MenuItem onClick={() => navigate('/cart')}>
        <IconButton size="large" aria-label={`afficher ${cartItems.length} articles du panier`} color="inherit">
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Typography>Panier</Typography>
      </MenuItem>
      <MenuItem onClick={toggleThemeMode}>
        <IconButton size="large" color="inherit">
          {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Typography>Thème</Typography>
      </MenuItem>
      {user ? (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton size="large" aria-label="compte de l'utilisateur" color="inherit">
            <PersonIcon />
          </IconButton>
          <Typography>Profil</Typography>
        </MenuItem>
      ) : (
        <>
          <MenuItem onClick={() => navigate('/login')}>
            <IconButton size="large" color="inherit">
              <PersonIcon />
            </IconButton>
            <Typography>Connexion</Typography>
          </MenuItem>
          <MenuItem onClick={() => navigate('/register')}>
            <IconButton size="large" color="inherit">
              <ExitToAppIcon />
            </IconButton>
            <Typography>Inscription</Typography>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          top: 0, 
          zIndex: 1100,
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', 
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography 
            variant="h6" 
            noWrap 
            component={Link} 
            to="/" 
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              textDecoration: 'none', 
              color: 'white', 
              fontWeight: 'bold',
              fontStyle: 'italic',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            NUNUWA
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation pour grands écrans */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {user && (
              <Button color="inherit" component={Link} to="/orders">
                Mes commandes
              </Button>
            )}
            {user && user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/manager">
                Gérer les produits
              </Button>
            )}
            <IconButton size="large" aria-label={`afficher ${cartItems.length} articles du panier`} color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {user ? (
              <Button color="inherit" onClick={handleProfileMenuOpen} startIcon={<PersonIcon />}>
                Profil
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Connexion
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Inscription
                </Button>
              </>
            )}
          </Box>
          
          {/* Menu pour petits écrans */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="afficher plus"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderDesktopMenu}

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'grey.800', color: 'white', zIndex: 1100, position: 'sticky', bottom: 0 }}>
        <Container maxWidth="sm">
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} NUNUWA. Jonathan tshitola
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
