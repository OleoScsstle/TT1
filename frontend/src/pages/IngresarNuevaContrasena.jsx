import React, { useState, useEffect } from 'react'; // <-- Añade useEffect
import NavBarHome from '../components/NavBar';
import Footer from '../components/Footer';
import '../css/RecuperarContrasena.css';
import axios from 'axios'; // <-- 1. Importa axios
import { useParams, useNavigate } from 'react-router-dom'; // <-- 2. Importa useParams y useNavigate

// Material UI y Iconos
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import PatternIcon from '@mui/icons-material/Pattern';
import ButtonsMod from '../components/ButtonsMod';
import { InputLabel, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material'; // <-- Añade CircularProgress y Alert
import { Container, Card, Box, Typography, CardHeader, CardContent, FormControl, OutlinedInput, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const IngresarNuevaContrasena = () => {
  // <-- 3. Obtiene uidb64 y token de la URL -->
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  // Estados del formulario
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false); // Cambiado a false por defecto
  const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState(false);

  // Estados para errores y feedback
  const [errores, setErrores] = useState({ contraseña: '', confirmarContraseña: '' });
  const [isTouched, setIsTouched] = useState({ contraseña: false, confirmarContraseña: false }); // Separado
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isApiError, setIsApiError] = useState(false);

  // <-- 4. Validar token y uidb64 al cargar (opcional pero bueno) -->
  useEffect(() => {
    if (!uidb64 || !token) {
      setMessage('Enlace inválido o incompleto.');
      setIsApiError(true);
      // Podrías redirigir al login o a la página de solicitar reseteo
      // setTimeout(() => navigate('/login'), 3000);
    }
  }, [uidb64, token, navigate]);


  // Validación de fortaleza (simplificada, puedes usar la de Django si quieres más robustez)
  const validarFortaleza = (pwd) => {
    if (!pwd) return 'Este campo no debe estar vacío.';
    if (pwd.length < 8) return 'Debe tener al menos 8 caracteres.';
    // Añade más reglas si es necesario (mayúscula, número, etc.)
    // if (!/[A-Z]/.test(pwd)) return 'Debe contener al menos una mayúscula.';
    // if (!/\d/.test(pwd)) return 'Debe incluir al menos un número.';
    return ''; // Sin error
  };

  // Manejadores de cambio
  const handleContraseñaChange = (e) => {
    const value = e.target.value;
    setContraseña(value);
    setMessage(''); setIsApiError(false); // Limpia mensajes
    setIsTouched(prev => ({ ...prev, contraseña: true }));
    if (isTouched.contraseña) {
      setErrores((prev) => ({ ...prev, contraseña: validarFortaleza(value) }));
    }
    // Revalida la confirmación si la contraseña principal cambia
    if (confirmarContraseña && isTouched.confirmarContraseña) {
       setErrores((prev) => ({ ...prev, confirmarContraseña: value !== confirmarContraseña ? 'Las contraseñas no coinciden.' : '' }));
    }
  };

  const handleConfirmarContraseñaChange = (e) => {
    const value = e.target.value;
    setConfirmarContraseña(value);
     setMessage(''); setIsApiError(false); // Limpia mensajes
    setIsTouched(prev => ({ ...prev, confirmarContraseña: true }));
    if (isTouched.confirmarContraseña) {
      setErrores((prev) => ({ ...prev, confirmarContraseña: value !== contraseña ? 'Las contraseñas no coinciden.' : '' }));
    }
  };

  // <-- 5. Modifica handleSubmit para llamar a la API -->
  const handleSubmit = async () => {
    // Marca todos como tocados para mostrar errores
    setIsTouched({ contraseña: true, confirmarContraseña: true });
    setMessage(''); setIsApiError(false);

    // Realiza validaciones locales
    const errPwd = validarFortaleza(contraseña);
    const errConfirm = (!confirmarContraseña) ? 'Este campo no debe estar vacío.' : (contraseña !== confirmarContraseña ? 'Las contraseñas no coinciden.' : '');
    setErrores({ contraseña: errPwd, confirmarContraseña: errConfirm });

    // Si no hay errores locales Y tenemos token/uidb64
    if (!errPwd && !errConfirm && uidb64 && token) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/api/password-reset/confirm/', {
          uidb64: uidb64,
          token: token,
          new_password: contraseña,
          confirm_password: confirmarContraseña, // El serializer lo valida de nuevo
        });

        setMessage(response.data.detail || 'Contraseña actualizada con éxito. Serás redirigido al login.');
        setIsApiError(false);
        console.log('Contraseña actualizada:', response.data);
        // Redirige al login después de un momento
        setTimeout(() => navigate('/login'), 3000); // Espera 3 segundos

      } catch (apiError) {
        console.error('Error al confirmar reseteo:', apiError.response?.data);
        setMessage(apiError.response?.data?.detail || apiError.response?.data?.new_password?.[0] || apiError.response?.data?.confirm_password?.[0] || 'Error al actualizar la contraseña. El enlace puede ser inválido o haber expirado.');
        setIsApiError(true);
      } finally {
        setLoading(false);
      }
    } else {
        if (!uidb64 || !token) {
             setMessage('Enlace inválido o incompleto.');
             setIsApiError(true);
        }
        console.log('Errores de validación local.');
    }
  };

  // Handlers para visibilidad
  const handleMostrarContraseña = () => setMostrarContraseña((prev) => !prev);
  const handleMostrarConfirmarContraseña = () => setMostrarConfirmarContraseña((prev) => !prev);

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <NavBarHome
        showingresa={false} // Ocultamos botones ya que estamos en un flujo específico
        showRegistrate={false}
        transparentNavbar={false}
        lightLink={false} />

      <Container maxWidth='lg' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '75vh' }}>
        <Card sx={{ padding: '1%', width: '100%', margin: '50px 0 40px 0' }}>
          <CardHeader
            className='rc-header-titulo'
            avatar={
              <PatternIcon className='inc-header-icono' color='primary' sx={{ fontSize: { md: '2.5rem', xs: '1.5rem' } }} />
            }
            title='Ingresa una nueva contraseña'
            titleTypographyProps={{
              sx: {
                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '2.5rem' },
                fontWeight: 'bold',
              }
            }}
          />

          <CardContent>
            <Typography variant='body1' sx={{ marginBottom: '20px' }}> {/* Ajustado margen */}
              La contraseña debe tener al menos 8 caracteres. Se recomienda incluir mayúsculas, minúsculas y números.
            </Typography>

            {/* Mensajes de API */}
            {message && (
              <Alert severity={isApiError ? "error" : "success"} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <FormControl fullWidth size='small' sx={{ mb: 2 }}> {/* Añadido margen inferior */}
              {/* Contraseña */}
              <TextField
                fullWidth
                variant='outlined'
                size='small'
                required
                label='Nueva Contraseña'
                value={contraseña}
                onChange={handleContraseñaChange}
                onBlur={() => setIsTouched(prev => ({ ...prev, contraseña: true }))} // Marca como tocado al salir
                error={isTouched.contraseña && !!errores.contraseña}
                helperText={isTouched.contraseña && errores.contraseña}
                type={mostrarContraseña ? 'text' : 'password'}
                disabled={loading || isApiError} // Deshabilita si carga o hay error fatal de URL
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleMostrarContraseña} edge='end'>
                        {mostrarContraseña ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>

            <FormControl fullWidth size='small' sx={{ mb: 3 }}> {/* Añadido margen inferior */}
              {/* Confirmar contraseña */}
              <TextField
                fullWidth
                variant='outlined'
                size='small'
                required
                label='Confirmar Nueva Contraseña'
                value={confirmarContraseña}
                onChange={handleConfirmarContraseñaChange}
                onBlur={() => setIsTouched(prev => ({ ...prev, confirmarContraseña: true }))} // Marca como tocado
                error={isTouched.confirmarContraseña && !!errores.confirmarContraseña}
                helperText={isTouched.confirmarContraseña && errores.confirmarContraseña}
                type={mostrarConfirmarContraseña ? 'text' : 'password'}
                disabled={loading || isApiError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleMostrarConfirmarContraseña} edge='end'>
                        {mostrarConfirmarContraseña ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
              <ButtonsMod
                variant='principal'
                textCont='Aceptar'
                clickEvent={handleSubmit}
                disabled={loading || (!uidb64 || !token)} // Deshabilita si carga o falta token/uid
              />
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer showIncorporaLugar={false} />
    </ThemeProvider>
  );
};

export default IngresarNuevaContrasena;