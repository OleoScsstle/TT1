import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box, Container, Paper, Typography, Avatar, IconButton, Divider, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, RadioGroup, FormControlLabel, Radio, Switch,
  CircularProgress, Alert
} from '@mui/material';
import {
  Person as PersonIcon, CalendarToday as CalendarIcon, Wc as GenderIcon,
  Description as DocumentIcon, Edit as EditIcon, Save as SaveIcon, Close as CloseIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';

function PatientProfilePage() {
  const { id } = useParams();
  const { token } = useAuth();

  // --- Estados principales ---
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openConfirmSave, setOpenConfirmSave] = useState(false);
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [sexo, setSexo] = useState('');
  const [status, setStatus] = useState(true);
  

  // --- Diálogos ---
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openSexo, setOpenSexo] = useState(false);
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false);

  const [tempFecha, setTempFecha] = useState('');
  const [tempSexo, setTempSexo] = useState('');
  const [pendingStatus, setPendingStatus] = useState(false);

  // --- Edición de datos ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedPaciente, setEditedPaciente] = useState({});

  // === 1️⃣ Cargar datos del paciente ===
  useEffect(() => {
    if (id && token) {
      const fetchPaciente = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`http://localhost:8000/api/pacientes/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setPaciente(response.data);
          setEditedPaciente(response.data);
          setSexo(response.data.sexo || '');
          setStatus(response.data.estado === 'ACTIVO');
        } catch (err) {
          console.error("Error al cargar paciente:", err.response?.data);
          setError("No se pudieron cargar los datos del paciente. Es posible que no seas el médico encargado.");
        } finally {
          setLoading(false);
        }
      };
      fetchPaciente();
    }
  }, [id, token]);

  // === 2️⃣ Función para actualizar datos (PATCH) ===
  const updatePaciente = async (updates) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/pacientes/${id}/`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setPaciente(response.data);
      setEditedPaciente(response.data);
      setSexo(response.data.sexo);
      setStatus(response.data.estado === 'ACTIVO');
      console.log("✅ Paciente actualizado:", response.data);
      return true;
    } catch (err) {
      console.error("❌ Error al actualizar paciente:", err.response?.data || err.message);
      alert("Error al actualizar los datos del paciente.");
      return false;
    }
  };

  // === 3️⃣ Handlers ===
  const handleSaveFecha = async () => {
    setFechaIngreso(tempFecha);
    setOpenCalendar(false);
    await updatePaciente({ fecha_ingreso: tempFecha });
  };

  const handleSaveSexo = async () => {
    setSexo(tempSexo);
    setOpenSexo(false);
    await updatePaciente({ sexo: tempSexo });
  };

  // === 4️⃣ Cambio de estado (con confirmación visual) ===
  const handleToggleStatus = () => {
    const newStatus = !status;
    setPendingStatus(newStatus);
    setOpenConfirmStatus(true);
  };

  const handleConfirmStatusChange = async () => {
    const newEstado = pendingStatus ? 'ACTIVO' : 'INACTIVO';
    setOpenConfirmStatus(false);
    setStatus(pendingStatus);
    await updatePaciente({ estado: newEstado });
  };

  const handleCancelStatusChange = () => {
    setOpenConfirmStatus(false);
  };
  
  const handleAcceptChanges = () => {
    setIsEditing(false);
    setPaciente(editedPaciente);
  };

  // === 5️⃣ Edición de información personal ===
  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    setEditedPaciente({ ...editedPaciente, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    const success = await updatePaciente(editedPaciente);
    if (success) setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPaciente(paciente);
    setIsEditing(false);
  };

  // === Renderizados condicionales ===
  if (loading) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress color="primary" size={60} />
        </Container>
        <Footer />
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 6 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
        <Footer />
      </ThemeProvider>
    );
  }

  if (!paciente) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 6 }}>
          <Alert severity="warning">No se encontró al paciente.</Alert>
        </Container>
        <Footer />
      </ThemeProvider>
    );
  }

  // === Render principal ===
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Navbar />
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Grid container spacing={4}>
          {/* === IZQUIERDA === */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.98)' }}>
              <Box sx={{ bgcolor: 'primary.main', height: 100 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: -8, mb: 2 }}>
                <Avatar
                  src={paciente.imagen_perfil ? `http://localhost:8000${paciente.imagen_perfil}` : ''}
                  sx={{ width: 120, height: 120, bgcolor: '#d3d3d3', border: '4px solid white' }}
                >
                  {!paciente.imagen_perfil && <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>
              </Box>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                {paciente.nombre} {paciente.apellido}
              </Typography>

              <Box sx={{ px: 4, pb: 4 }}>
                {/* Fecha */}
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Fecha de ingreso</Typography>
                    <Typography variant="body2" color="text.secondary">{fechaIngreso || 'No registrada'}</Typography>
                  </Box>
                  <IconButton size="small" color="primary" onClick={() => { setTempFecha(fechaIngreso); setOpenCalendar(true); }}>
                    <CalendarIcon />
                  </IconButton>
                </Box>

                {/* Sexo */}
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Sexo</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : sexo === 'O' ? 'Otro' : 'No registrado'}
                    </Typography>
                  </Box>
                  <IconButton size="small" color="primary" onClick={() => { setTempSexo(sexo); setOpenSexo(true); }}>
                    <GenderIcon />
                  </IconButton>
                </Box>

                {/* Estado */}
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Status</Typography>
                    <Typography variant="body2" color="text.secondary">{status ? 'Activo' : 'Inactivo'}</Typography>
                  </Box>
                  <Switch checked={status} onChange={handleToggleStatus} color="primary" />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* === DERECHA === */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2, position: 'relative' }}>
                <IconButton
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                  size="small"
                  color={isEditing ? "error" : "primary"}
                  onClick={isEditing ? handleCancelEdit : handleEditToggle}
                >
                  {isEditing ? <CloseIcon /> : <EditIcon />}
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Información personal</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {isEditing ? (
                    <>
                      <TextField label="Email" name="correo" value={editedPaciente.correo || ''} onChange={handleInputChange} fullWidth />
                      <TextField label="Nombre" name="nombre" value={editedPaciente.nombre || ''} onChange={handleInputChange} fullWidth />
                      <TextField label="Apellido" name="apellido" value={editedPaciente.apellido || ''} onChange={handleInputChange} fullWidth />
                      <TextField label="Teléfono" name="telefono" value={editedPaciente.telefono || ''} onChange={handleInputChange} fullWidth />
                      <TextField label="Dirección" name="direccion" value={editedPaciente.direccion || ''} onChange={handleInputChange} fullWidth />

                      <Button 
                      variant="contained"
                       color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => setOpenConfirmSave(true)}
                      >
                        Guardar Cambios
                      </Button>

                    </>
                  ) : (
                    <>
                      <Typography><b>Email:</b> {paciente.correo || 'No especificado'}</Typography>
                      <Typography><b>Nombre:</b> {paciente.nombre} {paciente.apellido}</Typography>
                      <Typography><b>Fecha de nacimiento:</b> {dayjs(paciente.fecha_nac).format('DD [de] MMMM [de] YYYY')}</Typography>
                      <Typography><b>Teléfono:</b> {paciente.telefono || 'No especificado'}</Typography>
                      <Typography><b>Dirección:</b> {paciente.direccion || 'No especificada'}</Typography>
                    </>
                  )}
                </Box>
              </Paper>

              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <DocumentIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Documentos / Análisis</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                  {[...Array(10)].map((_, i) => (
                    <Chip key={i} label="" sx={{ height: 40, bgcolor: '#d3d3d3' }} />
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* === Diálogos === */}
      <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
        <DialogTitle>Seleccionar Fecha de Ingreso</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Fecha de Ingreso"
            type="date"
            fullWidth
            variant="outlined"
            value={tempFecha}
            onChange={(e) => setTempFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalendar(false)}>Cancelar</Button>
          <Button onClick={handleSaveFecha} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSexo} onClose={() => setOpenSexo(false)}>
        <DialogTitle>Seleccionar Sexo</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup value={tempSexo} onChange={(e) => setTempSexo(e.target.value)}>
              <FormControlLabel value="M" control={<Radio color="primary" />} label="Masculino" />
              <FormControlLabel value="F" control={<Radio color="primary" />} label="Femenino" />
              <FormControlLabel value="O" control={<Radio color="primary" />} label="Otro" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSexo(false)}>Cancelar</Button>
          <Button onClick={handleSaveSexo} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmStatus} onClose={handleCancelStatusChange}>
        <DialogTitle>Confirmar cambio de estado</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas cambiar el estado del paciente a{' '}
            <b>{pendingStatus ? 'ACTIVO' : 'INACTIVO'}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelStatusChange}>Cancelar</Button>
          <Button onClick={handleConfirmStatusChange} variant="contained" color="primary">Confirmar</Button>
        </DialogActions>
      </Dialog>
      
      {/* === Diálogo Confirmar Guardado === */}
<Dialog open={openConfirmSave} onClose={() => setOpenConfirmSave(false)}>
  <DialogTitle>Confirmar cambios</DialogTitle>
  <DialogContent>
    <Typography>
      ¿Deseas guardar los cambios realizados en la información del paciente?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirmSave(false)}>Cancelar</Button>
    <Button
      onClick={async () => {
        setOpenConfirmSave(false);
        await handleSaveChanges();
        alert("Perfil de usuario actualizado con éxito.");
      }}
      variant="contained"
      color="primary"
    >
      Confirmar
    </Button>
  </DialogActions>
</Dialog>

      

      <Footer />
    </ThemeProvider>
  );
}

export default PatientProfilePage;
