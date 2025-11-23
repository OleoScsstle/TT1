import React, { useState, useEffect } from 'react';
import { 
  Container, Alert, CircularProgress, Grid, Paper, Box, Typography, Avatar, Divider, Stack, Chip
} from '@mui/material';
import { 
  MedicalServices as MedicalServicesIcon, 
  Groups as GroupsIcon, 
  Assignment as AssignmentIcon 
} from '@mui/icons-material';
import axios from 'axios';

// Componentes
import InformacionPersonal from '../components/perfil/InformacionPersonal';
import Layout from '../components/Layout'; 
import { useAuth } from '../context/AuthContext';

const Perfil = () => {
  const { user, isAuthenticated, token, isLoading } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  
  const [pacientesCount, setPacientesCount] = useState(0);

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
  
  // --- DATOS A PASAR AL FORMULARIO ---
  const correo = user.email || medico.correo || 'Sin correo';
  const cedula = medico.cedula || 'Sin especificar';
  const celular = medico.telefono || '';
  const direccion = medico.direccion || ''; // <--- AGREGADO
  const fechaNacimiento = medico.fecha_nacimiento || null;
  const especialidad = medico.especialidad || 'Médico Especialista';

  const handleActualizarMedico = async (datosActualizados) => {
    try {
      setMensaje('');
      setError('');

      // Pequeños ajustes de formato antes de enviar
      if (datosActualizados.fechaNacimiento) {
          datosActualizados.fecha_nacimiento = datosActualizados.fechaNacimiento;
      }
      if (datosActualizados.celular) {
          datosActualizados.telefono = datosActualizados.celular;
          delete datosActualizados.celular;
      }
      // La dirección ya va dentro de datosActualizados tal cual

      const response = await axios.patch(
        'http://localhost:8000/api/medico/update/', 
        datosActualizados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMensaje('Datos actualizados correctamente.');
        setTimeout(() => setMensaje(''), 5000);
      }
    } catch (err) {
      console.error('Error update:', err);
      setError('No se pudieron actualizar los datos. Verifica tu conexión.');
    }
  };

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
                <Avatar
                  sx={{ 
                    width: 120, height: 120, bgcolor: '#bdbdbd', fontSize: 50,
                    border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                  src={medico.imagen_perfil ? `http://localhost:8000${medico.imagen_perfil}` : ''}
                >
                  {inicial}
                </Avatar>
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
            {/* Aquí pasamos la prop 'direccion' */}
            <InformacionPersonal
              correoElectronico={correo}
              nombre={medico.nombre || ''}
              apellido={medico.apellido || ''}
              fechaNacimiento={fechaNacimiento}
              celular={celular}
              cedula={cedula}
              direccion={direccion} // <--- NUEVO
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