import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText, // Nuevo para texto de confirmación
  DialogActions,
  TextField,
  Tooltip,
  Snackbar, // Nuevo para notificaciones
  Alert     // Nuevo para notificaciones
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Warning as WarningIcon // Icono para confirmar borrado
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

dayjs.locale('es');

function AgendaPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS DE DATOS ---
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE FEEDBACK (ALERTAS) ---
  const [mensajeExito, setMensajeExito] = useState(''); // 🟢 Para notificaciones
  
  // --- ESTADOS DE EDICIÓN ---
  const [openEdit, setOpenEdit] = useState(false);
  const [currentCita, setCurrentCita] = useState(null);
  const [editData, setEditData] = useState({ fecha: '', hora: '', motivo: '' });
  const [saving, setSaving] = useState(false);

  // --- ESTADOS DE ELIMINACIÓN ---
  const [openDelete, setOpenDelete] = useState(false); // Controla el diálogo de borrar
  const [citaToDelete, setCitaToDelete] = useState(null); // Guarda ID a borrar

  // --- CARGA INICIAL ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [citasRes, pacientesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/citas/', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/pacientes/', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setCitas(citasRes.data);
      setPacientes(pacientesRes.data);
    } catch (error) {
      console.error("Error cargando agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // --- UTILIDADES ---
  const getNombrePaciente = (id) => {
    const paciente = pacientes.find(p => p.id === id);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente desconocido';
  };

  const getStatusColor = (fecha) => {
    const hoy = dayjs();
    const fechaCita = dayjs(fecha);
    if (fechaCita.isSame(hoy, 'day')) return 'success'; 
    if (fechaCita.isBefore(hoy)) return 'default';      
    return 'primary';                                   
  };

  // --- MANEJO DE ALERTAS ---
  const handleCloseAlert = () => setMensajeExito('');

  // --- LÓGICA DE ELIMINACIÓN ---
  const clickDelete = (id) => {
    setCitaToDelete(id);
    setOpenDelete(true); // Abre diálogo de confirmación
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/citas/${citaToDelete}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Actualizar UI
      setCitas(citas.filter(c => c.id !== citaToDelete));
      setMensajeExito('La cita ha sido eliminada correctamente.'); // 🟢 Feedback
      setOpenDelete(false);
      setCitaToDelete(null);

    } catch (error) {
      console.error("Error eliminando cita:", error);
      // Aquí podrías poner un estado de error si quieres, por ahora console.log
    }
  };

  // --- LÓGICA DE EDICIÓN ---
  const handleEditClick = (cita) => {
    setCurrentCita(cita);
    const fechaObj = dayjs(cita.fecha_hora);
    setEditData({
        fecha: fechaObj.format('YYYY-MM-DD'),
        hora: fechaObj.format('HH:mm'),
        motivo: cita.motivo || ''
    });
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
        const fechaHoraISO = `${editData.fecha}T${editData.hora}:00`;
        
        const response = await axios.patch(
            `http://localhost:8000/api/citas/${currentCita.id}/`,
            { fecha_hora: fechaHoraISO, motivo: editData.motivo },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        // Actualizar lista
        setCitas(citas.map(c => (c.id === currentCita.id ? response.data : c)));
        
        setMensajeExito('Cita actualizada con éxito.'); // 🟢 Feedback
        setOpenEdit(false);

    } catch (error) {
        console.error("Error actualizando cita:", error);
    } finally {
        setSaving(false);
    }
  };

  return (
    <Layout>
      {/* --- SNACKBAR DE ÉXITO (Feedback visual) --- */}
      <Snackbar 
        open={!!mensajeExito} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Abajo a la derecha
      >
        <Alert onClose={handleCloseAlert} severity="success" variant="filled" sx={{ width: '100%' }}>
          {mensajeExito}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ my: 4 }}>
        
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#2c3e50">
              Agenda Médica
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra tus citas programadas
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/generar-cita')}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Nueva Cita
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {citas.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 5, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                  <CalendarIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No tienes citas programadas.
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              citas.map((cita) => (
                <Grid item xs={12} md={6} lg={4} key={cita.id}>
                  <Card elevation={3} sx={{ borderRadius: 2, position: 'relative', overflow: 'visible' }}>
                    <Box sx={{ 
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, 
                        bgcolor: `${getStatusColor(cita.fecha_hora)}.main` 
                    }} />
                    
                    <CardContent sx={{ pl: 3, pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          label={dayjs(cita.fecha_hora).format('DD MMM YYYY').toUpperCase()} 
                          size="small" 
                          color={getStatusColor(cita.fecha_hora)} 
                          variant={dayjs(cita.fecha_hora).isBefore(dayjs()) ? "outlined" : "filled"}
                        />
                        <Box>
                            <Tooltip title="Editar">
                                <IconButton size="small" onClick={() => handleEditClick(cita)} color="primary">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <IconButton size="small" onClick={() => clickDelete(cita.id)} color="error">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
                            <TimeIcon fontSize="small" />
                            <Typography variant="body2" fontWeight="bold">
                                {dayjs(cita.fecha_hora).format('HH:mm')} hrs
                            </Typography>
                      </Box>

                      <Typography variant="h6" fontWeight="bold">
                        {getNombrePaciente(cita.paciente)}
                      </Typography>
                      
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, mt: 0.5 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                           ID: {cita.paciente}
                        </Typography>
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        "{cita.motivo || 'Sin motivo especificado'}"
                      </Typography>

                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* === DIÁLOGO 1: MODIFICAR CITA === */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
            <DialogTitle>Modificar Cita</DialogTitle>
            <DialogContent sx={{ pt: 2, minWidth: 300 }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        label="Fecha"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={editData.fecha}
                        onChange={(e) => setEditData({...editData, fecha: e.target.value})}
                    />
                    <TextField
                        label="Hora"
                        type="time"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={editData.hora}
                        onChange={(e) => setEditData({...editData, hora: e.target.value})}
                    />
                    <TextField
                        label="Motivo"
                        multiline
                        rows={3}
                        fullWidth
                        value={editData.motivo}
                        onChange={(e) => setEditData({...editData, motivo: e.target.value})}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenEdit(false)} color="inherit">Cancelar</Button>
                <Button 
                    onClick={handleSaveEdit} 
                    variant="contained" 
                    color="primary"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20}/> : <SaveIcon />}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>

        {/* === DIÁLOGO 2: CONFIRMAR ELIMINACIÓN (Nuevo) === */}
        <Dialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <WarningIcon /> Confirmar Eliminación
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Estás seguro de que deseas eliminar esta cita de la agenda? Esta acción no se puede deshacer.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDelete(false)} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={confirmDelete} variant="contained" color="error" autoFocus>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>

      </Container>
    </Layout>
  );
}

export default AgendaPage;