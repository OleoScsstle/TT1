import React, { useState, useEffect } from 'react';
import { 
  Container, Alert, CircularProgress, Grid, Paper, Box, Typography, Avatar, Divider, Stack, Chip, IconButton, Badge
} from '@mui/material';
import { 
  MedicalServices as MedicalServicesIcon, 
  Groups as GroupsIcon, 
  Assignment as AssignmentIcon,
  PhotoCamera as PhotoCameraIcon // <--- 1. Importamos el icono de cámara
} from '@mui/icons-material';
import axios from 'axios';

import InformacionPersonal from '../components/perfil/InformacionPersonal';
import Layout from '../components/Layout'; 
import { useAuth } from '../context/AuthContext';

const Perfil = () => {
  const { user, isAuthenticated, token, isLoading } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [pacientesCount, setPacientesCount] = useState(0);

  // --- 2. Nuevos estados para la imagen ---
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Efecto para cargar estadísticas (sin cambios)
  useEffect(() => {
    const fetchEstadisticas = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/pacientes/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPacientesCount(response.data.length);
        } catch (err) {
          console.error("Error cargando estadísticas:", err);
        }
      }
    };
    fetchEstadisticas();
  }, [token]);

  // --- 3. Función para manejar la selección de archivo ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSeleccionado(file);
      // Crear una URL temporal para ver la foto antes de subirla
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}><Alert severity="error">No has iniciado sesión.</Alert></Container>
      </Layout>
    );
  }

  if (!user.medico_perfil && !user.is_staff) {
     return (
      <Layout>
        <Container sx={{ mt: 4 }}><Alert severity="warning">Este perfil no tiene datos médicos asociados.</Alert></Container>
      </Layout>
    );
  }

  const medico = user.medico_perfil || {}; 
  const nombreCompleto = medico.nombre 
    ? `${medico.nombre} ${medico.apellido}` 
    : user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
  const inicial = nombreCompleto.charAt(0).toUpperCase();
  
  // Datos para el formulario
  const correo = user.email || medico.correo || 'Sin correo';
  const cedula = medico.cedula || 'Sin especificar';
  const celular = medico.telefono || '';
  const direccion = medico.direccion || '';
  const fechaNacimiento = medico.fecha_nacimiento || null;
  const especialidad = medico.especialidad || 'Médico Especialista';

  // --- 4. Lógica de guardado modificada para usar FormData ---
  const handleActualizarMedico = async (datosActualizados) => {
    try {
      setMensaje('');
      setError('');

      // Creamos un FormData en lugar de un objeto JSON simple
      const formData = new FormData();

      // Agregamos los campos de texto
      if (datosActualizados.nombre) formData.append('nombre', datosActualizados.nombre);
      if (datosActualizados.apellido) formData.append('apellido', datosActualizados.apellido);
      if (datosActualizados.cedula) formData.append('cedula', datosActualizados.cedula);
      if (datosActualizados.direccion) formData.append('direccion', datosActualizados.direccion);
      
      // Manejo de fechas y teléfono
      if (datosActualizados.fechaNacimiento) {
          // Asegúrate de que venga en formato YYYY-MM-DD string, si es objeto Date, formatéalo
          formData.append('fecha_nacimiento', datosActualizados.fechaNacimiento);
      }
      if (datosActualizados.celular) {
          formData.append('telefono', datosActualizados.celular);
      }

      // IMPORTANTE: Agregamos la imagen si el usuario seleccionó una nueva
      if (archivoSeleccionado) {
        formData.append('imagen_perfil', archivoSeleccionado);
      }

      const response = await axios.patch(
        'http://localhost:8000/api/medico/update/', 
        formData, // Enviamos formData
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // <--- CAMBIO CLAVE: multipart
          },
        }
      );

      if (response.status === 200) {
        setMensaje('Datos e imagen actualizados correctamente.');
        // Limpiamos la selección de archivo
        setArchivoSeleccionado(null);
        setTimeout(() => setMensaje(''), 5000);
        // Opcional: Recargar la página o actualizar el contexto del usuario para ver la foto nueva definitiva
        // window.location.reload(); 
      }
    } catch (err) {
      console.error('Error update:', err);
      setError('No se pudieron actualizar los datos. Verifica tu conexión.');
    }
  };

  // Determinar qué imagen mostrar (la nueva previsualizada o la que viene del backend)
  const avatarSrc = previewUrl 
    ? previewUrl 
    : (medico.imagen_perfil ? `http://localhost:8000${medico.imagen_perfil}` : '');

  return (
    <Layout>
      <Box 
        sx={{ 
          height: 180, 
          background: 'linear-gradient(90deg, #E4007C 0%, #ff66a1 100%)',
          mb: -8 
        }} 
      />

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                
                {/* --- 5. UI para subir la foto (Input oculto + Badge con botón) --- */}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload picture" component="span" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' }, boxShadow: 2 }}>
                          <PhotoCameraIcon />
                        </IconButton>
                      </label>
                    </>
                  }
                >
                  <Avatar
                    sx={{ 
                      width: 120, height: 120, bgcolor: '#bdbdbd', fontSize: 50,
                      border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                    src={avatarSrc}
                  >
                    {inicial}
                  </Avatar>
                </Badge>
              </Box>

              <Typography variant="h5" fontWeight="bold" gutterBottom>{nombreCompleto}</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <MedicalServicesIcon fontSize="small" color="primary"/> {especialidad}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Cédula: {cedula}</Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f9f9f9', p: 1.5, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon color="action" /> <Typography variant="body2">Pacientes</Typography>
                  </Box>
                  <Chip label={pacientesCount} size="small" color="primary" variant="outlined"/>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f9f9f9', p: 1.5, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon color="action" /> <Typography variant="body2">Análisis</Typography>
                  </Box>
                  <Chip label="0" size="small" color="secondary" variant="outlined"/> 
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <InformacionPersonal
              correoElectronico={correo}
              nombre={medico.nombre || ''}
              apellido={medico.apellido || ''}
              fechaNacimiento={fechaNacimiento}
              celular={celular}
              cedula={cedula}
              direccion={direccion}
              onSave={handleActualizarMedico}
            />

            <Box sx={{ mt: 2 }}>
              {mensaje && <Alert severity="success" onClose={() => setMensaje('')}>{mensaje}</Alert>}
              {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Layout>
  );
};

export default Perfil;