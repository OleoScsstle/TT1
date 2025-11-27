import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField, // Necesario para la fecha y hora
  Card,
  CardContent
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarMonthIcon, // Icono para citas
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon // Icono para hora
} from '@mui/icons-material';

import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // Utilidad para manejar fechas

function GenerarCita() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  
  // Datos de la cita
  const [fechaCita, setFechaCita] = useState(dayjs().format('YYYY-MM-DD')); // Fecha de hoy por defecto
  const [horaCita, setHoraCita] = useState('10:00'); 
  const [motivoCita, setMotivoCita] = useState(''); 
  
  // Estados de carga y respuesta
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [loadingCita, setLoadingCita] = useState(false);
  const [error, setError] = useState('');
  const [resultadoExitoso, setResultadoExitoso] = useState(null);

  // 1. CARGAR LISTA DE PACIENTES
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pacientes/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPacientes(response.data);
      } catch (err) {
        console.error("Error cargando pacientes:", err);
        setError("No se pudieron cargar tus pacientes.");
      } finally {
        setLoadingPacientes(false);
      }
    };

    if (token) fetchPacientes();
  }, [token]);

  // 2. ENVIAR CITA AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- VALIDACIONES ---
    if (!pacienteSeleccionado) {
      setError('Por favor, selecciona un paciente.');
      return;
    }
    if (!fechaCita || !horaCita) {
      setError('Debes especificar la fecha y hora de la cita.');
      return;
    }

    setLoadingCita(true);
    setError('');

    // Prepara el objeto de datos
    const datosCita = {
      paciente: pacienteSeleccionado,
      // Combina fecha y hora si tu backend espera un campo DateTimeField (ISO 8601)
      fecha_hora: `${fechaCita}T${horaCita}:00`, 
      motivo: motivoCita || 'Consulta de seguimiento',
      // Aquí se pueden añadir campos como ubicación, doctor, etc.
    };

    try {
      // ⚠️ NOTA: Asegúrate de que esta ruta exista y espere los campos 'paciente' y 'fecha_hora'
      const response = await axios.post('http://localhost:8000/api/citas/', datosCita, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Cita registrada:", response.data);
      setResultadoExitoso(response.data); // Muestra la pantalla de éxito

    } catch (err) {
      console.error("Error al registrar cita:", err.response?.data || err);
      setError("Ocurrió un error al registrar la cita. Verifica la ruta /api/citas/ y el formato de datos.");
    } finally {
      setLoadingCita(false);
    }
  };

  // --- PANTALLA DE RESULTADO ---
  if (resultadoExitoso) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ my: 6 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#2c3e50">
              ¡Cita Programada!
            </Typography>
            <Typography color="textSecondary" paragraph>
              La cita ha sido registrada exitosamente.
            </Typography>
            
            <Card sx={{ mt: 4, mb: 4, border: '1px solid #eee', boxShadow: 'none', bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                  DETALLES DE LA CITA
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                  Paciente ID: {resultadoExitoso.paciente}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                  Fecha: **{dayjs(resultadoExitoso.fecha_hora).format('DD/MM/YYYY')}**
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                  Hora: **{dayjs(resultadoExitoso.fecha_hora).format('HH:mm')}**
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Motivo: {resultadoExitoso.motivo || 'No especificado'}
                </Typography>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/proximas-citas')}>
                Ir a Agenda
              </Button>
              <Button variant="contained" onClick={() => setResultadoExitoso(null)}>
                Programar Otra Cita
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Layout>
    );
  }

  // --- PANTALLA DEL FORMULARIO ---
  return (
    <Layout>
      <Container maxWidth="md" sx={{ my: 6 }}>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <CalendarMonthIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold" color="#2c3e50">
            Programar Cita Médica
          </Typography>
        </Stack>

        <Paper elevation={3} sx={{ p: 5, borderRadius: 2, bgcolor: 'white' }}>
          {loadingPacientes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              
              {/* 1. Selector de Paciente */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                1. Seleccionar Paciente
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="paciente-select-label">Paciente</InputLabel>
                <Select
                  labelId="paciente-select-label"
                  value={pacienteSeleccionado}
                  label="Paciente"
                  onChange={(e) => setPacienteSeleccionado(e.target.value)}
                  startAdornment={<PersonIcon color="action" sx={{ mr: 1 }} />}
                  error={!!error && !pacienteSeleccionado}
                >
                  {pacientes.length === 0 ? (
                    <MenuItem disabled value="">
                      No tienes pacientes registrados.
                    </MenuItem>
                  ) : (
                    pacientes.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre} {p.apellido} (ID: {p.id})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* 2. Fecha y Hora */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                2. Fecha y Hora
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                  label="Fecha de Cita"
                  type="date"
                  fullWidth
                  value={fechaCita}
                  onChange={(e) => setFechaCita(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!error && !fechaCita}
                  helperText={!!error && !fechaCita ? "Campo obligatorio" : ""}
                />
                <TextField
                  label="Hora de Cita"
                  type="time"
                  fullWidth
                  value={horaCita}
                  onChange={(e) => setHoraCita(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!error && !horaCita}
                  helperText={!!error && !horaCita ? "Campo obligatorio" : ""}
                  inputProps={{ step: 300 }} // 5 minute steps
                />
              </Stack>
              
              {/* 3. Motivo */}
              <TextField
                label="Motivo de la Cita (Opcional)"
                multiline
                rows={3}
                fullWidth
                value={motivoCita}
                onChange={(e) => setMotivoCita(e.target.value)}
                sx={{ mb: 4 }}
              />

              {/* Mensaje de Error */}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              {/* Botón de Acción */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loadingCita || !pacienteSeleccionado || !fechaCita || !horaCita}
                  startIcon={loadingCita ? <CircularProgress size={20} color="inherit" /> : <ScheduleIcon />}
                  sx={{ px: 5, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  {loadingCita ? 'Programando...' : 'Confirmar Cita'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default GenerarCita;