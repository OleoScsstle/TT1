import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, Button, Link, IconButton, FormHelperText, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Iconos
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';

// Componentes
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LeftImage from '../components/register/LeftImageR';
import imgRegister from '../img/HomePage/ilustracion-mamografia.avif';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();

  // --- ESTADOS DE CAMPOS ---
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [cedula, setCedula] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [contraseña2, setContraseña2] = useState('');

  // --- ESTADOS DE REGLAS Y ENFOQUE ---
  const [showEmailRules, setShowEmailRules] = useState(false); // Mostrar reglas correo
  const [emailRules, setEmailRules] = useState({
    sinEspacios: false,
    arroba: false,
    dominio: false
  });

  const [showPwdRules, setShowPwdRules] = useState(false); // Mostrar reglas password
  const [pwdRules, setPwdRules] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  // Estados generales
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // --- MANEJADORES ---

  // 1. Correo (Validación en tiempo real)
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setCorreo(val);
    setEmailRules({
      sinEspacios: val.length > 0 && !/\s/.test(val),
      arroba: val.includes('@'),
      dominio: /@[^@]+\.[^@]+/.test(val)
    });
  };

  // 2. Contraseña (Validación en tiempo real)
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setContraseña(val);
    setPwdRules({
      length: val.length >= 10,
      upper: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
    });
  };

  // 3. Cédula (Solo números)
  const handleCedulaChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCedula(val);
    }
  };

  // --- VALIDACIÓN FINAL (SUBMIT) ---
  const validarCampos = () => {
    let tempErrors = {};
    let isValid = true;

    if (!nombre) { tempErrors.nombre = "Requerido"; isValid = false; }
    if (!apellido) { tempErrors.apellido = "Requerido"; isValid = false; }
    
    // Validar reglas de correo estrictas
    if (!emailRules.sinEspacios || !emailRules.arroba || !emailRules.dominio) {
        tempErrors.correo = "Formato de correo inválido"; isValid = false;
    }

    // Validar Cédula (7-8 o 10 dígitos)
    if (!cedula) {
        tempErrors.cedula = "Requerido"; isValid = false;
    } else if (!/^(\d{7,8}|\d{10})$/.test(cedula)) {
        tempErrors.cedula = "Debe tener 7, 8 o 10 dígitos."; 
        isValid = false;
    }

    if (!especialidad) { tempErrors.especialidad = "Requerido"; isValid = false; }

    // Validar reglas de contraseña estrictas
    if (!pwdRules.length || !pwdRules.upper || !pwdRules.number || !pwdRules.special) {
        tempErrors.contraseña = "Contraseña insegura";
        isValid = false;
    }

    if (contraseña !== contraseña2) { 
        tempErrors.contraseña2 = "Las contraseñas no coinciden"; isValid = false; 
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setApiError('');

    if (validarCampos()) {
      try {
        await axios.post('http://localhost:8000/api/register/', {
          correo,
          password: contraseña,
          nombre,
          apellido,
          cedula,
          especialidad,
        });
        navigate('/confirmacion-registro');
      } catch (error) {
        console.error("Error registro:", error);
        if (error.response?.data) {
           const backendData = error.response.data;
           const firstKey = Object.keys(backendData)[0];
           const msg = Array.isArray(backendData[firstKey]) ? backendData[firstKey][0] : backendData[firstKey];
           setApiError(`${firstKey}: ${msg}`);
        } else {
           setApiError('Error al conectar con el servidor.');
        }
      }
    }
  };

  // Icono auxiliar para las reglas
  const RuleIcon = ({ met }) => {
    if (met) return <CheckCircleIcon fontSize="small" color="success" sx={{ fontSize: 14 }} />;
    // Si ya se envió el formulario y no cumple, mostramos error, si no, circulo gris
    if (formSubmitted && !met) return <CancelIcon fontSize="small" color="error" sx={{ fontSize: 14 }} />;
    return <CircleIcon fontSize="small" sx={{ color: '#e0e0e0', fontSize: 10 }} />;
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box className="register-background">
        <Box className="lo_pa-container-tool">
          <Navbar showingresa={false} showRegistrate={false} />
          
          <Container maxWidth="md" disableGutters className='my-5 py-4 d-flex align-items-center justify-content-center'>
            <Grid container sx={{ justifyContent: 'center', borderRadius: '6px', overflow: 'hidden', boxShadow: 3 }}>
              
              {/* Lado Izquierdo (Imagen) */}
              <Grid size={{ xs: 0, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                <LeftImage imageUrl={imgRegister} nombreFotografo="" />
              </Grid>

              {/* Lado Derecho (Formulario - Ancho ajustado a 6 columnas) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="register-right-form bg-light" sx={{ p: 4, height: '100%' }}>
                  
                  <Box className="d-flex justify-content-end">
                    <IconButton onClick={() => navigate('/')}><CloseIcon /></IconButton>
                  </Box>

                  <Box sx={{ px: 1 }}>
                    <Typography variant="h4" className="fw-bold" color="primary">Regístrate</Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
                      Completa el formulario para continuar
                    </Typography>

                    <form onSubmit={handleFormSubmit}>
                      
                      {/* NOMBRE Y APELLIDO */}
                      <Box className="my-3">
                        <TextField 
                          label="Nombre(s) *" fullWidth size="small" 
                          value={nombre} onChange={(e) => setNombre(e.target.value)}
                          error={formSubmitted && !!errors.nombre} 
                        />
                      </Box>
                      <Box className="my-3">
                        <TextField 
                          label="Apellido(s) *" fullWidth size="small" 
                          value={apellido} onChange={(e) => setApellido(e.target.value)}
                          error={formSubmitted && !!errors.apellido}
                        />
                      </Box>

                      {/* CORREO (Con reglas ocultas) */}
                      <Box className="my-3">
                        <TextField 
                          label="Correo electrónico *" fullWidth size="small"
                          value={correo} 
                          onChange={handleEmailChange}
                          onFocus={() => setShowEmailRules(true)} // Mostrar al enfocar
                          onBlur={() => setShowEmailRules(false)} // Ocultar al salir (opcional, o dejar fijo si hay error)
                          error={formSubmitted && !!errors.correo}
                        />
                        {/* Lista de reglas correo (Colapsable) */}
                        <Collapse in={showEmailRules || (formSubmitted && !!errors.correo)}> 
                          <Box sx={{ mt: 1, p: 1, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #eee' }}>
                            <List dense disablePadding>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={emailRules.sinEspacios} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: emailRules.sinEspacios ? 'success.main' : 'text.secondary' }} primary="Sin espacios" />
                              </ListItem>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={emailRules.arroba} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: emailRules.arroba ? 'success.main' : 'text.secondary' }} primary="Contiene @" />
                              </ListItem>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={emailRules.dominio} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: emailRules.dominio ? 'success.main' : 'text.secondary' }} primary="Dominio válido (.com, .net, etc)" />
                              </ListItem>
                            </List>
                          </Box>
                        </Collapse>
                      </Box>

                      {/* CÉDULA Y ESPECIALIDAD */}
                      <Box className="my-3">
                        <TextField 
                          label="Cédula Profesional *" fullWidth size="small"
                          placeholder="Solo números"
                          value={cedula} 
                          onChange={handleCedulaChange}
                          error={formSubmitted && !!errors.cedula}
                          helperText={formSubmitted && errors.cedula ? errors.cedula : ""}
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                        />
                      </Box>
                      <Box className="my-3">
                        <TextField 
                          label="Especialidad *" fullWidth size="small" 
                          value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}
                          error={formSubmitted && !!errors.especialidad}
                        />
                      </Box>

                      {/* CONTRASEÑA (Con reglas ocultas) */}
                      <Box className="my-3">
                        <FormControl fullWidth size="small" error={formSubmitted && !!errors.contraseña}>
                          <InputLabel>Contraseña</InputLabel>
                          <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            value={contraseña}
                            onChange={handlePasswordChange}
                            onFocus={() => setShowPwdRules(true)} // Mostrar al enfocar
                            onBlur={() => setShowPwdRules(false)} // Ocultar al salir
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Contraseña"
                          />
                        </FormControl>
                        
                        {/* Lista de reglas contraseña (Colapsable) */}
                        <Collapse in={showPwdRules || (formSubmitted && !!errors.contraseña)}>
                          <Box sx={{ mt: 1, p: 1, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #eee' }}>
                            <List dense disablePadding>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={pwdRules.length} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: pwdRules.length ? 'success.main' : 'text.secondary' }} primary="Mínimo 10 caracteres" />
                              </ListItem>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={pwdRules.upper} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: pwdRules.upper ? 'success.main' : 'text.secondary' }} primary="1 Mayúscula" />
                              </ListItem>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={pwdRules.number} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: pwdRules.number ? 'success.main' : 'text.secondary' }} primary="1 Número" />
                              </ListItem>
                              <ListItem disablePadding sx={{ minHeight: 20 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}><RuleIcon met={pwdRules.special} /></ListItemIcon>
                                <ListItemText primaryTypographyProps={{ variant: 'caption', color: pwdRules.special ? 'success.main' : 'text.secondary' }} primary="1 Carácter especial (@$!%*?&)" />
                              </ListItem>
                            </List>
                          </Box>
                        </Collapse>
                      </Box>

                      <Box className="my-3">
                        <FormControl fullWidth size="small" error={formSubmitted && !!errors.contraseña2}>
                          <InputLabel>Confirmar contraseña</InputLabel>
                          <OutlinedInput
                            type={showPassword2 ? 'text' : 'password'}
                            value={contraseña2}
                            onChange={(e) => setContraseña2(e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Confirmar contraseña"
                          />
                          {formSubmitted && errors.contraseña2 && <FormHelperText>{errors.contraseña2}</FormHelperText>}
                        </FormControl>
                      </Box>

                      {apiError && (
                        <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                          {apiError}
                        </Typography>
                      )}

                      <Button fullWidth variant="contained" type="submit" size="large" sx={{ fontWeight: 'bold', py: 1.2 }}>
                        REGISTRARSE
                      </Button>

                      <div className="mt-3 text-center">
                        <Typography variant="body2">
                          ¿Ya tienes una cuenta? <Link href="/login" underline="hover" fontWeight="bold">Iniciar sesión</Link>
                        </Typography>
                      </div>
                    </form>
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