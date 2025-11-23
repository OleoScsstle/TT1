import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // <-- Importante para navegación sin recarga
import axios from 'axios';

// Material UI y Iconos
import { 
  Container, 
  Card, 
  Box, 
  Typography, 
  CardHeader, 
  CardContent, 
  TextField, 
  Link, 
  CircularProgress, 
  Alert, 
  Stack 
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import LockResetIcon from '@mui/icons-material/LockReset';

// Componentes
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ButtonsMod from '../components/ButtonsMod';
import ThemeMaterialUI from '../components/ThemeMaterialUI';

// Si el CSS tiene estilos globales necesarios, déjalo. Si no, puedes quitarlo.
import '../css/RecuperarContrasena.css'; 

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);

  // Estados de API
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isApiError, setIsApiError] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);
    setMessage('');
    setIsApiError(false);
    if (touched) {
      setError(!validarEmail(nuevoEmail));
    }
  };

  const handleSend = async () => {
    setTouched(true);
    setMessage('');
    setIsApiError(false);

    const isValid = validarEmail(email);
    setError(!isValid);

    if (isValid) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/api/password-reset/', {
          email: email,
        });

        setMessage(response.data.detail || 'Si existe una cuenta asociada, se envió un enlace.');
        setIsApiError(false);
        console.log('Solicitud enviada:', response.data);

      } catch (apiError) {
        console.error('Error al solicitar reseteo:', apiError);
        setMessage('Ocurrió un error al procesar la solicitud. Inténtalo más tarde.');
        setIsApiError(true);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Correo inválido.');
    }
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        
        <Navbar
          showingresa={true}
          showRegistrate={true}
          transparentNavbar={false}
          lightLink={false} 
        />

        <Container maxWidth='sm' sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <Card elevation={3} sx={{ width: '100%', borderRadius: 2, p: 2 }}>
            
            {/* Enlace de regreso (Corregido para no recargar página) */}
            <Box sx={{ mb: 2 }}>
              <Link component={RouterLink} to='/login' underline="hover" sx={{ fontSize: '0.9rem' }}>
                &larr; Regresar a inicio de sesión
              </Link>
            </Box>

            <CardHeader
              sx={{ textAlign: 'center', pb: 0 }}
              avatar={
                <LockResetIcon color='primary' sx={{ fontSize: 50 }} />
              }
              titleTypographyProps={{ variant: 'h4', fontWeight: 'bold', color: 'primary.main' }}
              title='Restablecer contraseña'
              subheader="Ingresa tu correo y te enviaremos un enlace"
            />

            <CardContent>
              {/* Mensajes de API */}
              {message && (
                <Alert severity={isApiError ? "error" : "success"} sx={{ mb: 3 }}>
                  {message}
                </Alert>
              )}

              <Box component="form" noValidate>
                <TextField
                  fullWidth
                  variant='outlined'
                  size='small' // Coherente con Login/Registro
                  required
                  label='Correo electrónico'
                  placeholder="ejemplo@correo.com"
                  sx={{ mb: 3 }}
                  value={email}
                  onChange={handleEmailChange}
                  error={touched && error}
                  helperText={touched && error ? 'Ingresa un correo válido' : ''}
                  disabled={loading}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
                  
                  <ButtonsMod
                    variant='principal'
                    textCont='Enviar Enlace'
                    width='100%' // Botón ancho para mejor UX móvil
                    height='2.5rem'
                    clickEvent={handleSend}
                    disabled={loading}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>

        <Footer showIncorporaLugar={false} />
      </Box>
    </ThemeProvider>
  );
};

export default RecuperarContrasena;