import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Grid2 as Grid, Box, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, Button, Link, IconButton, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- Asegúrate que axios esté importado

// Iconos
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';

// Componentes
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LeftImage from '../components/register/LeftImageR';
import imgRegister from '../img/HomePage/ilustracion-mamografia.avif'; // Asegúrate que la ruta sea correcta

// Estilos
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/RegisterPage.css'; // Asegúrate que la ruta sea correcta

function RegisterPage() {
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState(''); // <-- NUEVO
  const [correo, setCorreo] = useState('');
  const [cedula, setCedula] = useState(''); // <-- NUEVO
  const [especialidad, setEspecialidad] = useState(''); // <-- NUEVO
  const [contraseña, setContraseña] = useState('');
  const [contraseña2, setContraseña2] = useState('');

  // Estados para manejo de errores y validaciones
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // <-- NUEVO para errores de la API
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Estados para visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // --- VALIDACIONES (simplificadas para claridad, puedes hacerlas más robustas) ---
  const validarCampos = () => {
    let tempErrors = {};
    let isValid = true;

    if (!nombre) { tempErrors.nombre = "El nombre es requerido."; isValid = false; }
    if (!apellido) { tempErrors.apellido = "El apellido es requerido."; isValid = false; } // <-- NUEVO
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { tempErrors.correo = "Correo inválido."; isValid = false; }
    if (!cedula) { tempErrors.cedula = "La cédula profesional es requerida."; isValid = false; } // <-- NUEVO
    if (!especialidad) { tempErrors.especialidad = "La especialidad es requerida."; isValid = false; } // <-- NUEVO
    if (!contraseña || contraseña.length < 8) { tempErrors.contraseña = "La contraseña debe tener al menos 8 caracteres."; isValid = false; }
    if (contraseña !== contraseña2) { tempErrors.contraseña2 = "Las contraseñas no coinciden."; isValid = false; }

    setErrors(tempErrors);
    return isValid;
  };

  // --- MANEJADOR DEL SUBMIT ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setApiError(''); // Limpiar errores de API previos

    if (validarCampos()) {
      try {
        // Enviar datos al backend
        const response = await axios.post('http://localhost:8000/api/register/', {
          correo: correo,
          password: contraseña,
          nombre: nombre,
          apellido: apellido, // <-- NUEVO
          cedula: cedula, // <-- NUEVO
          especialidad: especialidad, // <-- NUEVO
          // telefono y direccion son opcionales según el serializer, no los incluimos por ahora
        });

        console.log('Registro exitoso:', response.data);
        // Redirigir a la página de confirmación o login
        navigate('/login'); // O '/login' si prefieres

      } catch (error) {
        console.error("Error en el registro:", error.response?.data);
        // Mostrar errores específicos de la API si están disponibles
        if (error.response && error.response.data) {
           // Intenta mostrar el primer error que venga del backend
           const backendErrors = error.response.data;
           const firstErrorKey = Object.keys(backendErrors)[0];
           const firstErrorMessage = backendErrors[firstErrorKey];
           setApiError(`Error: ${firstErrorKey} - ${Array.isArray(firstErrorMessage) ? firstErrorMessage[0] : firstErrorMessage}`);
        } else {
           setApiError('Error al registrar. Inténtalo de nuevo.');
        }
      }
    } else {
      console.log("Errores de validación en el formulario");
    }
  };

  // --- Handlers para visibilidad de contraseña ---
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleHomeClick = () => navigate('/');

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box className="register-background">
        <Box className="lo_pa-container-tool">
          <Navbar
            showingresa={false}
            showRegistrate={false}
            transparentNavbar={false}
            lightLink={false}
            staticNavbar={false}
          />
          <Container maxWidth="md" disableGutters className='my-5 py-4 d-flex align-items-center justify-content-center'>
            <Grid container sx={{ justifyContent: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              {/* Left Image Section */}
              <Grid size={{ xs: 12, md: 6 }} className='register-left-container'>
                <LeftImage
                  imageUrl={imgRegister}
                  nombreFotografo="" />
              </Grid>

              {/* Form Section */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="register-right-form bg-light">
                  <Box className="mx-3 pb-5 pt-3">
                    <Box className="d-flex justify-content-end">
                      <IconButton aria-label="cerrar" onClick={handleHomeClick}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Box className="mx-4">

                      <Typography variant="h4" className="fw-bold">Regístrate</Typography>
                      <Typography variant="subtitle1">Completa el formulario para continuar</Typography>

                      <form className="register-form" onSubmit={handleFormSubmit}>
                        {/* Campo Nombre */}
                        <Box className="my-3">
                          <TextField
                            label="Nombre(s)"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            fullWidth
                            size="small"
                            required
                            error={formSubmitted && !!errors.nombre}
                            helperText={formSubmitted && errors.nombre}
                          />
                        </Box>

                        {/* Campo Apellido */}
                        <Box className="my-3">
                          <TextField
                            label="Apellido(s)" // <-- NUEVO
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            fullWidth
                            size="small"
                            required
                            error={formSubmitted && !!errors.apellido}
                            helperText={formSubmitted && errors.apellido}
                          />
                        </Box>

                        {/* Campo Correo */}
                        <Box className="my-3">
                          <TextField
                            label="Correo electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            fullWidth
                            size="small"
                            required
                            error={formSubmitted && !!errors.correo}
                            helperText={formSubmitted && errors.correo}
                          />
                        </Box>

                        {/* Campo Cédula */}
                        <Box className="my-3">
                          <TextField
                            label="Cédula Profesional" // <-- NUEVO
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            fullWidth
                            size="small"
                            required
                            error={formSubmitted && !!errors.cedula}
                            helperText={formSubmitted && errors.cedula}
                          />
                        </Box>

                        {/* Campo Especialidad */}
                        <Box className="my-3">
                          <TextField
                            label="Especialidad" // <-- NUEVO
                            value={especialidad}
                            onChange={(e) => setEspecialidad(e.target.value)}
                            fullWidth
                            size="small"
                            required
                            error={formSubmitted && !!errors.especialidad}
                            helperText={formSubmitted && errors.especialidad}
                          />
                        </Box>

                        {/* Campo Contraseña */}
                        <Box className="my-3">
                          <FormControl fullWidth size="small" error={formSubmitted && !!errors.contraseña}>
                            <InputLabel>Contraseña</InputLabel>
                            <OutlinedInput
                              type={showPassword ? 'text' : 'password'}
                              value={contraseña}
                              onChange={(e) => setContraseña(e.target.value)}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Contraseña"
                              required
                            />
                            <FormHelperText>{formSubmitted && errors.contraseña}</FormHelperText>
                          </FormControl>
                        </Box>

                        {/* Campo Confirmar Contraseña */}
                        <Box className="my-3">
                          <FormControl fullWidth size="small" error={formSubmitted && !!errors.contraseña2}>
                            <InputLabel>Confirmar contraseña</InputLabel>
                            <OutlinedInput
                              type={showPassword2 ? 'text' : 'password'}
                              value={contraseña2}
                              onChange={(e) => setContraseña2(e.target.value)}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword} edge="end">
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Confirmar contraseña"
                              required
                            />
                             <FormHelperText>{formSubmitted && errors.contraseña2}</FormHelperText>
                          </FormControl>
                        </Box>

                         {/* Mostrar errores de la API */}
                         {apiError && (
                          <Typography color="error" variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                            {apiError}
                          </Typography>
                        )}

                        {/* Botón de registro */}
                        <Box className="my-4">
                          <Button fullWidth variant="contained" type="submit">
                            Registrarse
                          </Button>
                        </Box>

                        {/* Opciones de login */}
                        <Box className="my-4">
                          <Typography variant="body2" className="text-center">O regístrate con</Typography>
                          <Box className="d-flex justify-content-center gap-3">
                            <IconButton aria-label="google" color='google'>
                              <GoogleIcon />
                            </IconButton>
                            <IconButton aria-label="facebook" color='facebook'>
                              <FacebookRoundedIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Enlaces a los Términos de Servicio y Política de Privacidad */}
                        <div className="mt-4 text-center">
                          <small>
                            Al registrarte, aceptas nuestros
                            <Link href="/terminos-condiciones" underline="hover" sx={{ mx: 0.5 }}>Términos de Servicio</Link> y
                            <Link href="/politica-privacidad" underline="hover" sx={{ ml: 0.5 }}>Política de Privacidad</Link>.
                          </small>
                        </div>
                      </form>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default RegisterPage;