import React, { useState } from 'react';
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
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  PhotoCamera as CameraIcon,
  CalendarToday as CalendarIcon,
  Wc as WcIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function RegisterPacientPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNac, setFechaNac] = useState(null);
  const [sexo, setSexo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);

  // Errores y Carga
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: '', msg: '' });

  // --- MANEJO DE TELÉFONO (Solo números) ---
  const handleTelefonoChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 10) {
      setTelefono(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage({ type: '', msg: '' });
    setErrors({});

    // --- VALIDACIÓN ESTRICTA (Todo requerido menos foto) ---
    let localErrors = {};
    
    if (!nombre.trim()) localErrors.nombre = 'El nombre es requerido.';
    if (!apellido.trim()) localErrors.apellido = 'El apellido es requerido.';
    if (!fechaNac) localErrors.fechaNac = 'La fecha de nacimiento es requerida.';
    if (!sexo) localErrors.sexo = 'El sexo es requerido.';
    
    // Nuevos campos obligatorios
    if (!correo.trim()) {
      localErrors.correo = 'El correo es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      localErrors.correo = 'Formato de correo inválido.';
    }

    if (!telefono.trim()) {
      localErrors.telefono = 'El teléfono es requerido.';
    } else if (telefono.length !== 10) {
      localErrors.telefono = 'Debe tener 10 dígitos.';
    }

    if (!direccion.trim()) localErrors.direccion = 'La dirección es requerida.';

    // Si hay errores, detenemos el envío
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setLoading(false);
      // Hacemos scroll arriba para que vea los errores
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('fecha_nac', dayjs(fechaNac).format('YYYY-MM-DD'));
    formData.append('sexo', sexo);
    formData.append('correo', correo);
    formData.append('telefono', telefono);
    formData.append('direccion', direccion);
    
    if (imagenPerfil) {
      formData.append('imagen_perfil', imagenPerfil);
    }

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
        navigate('/main-page'); // Redirige al Dashboard
      }, 2000);

    } catch (error) {
      console.error('Error al registrar paciente:', error.response?.data);
      setApiMessage({ type: 'error', msg: 'Error al registrar al paciente. Revisa los campos.' });
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenPerfil(e.target.files[0]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout>
        <Container maxWidth="lg" sx={{ my: 4 }}>
          
          {/* Header de la Sección */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2, display: 'flex' }}>
                <PersonIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Registrar Nuevo Paciente
            </Typography>
          </Stack>
          
          <Paper
            elevation={0} // Diseño más limpio (Flat) con borde sutil
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid #e0e0e0'
            }}
          >
            {/* Mensaje de API arriba */}
            {apiMessage.msg && (
              <Alert severity={apiMessage.type} sx={{ mb: 4 }}>{apiMessage.msg}</Alert>
            )}

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
              
              <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
                Información Personal
              </Typography>
              
              <Grid container spacing={4}>
                
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
                        startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>),
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
                        startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>),
                      }}
                    />
                    <DatePicker
                      label="Fecha de Nacimiento *"
                      value={fechaNac}
                      onChange={(newValue) => setFechaNac(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.fecha_nac || !!errors.fechaNac,
                          helperText: errors.fecha_nac || errors.fechaNac,
                          InputProps: {
                            startAdornment: (<InputAdornment position="start"><CalendarIcon color="action" /></InputAdornment>),
                          }
                        }
                      }}
                    />
                     <FormControl fullWidth required error={!!errors.sexo}>
                      <InputLabel id="sexo-label">Sexo</InputLabel>
                      <Select
                        labelId="sexo-label"
                        value={sexo}
                        label="Sexo *"
                        onChange={(e) => setSexo(e.target.value)}
                        startAdornment={<InputAdornment position="start"><WcIcon color="action" /></InputAdornment>}
                      >
                        <MenuItem value={"M"}>Masculino</MenuItem>
                        <MenuItem value={"F"}>Femenino</MenuItem>
                        <MenuItem value={"O"}>Otro</MenuItem>
                      </Select>
                      {!!errors.sexo && <Typography color="error" variant="caption" sx={{ ml: 2, mt: 0.5 }}>{errors.sexo}</Typography>}
                    </FormControl>
                  </Stack>
                </Grid>

                {/* --- Columna Derecha --- */}
                <Grid item xs={12} md={6}>
                   <Stack spacing={3}>
                     <TextField
                        fullWidth
                        required
                        label="Correo electrónico"
                        placeholder="ejemplo@correo.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        error={!!errors.correo}
                        helperText={errors.correo}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>),
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        label="Número telefónico"
                        placeholder="10 dígitos"
                        value={telefono}
                        onChange={handleTelefonoChange} // Usamos el handler numérico
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>),
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        label="Dirección Completa"
                        placeholder="Calle, Número, Colonia, C.P."
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><HomeIcon color="action" /></InputAdornment>),
                        }}
                      />
                   </Stack>
                </Grid>
                
                <Grid item xs={12}>
                   <Divider sx={{ my: 2 }} />
                </Grid>

                {/* --- Área de Foto --- */}
                <Grid item xs={12}>
                   <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                     Fotografía (Opcional)
                   </Typography>
                   <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'primary.light',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        bgcolor: '#fafafa',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#f0f7ff',
                          borderColor: 'primary.main',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center' 
                      }}
                    >
                      <CameraIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1, opacity: 0.8 }} />
                      
                      <Button
                        variant="contained"
                        component="label"
                        disableElevation
                        sx={{ mt: 1, borderRadius: 50, px: 4 }}
                      >
                        {imagenPerfil ? "Cambiar Imagen" : "Subir Foto de Perfil"}
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                      </Button>
                      
                      {imagenPerfil && (
                        <Typography variant="body2" sx={{ mt: 2, color: 'success.main', fontWeight: 'bold' }}>
                          Archivo seleccionado: {imagenPerfil.name}
                        </Typography>
                      )}
                      
                      {!!errors.imagen_perfil && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.imagen_perfil}</Typography>}
                    </Box>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/main-page')}
                    sx={{ mr: 2 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ px: 5, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
                  >
                    {loading ? "Guardando..." : "Registrar Paciente"}
                  </Button>
                </Grid>

              </Grid>
            </Box>
          </Paper>
        </Container>
      </Layout>
    </LocalizationProvider>
  );
}

export default RegisterPacientPage;