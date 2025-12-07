import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Material UI
import { ThemeProvider } from '@mui/material/styles';
import { 
  Container, Box, Typography, TextField, FormControl, InputLabel, 
  OutlinedInput, InputAdornment, IconButton, Button, Link, FormHelperText,
  Alert, Collapse // <--- Importamos Alert y Collapse para la notificación bonita
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 

// Iconos
import { Visibility, VisibilityOff, Google as GoogleIcon, FacebookRounded as FacebookRoundedIcon, Close as CloseIcon } from '@mui/icons-material';

// Componentes y Estilos
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LeftImage from '../components/login/LeftImage'; 
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/LoginPage.css';

// Imagen
import casaLeon from '../img/HomePage/ilustracion-mamografia.avif'; 

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  
  // Estados UI
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- ESTADO PARA LA ALERTA INTELIGENTE ---
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    severity: 'error', // 'error' (rojo) | 'warning' (amarillo) | 'success' (verde)
    message: ''
  });

  const handleHomeClick = () => navigate('/');

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setAlertInfo({ ...alertInfo, show: false }); // Ocultar alerta previa

    // 1. Validaciones básicas del front
    if (!correo || !contraseña) return; 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        setAlertInfo({ 
            show: true, 
            severity: 'warning', 
            message: 'Por favor, introduce un correo electrónico válido.' 
        });
        return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: correo,
        password: contraseña,
      });

      console.log("Login exitoso");
      
      // Guardar sesión
      login(response.data.access, response.data.refresh);

      // Redirección basada en rol
      if (response.data.is_staff) {
        navigate('/admin/dashboard');
      } else {
        navigate('/main-page');
      }

    } catch (error) {
      console.error("Error en el login:", error);
      
      let msg = "Ocurrió un error inesperado.";
      let sev = "error";

      // --- AQUÍ CAPTURAMOS LA RESPUESTA DEL BACKEND ---
      if (error.response && error.response.status === 401) {
          const detail = error.response.data.detail || "";

          // CASO 1: CUENTA PENDIENTE (Amarillo)
          if (detail.includes("proceso de validación") || detail.includes("pending")) {
              msg = "   Tu cuenta está en revisión. Un administrador debe aprobar tu registro antes de que puedas ingresar.";
              sev = "warning"; 
          }
          // CASO 2: CUENTA RECHAZADA (Rojo)
          else if (detail.includes("rechazada") || detail.includes("rejected")) {
              msg = "⛔ Tu solicitud de registro ha sido rechazada por el administrador.";
              sev = "error";
          }
          // CASO 3: CREDENCIALES MALAS (Rojo)
          else {
              msg = "Correo o contraseña incorrectos. Verifica tus datos.";
              sev = "error";
          }
      } else if (!error.response) {
          msg = "No se pudo conectar con el servidor. Verifica tu internet.";
      }

      setAlertInfo({
        show: true,
        severity: sev,
        message: msg
      });
      
    } finally {
        setLoading(false);
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

                    {/* --- ALERTA BONITA (COLLAPSE) --- */}
                    <Collapse in={alertInfo.show}>
                        <Alert 
                            severity={alertInfo.severity} 
                            sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}
                            onClose={() => setAlertInfo({...alertInfo, show: false})}
                        >
                            {alertInfo.message}
                        </Alert>
                    </Collapse>

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
                          disabled={loading}
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
                            disabled={loading}
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
                      
                      {/* Botón Login */}
                      <Button 
                        variant="contained" 
                        type="submit" 
                        fullWidth 
                        size="large"
                        disabled={loading}
                        sx={{ py: 1.2, mb: 2, fontWeight: 'bold' }}
                      >
                        {loading ? "Verificando..." : "Iniciar sesión"}
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