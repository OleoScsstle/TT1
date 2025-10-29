import React, { useState } from 'react';
import NavBarHome from '../components/NavBar';
import Footer from '../components/Footer';
import '../css/RecuperarContrasena.css';
import axios from 'axios'; // <-- 1. Importa axios

// Material UI y Iconos
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import LockResetIcon from '@mui/icons-material/LockReset';
import ButtonsMod from '../components/ButtonsMod';
import { Container, Card, Box, Typography, CardHeader, CardContent, TextField, Link, CircularProgress, Alert } from '@mui/material'; // <-- Añade CircularProgress y Alert
import { ThemeProvider } from '@mui/material/styles';
import { Stack } from '@mui/system';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false); // Error de validación local
  const [touched, setTouched] = useState(false);

  // <-- 2. Nuevos estados para feedback de API -->
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Mensaje de éxito o error de API
  const [isApiError, setIsApiError] = useState(false); // Para colorear el mensaje

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);
    setMessage(''); // Limpiar mensajes al escribir
    setIsApiError(false);
    if (touched) {
      setError(!validarEmail(nuevoEmail));
    }
  };

  // <-- 3. Modifica handleSend para llamar a la API -->
  const handleSend = async () => {
    setTouched(true);
    setMessage('');
    setIsApiError(false);

    // Validar localmente primero
    const isValid = validarEmail(email);
    setError(!isValid);

    if (isValid) {
      setLoading(true); // Inicia carga
      try {
        // Llama a la API
        const response = await axios.post('http://localhost:8000/api/password-reset/', {
          email: email,
        });

        // Muestra mensaje de éxito (la API siempre responde 200)
        setMessage(response.data.detail || 'Si existe una cuenta asociada, se envió un enlace.');
        setIsApiError(false);
        console.log('Solicitud enviada:', response.data);

      } catch (apiError) {
        // Muestra error genérico si la API falla (ej. 500)
        console.error('Error al solicitar reseteo:', apiError);
        setMessage('Ocurrió un error al procesar la solicitud. Inténtalo más tarde.');
        setIsApiError(true);
      } finally {
        setLoading(false); // Termina carga
      }
    } else {
      console.log('Correo inválido.');
    }
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <NavBarHome
        showingresa={true}
        showRegistrate={true}
        transparentNavbar={false}
        lightLink={false} />

      <Container maxWidth='lg' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '75vh' }}>
        <Card sx={{ padding: '1%', width: '100%', margin: '50px 0 40px 0' }}>
          <Stack sx={{ padding: '16px 0 16px 16px' }}>
            <Typography>
              <Link href='/login' underline="hover">Regresar a inicio de sesión</Link> {/* Usar href o component={RouterLink} to="/login" */}
            </Typography>
          </Stack>

          <CardHeader
            className='rc-header-titulo'
            avatar={
              <LockResetIcon className='rc-header-icono' color='primary' sx={{ fontSize: '2.5rem' }} />
            }
            title='Restablece tu contraseña'
            titleTypographyProps={{
              sx: {
                fontSize: { xs: '1.8rem', sm: '1.8rem', md: '2.5rem' },
                fontWeight: 'bold',
              }
            }}
          />
          <CardContent>
            <Typography sx={{ mb: 2 }}> {/* Añadí margen inferior */}
              Ingresa tu correo electrónico en el campo a continuación y te enviaremos un enlace para restablecer tu contraseña.
            </Typography>

            {/* <-- 4. Muestra mensajes de API aquí --> */}
            {message && (
              <Alert severity={isApiError ? "error" : "success"} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <TextField
              fullWidth
              variant='outlined'
              size='small'
              required
              label='Correo electrónico'
              sx={{ mb: 3 }} // Añadí margen inferior
              value={email}
              onChange={handleEmailChange}
              error={touched && error}
              helperText={touched && error ? 'Por favor, ingresa un correo electrónico válido.' : ''}
              disabled={loading} // Deshabilita mientras carga
            />
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}> {/* Añadí alignItems */}
              {loading && <CircularProgress size={24} sx={{ mr: 2 }} />} {/* Indicador de carga */}
              <ButtonsMod
                variant='principal'
                textCont='Enviar'
                clickEvent={handleSend}
                disabled={loading} // Deshabilita mientras carga
              />
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer showIncorporaLugar={false} />
    </ThemeProvider>
  );
};

export default RecuperarContrasena;