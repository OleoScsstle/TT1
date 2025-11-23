import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Material UI
import { ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button, Link, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Asegúrate de usar Grid2 si es la versión nueva, o Grid normal

// Iconos
import { Visibility, VisibilityOff, Google as GoogleIcon, FacebookRounded as FacebookRoundedIcon, Close as CloseIcon } from '@mui/icons-material';

// Componentes y Estilos
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LeftImage from '../components/login/LeftImage'; // Asegúrate de que LeftImage acepte children o props
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/LoginPage.css';

// Imagen
import casaLeon from '../img/HomePage/ilustracion-mamografia.avif'; // Reutilizamos la imagen de tema médico

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  
  // Estados de error y carga
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleHomeClick = () => navigate('/');

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setErrorLogin('');

    // 1. Validaciones básicas
    if (!correo || !contraseña) {
      return; 
    }

    // Validación simple de formato de correo (solo para no enviar basura)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        setErrorLogin('Por favor, introduce un correo electrónico válido.');
        return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: correo,
        password: contraseña,
      });

      console.log("Login exitoso");
      login(response.data.access, response.data.refresh);

      // Redirección basada en rol
      if (response.data.is_staff) {
        navigate('/admin/dashboard');
      } else {
        navigate('/main-page');
      }

    } catch (error) {
      console.error("Error en el login:", error);
      setErrorLogin('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box className='login-background'>
        <Box className='lo_pa-container-tool'>
          <Navbar showingresa={false} showRegistrate={false} />
          
          <Container maxWidth='md' disableGutters className='my-5 py-4 d-flex align-items-center justify-content-center'>
            <Grid container sx={{ justifyContent: 'center', borderRadius: '6px', overflow: 'hidden', boxShadow: 3 }}>
              
              {/* Lado Izquierdo (Imagen) */}
              <Grid size={{ xs: 0, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }} className='login-left-container'>
                <LeftImage imageUrl={casaLeon} nombreFotografo='' />
              </Grid>

              {/* Lado Derecho (Formulario) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className='login-right-form bg-light' sx={{ height: '100%', p: 4 }}>
                  
                  <Box className='d-flex justify-content-end'>
                    <IconButton aria-label="cerrar" onClick={handleHomeClick}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ px: 2 }}>
                    <Typography variant='h4' className='fw-bold' color="primary">Iniciar sesión</Typography>
                    <Typography variant='subtitle1' color="textSecondary" sx={{ mb: 3 }}>
                      Ingresa tus datos para continuar
                    </Typography>

                    <form onSubmit={handleLogin}>
                      {/* Correo */}
                      <Box className='my-4'>
                        <TextField
                          label="Correo electrónico"
                          placeholder='correo@ejemplo.com'
                          size="small"
                          type='email'
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          fullWidth
                          error={formSubmitted && !correo}
                          helperText={formSubmitted && !correo ? "El correo es requerido" : ""}
                        />
                      </Box>

                      {/* Contraseña */}
                      <Box className='my-4'>
                        <FormControl variant="outlined" size="small" fullWidth error={formSubmitted && !contraseña}>
                          <InputLabel>Contraseña</InputLabel>
                          <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Contraseña"
                          />
                          {formSubmitted && !contraseña && (
                            <FormHelperText>La contraseña es requerida</FormHelperText>
                          )}
                        </FormControl>
                      </Box>

                      {/* Mensaje de Error General */}
                      {errorLogin && (
                        <Typography color="error" variant="body2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
                          {errorLogin}
                        </Typography>
                      )}
                      
                      {/* Botón Login (Full Width para consistencia) */}
                      <Button 
                        variant="contained" 
                        type="submit" 
                        fullWidth 
                        size="large"
                        sx={{ py: 1.2, mb: 2, fontWeight: 'bold' }}
                      >
                        Iniciar sesión
                      </Button>

                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Link href="/recuperar-contrasena" underline="hover" variant="body2">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </Box>

                      {/* Separador Social */}
                      <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                        <Box sx={{ flex: 1, height: '1px', bgcolor: '#ddd' }} />
                        <Typography variant="caption" sx={{ mx: 2, color: '#888' }}>O inicia con</Typography>
                        <Box sx={{ flex: 1, height: '1px', bgcolor: '#ddd' }} />
                      </Box>

                      <Box className='d-flex justify-content-center gap-2'>
                        <IconButton aria-label="google" sx={{ color: '#DB4437' }}>
                          <GoogleIcon />
                        </IconButton>
                        <IconButton aria-label="facebook" sx={{ color: '#4267B2' }}>
                          <FacebookRoundedIcon />
                        </IconButton>
                      </Box>
                    </form>

                    <Box className='mt-4 text-center'>
                      <Typography variant='body2'>
                        ¿No tienes una cuenta? <Link href="/register" underline="hover" fontWeight="bold">Regístrate aquí</Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

            </Grid>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default LoginPage;