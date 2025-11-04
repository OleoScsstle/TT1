import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  Stack,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  DoneAllRounded as Check,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  PhotoCamera as CameraIcon,
  CalendarToday as CalendarIcon,
  Wc as WcIcon,
  Home as HomeIcon,
  // Note as NoteIcon, // <-- Ya no se usa
} from '@mui/icons-material';

// --- Importaciones para el Date Picker ---
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// ----------------------------------------------------

import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterPacientPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- Estados para todos los campos del formulario ---
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNac, setFechaNac] = useState(null);
  const [sexo, setSexo] = useState('');
  const [direccion, setDireccion] = useState('');
  // const [historialMedico, setHistorialMedico] = useState(''); // <-- ELIMINADO
  const [imagenPerfil, setImagenPerfil] = useState(null);

  // Estados para errores y carga
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: '', msg: '' });

  // --- Manejador del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage({ type: '', msg: '' });
    setErrors({});

    // --- Validación básica de campos requeridos ---
    let localErrors = {};
    if (!nombre) localErrors.nombre = 'El nombre es requerido.';
    if (!apellido) localErrors.apellido = 'El apellido es requerido.';
    if (!fechaNac) localErrors.fechaNac = 'La fecha de nacimiento es requerida.';
    if (!sexo) localErrors.sexo = 'El sexo es requerido.';

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('fecha_nac', dayjs(fechaNac).format('YYYY-MM-DD'));
    formData.append('sexo', sexo);

    if (correo) formData.append('correo', correo);
    if (telefono) formData.append('telefono', telefono);
    if (direccion) formData.append('direccion', direccion);
    // if (historialMedico) formData.append('historial_medico', historialMedico); // <-- ELIMINADO
    if (imagenPerfil) formData.append('imagen_perfil', imagenPerfil);

    try {
      const response = await axios.post('http://localhost:8000/api/pacientes/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Paciente creado:', response.data);
      setApiMessage({ type: 'success', msg: 'Paciente registrado con éxito. Serás redirigido.' });
      setLoading(false);

      setTimeout(() => {
        navigate('/Main-Loggin');
      }, 2000);

    } catch (error) {
      console.error('Error al registrar paciente:', error.response?.data);
      setApiMessage({ type: 'error', msg: 'Error al registrar al paciente. Revisa los campos.' });
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenPerfil(e.target.files[0]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar
          showingresa={false}
          showRegistrate={false}
          transparentNavbar={false}
          lightLink={false}
          staticNavbar={false}
        />

        <Container maxWidth="lg" sx={{ my: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <PersonIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Registrar Nuevo Paciente
            </Typography>
          </Stack>
          
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Typography variant="h6" color="primary.dark" sx={{ mb: 3 }}>
                Datos Demográficos
              </Typography>
              
              <Grid container spacing={3}>
                
                {/* --- Columna Izquierda --- */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Nombre(s)"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Apellidos"
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      error={!!errors.apellido}
                      helperText={errors.apellido}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>),
                      }}
                    />
                    <DatePicker
                      label="Fecha de Nacimiento *"
                      value={fechaNac}
                      onChange={(newValue) => setFechaNac(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth required error={!!errors.fecha_nac || !!errors.fechaNac} helperText={errors.fecha_nac || errors.fechaNac} InputProps={{
                        startAdornment: (<InputAdornment position="start"><CalendarIcon color="primary" /></InputAdornment>),
                      }} />}
                    />
                     <FormControl fullWidth required error={!!errors.sexo}>
                      <InputLabel id="sexo-label">Sexo</InputLabel>
                      <Select
                        labelId="sexo-label"
                        value={sexo}
                        label="Sexo *"
                        onChange={(e) => setSexo(e.target.value)}
                        startAdornment={<InputAdornment position="start"><WcIcon color="primary" /></InputAdornment>}
                      >
                        <MenuItem value={"M"}>Masculino</MenuItem>
                        <MenuItem value={"F"}>Femenino</MenuItem>
                        <MenuItem value={"O"}>Otro</MenuItem>
                      </Select>
                      {!!errors.sexo && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{errors.sexo}</Typography>}
                    </FormControl>
                  </Stack>
                </Grid>

                {/* --- Columna Derecha --- */}
                <Grid item xs={12} md={6}>
                   <Stack spacing={3}>
                     <TextField
                        fullWidth
                        label="Correo electrónico (Opcional)"
                        placeholder="ejemplo@correo.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        error={!!errors.correo}
                        helperText={errors.correo}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Número telefónico (Opcional)"
                        placeholder="000-000-0000"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment>),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Dirección (Opcional)"
                        placeholder="Calle, Número, Colonia, C.P."
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><HomeIcon color="primary" /></InputAdornment>),
                        }}
                      />
                   </Stack>
                </Grid>
                
                <Grid item xs={12}>
                   <Divider sx={{ my: 3 }} />
                   <Typography variant="h6" color="primary.dark" sx={{ mb: 3 }}>
                    Foto del Paciente
                   </Typography>
                </Grid>

                <Grid item xs={12} md={12}>
                   <Box
                      sx={{
                        border: '2px dashed rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                          borderColor: 'primary.main',
                        },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center' 
                      }}
                    >
                      <CameraIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2, opacity: 0.8,}} />
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Foto de Perfil (Opcional)
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          mt: 1,
                          borderRadius: 8,
                          px: 3,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            bgcolor: 'rgba(255, 20, 147, 0.04)',
                          },
                        }}
                      >
                        {imagenPerfil ? imagenPerfil.name : "Seleccionar una imagen"}
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                      </Button>
                      {!!errors.imagen_perfil && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.imagen_perfil}</Typography>}
                    </Box>
                </Grid>

                {/* --- Mensajes de API y Botón de Envío --- */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                   {apiMessage.msg && (
                    <Alert severity={apiMessage.type} sx={{ mb: 2 }}>
                      {apiMessage.msg}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ px: 5, py: 1.5 }}
                  >
                    {loading ? "Registrando..." : "Registrar Paciente"}
                  </Button>
                </Grid>

              </Grid>
            </Box>
          </Paper>
        </Container>
        <Footer showIncorporaLugar={true} />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default RegisterPacientPage;