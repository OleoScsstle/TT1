import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Avatar, IconButton, Divider, Grid, 
  Button, TextField, Tab, Tabs, Stack, Alert, CircularProgress, Switch, FormControlLabel, Badge, Snackbar
} from '@mui/material';
import {
  Person as PersonIcon, 
  History as HistoryIcon,
  Biotech as BiotechIcon,
  Edit as EditIcon, 
  Save as SaveIcon, 
  Close as CloseIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Wc as WcIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Layout from '../components/Layout';

function PatientProfilePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados de feedback
  const [mensajeExito, setMensajeExito] = useState(''); // <--- NUEVO: Para confirmar cambios
  
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPaciente, setEditedPaciente] = useState({});
  const [status, setStatus] = useState(true);
  
  // Estados para la imagen
  const [newProfileImage, setNewProfileImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);       

  // 1. Cargar Datos
  useEffect(() => {
    if (id && token) {
      const fetchPaciente = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/api/pacientes/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setPaciente(response.data);
          setEditedPaciente(response.data);
          setStatus(response.data.estado === 'ACTIVO');
        } catch (err) {
          console.error("Error:", err);
          setError("No se pudo cargar el expediente del paciente.");
        } finally {
          setLoading(false);
        }
      };
      fetchPaciente();
    }
  }, [id, token]);

  // 2. Manejo de Imagen (Selección)
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // 3. Guardar Cambios
  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      
      formData.append('nombre', editedPaciente.nombre || '');
      formData.append('apellido', editedPaciente.apellido || '');
      formData.append('fecha_nac', editedPaciente.fecha_nac || ''); 
      formData.append('sexo', editedPaciente.sexo || 'O');
      formData.append('telefono', editedPaciente.telefono || '');
      formData.append('correo', editedPaciente.correo || '');
      formData.append('direccion', editedPaciente.direccion || '');
      formData.append('historial_medico', editedPaciente.historial_medico || '');
      formData.append('estado', status ? 'ACTIVO' : 'INACTIVO');

      if (newProfileImage) {
        formData.append('imagen_perfil', newProfileImage);
      }

      const response = await axios.patch(
        `http://localhost:8000/api/pacientes/${id}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setPaciente(response.data);
      setEditedPaciente(response.data);
      setNewProfileImage(null);
      setImagePreview(null);
      setIsEditing(false);
      
      // --- MENSAJE DE CONFIRMACIÓN ---
      setMensajeExito("¡Datos actualizados correctamente!"); // <--- ESTO FALTABA
      
    } catch (err) {
      console.error("Error update:", err.response?.data);
      alert("Error al guardar cambios. Revisa los datos ingresados.");
    }
  };

  // Manejador exclusivo para el Switch
  const handleStatusChange = async (e) => {
    const newStatus = e.target.checked;
    setStatus(newStatus);
    try {
        await axios.patch(`http://localhost:8000/api/pacientes/${id}/`, 
            { estado: newStatus ? 'ACTIVO' : 'INACTIVO' },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setPaciente(prev => ({ ...prev, estado: newStatus ? 'ACTIVO' : 'INACTIVO' }));
        setMensajeExito(`Paciente marcado como ${newStatus ? 'ACTIVO' : 'INACTIVO'}`); // <--- Feedback visual
    } catch (err) {
        setStatus(!newStatus); 
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para cerrar la alerta automática
  const handleCloseAlert = () => setMensajeExito('');

  if (loading) return <Layout><Box sx={{display:'flex', height:'80vh', justifyContent:'center', alignItems:'center'}}><CircularProgress/></Box></Layout>;
  if (error) return <Layout><Container sx={{mt:4}}><Alert severity="error">{error}</Alert></Container></Layout>;
  if (!paciente) return null;

  return (
    <Layout>
      {/* Alerta Flotante de Éxito */}
      <Snackbar 
        open={!!mensajeExito} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {mensajeExito}
        </Alert>
      </Snackbar>

      {/* Fondo Decorativo Rosa */}
      <Box sx={{ 
        height: 160, 
        background: 'linear-gradient(90deg, #E4007C 0%, #ff66a1 100%)',
        mb: -8 
      }} />

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          
          {/* === IZQUIERDA === */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    isEditing ? (
                      <IconButton 
                        component="label"
                        sx={{ 
                          bgcolor: '#E4007C', 
                          color: 'white', 
                          '&:hover': { bgcolor: '#C20069' }, 
                          width: 35, height: 35,
                          boxShadow: 2
                        }}
                      >
                        <PhotoCameraIcon fontSize="small" />
                        <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                      </IconButton>
                    ) : null
                  }
                >
                  <Avatar
                    src={imagePreview || (paciente.imagen_perfil ? `http://localhost:8000${paciente.imagen_perfil}` : '')}
                    sx={{ 
                      width: 120, height: 120, 
                      bgcolor: '#e0e0e0', 
                      border: '4px solid white', 
                      boxShadow: 2,
                      fontSize: 50
                    }}
                  >
                    {!paciente.imagen_perfil && !imagePreview && <PersonIcon fontSize="inherit" />}
                  </Avatar>
                </Badge>
              </Box>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {paciente.nombre} {paciente.apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ID: {paciente.id}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ bgcolor: status ? '#e8f5e9' : '#ffebee', p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" color={status ? "success.main" : "error.main"} fontWeight="bold" gutterBottom>
                    ESTADO DEL EXPEDIENTE
                </Typography>
                
                <FormControlLabel
                    control={
                        <Switch 
                            checked={status} 
                            onChange={handleStatusChange} 
                            color={status ? "success" : "error"}
                        />
                    }
                    label={status ? "Paciente Activo" : "Paciente Inactivo"}
                />
              </Box>

            </Paper>
          </Grid>

          {/* === DERECHA === */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', minHeight: 500 }}>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9f9f9' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                  <Tab label="Datos Personales" icon={<PersonIcon />} iconPosition="start" />
                  <Tab label="Historial Médico" icon={<HistoryIcon />} iconPosition="start" />
                  <Tab label="Análisis" icon={<BiotechIcon />} iconPosition="start" />
                </Tabs>
              </Box>

              {/* PESTAÑA 1: DATOS */}
              <div role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                  <Box sx={{ p: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" fontWeight="bold" color="primary">Ficha de Identificación</Typography>
                      <Button 
                        startIcon={isEditing ? <CloseIcon/> : <EditIcon/>} 
                        onClick={() => {
                            setIsEditing(!isEditing);
                            if (isEditing) { 
                                setNewProfileImage(null);
                                setImagePreview(null);
                                setEditedPaciente(paciente);
                            }
                        }}
                        color={isEditing ? "error" : "primary"}
                        variant="outlined"
                      >
                        {isEditing ? "Cancelar Edición" : "Editar Datos"}
                      </Button>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          label="Nombre(s)" fullWidth size="small"
                          value={isEditing ? editedPaciente.nombre : paciente.nombre}
                          disabled={!isEditing}
                          onChange={(e) => setEditedPaciente({...editedPaciente, nombre: e.target.value})}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          label="Apellidos" fullWidth size="small"
                          value={isEditing ? editedPaciente.apellido : paciente.apellido}
                          disabled={!isEditing}
                          onChange={(e) => setEditedPaciente({...editedPaciente, apellido: e.target.value})}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                         <TextField 
                            label="Fecha de Nacimiento" fullWidth size="small" type="date"
                            value={isEditing ? editedPaciente.fecha_nac : paciente.fecha_nac}
                            disabled={!isEditing}
                            onChange={(e) => setEditedPaciente({...editedPaciente, fecha_nac: e.target.value})}
                            InputLabelProps={{ shrink: true }}
                         />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                            label="Sexo" fullWidth size="small" select={isEditing}
                            value={isEditing ? editedPaciente.sexo : (paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro')}
                            disabled={!isEditing}
                            onChange={(e) => setEditedPaciente({...editedPaciente, sexo: e.target.value})}
                            SelectProps={{ native: true }}
                        >
                            {isEditing && (
                                <>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </>
                            )}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}><Divider textAlign="left"><Typography variant="caption">CONTACTO</Typography></Divider></Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField 
                          label="Teléfono" fullWidth size="small"
                          value={isEditing ? editedPaciente.telefono : (paciente.telefono || 'No registrado')}
                          disabled={!isEditing}
                          onChange={(e) => setEditedPaciente({...editedPaciente, telefono: e.target.value})}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          label="Correo Electrónico" fullWidth size="small"
                          value={isEditing ? editedPaciente.correo : (paciente.correo || 'No registrado')}
                          disabled={!isEditing}
                          onChange={(e) => setEditedPaciente({...editedPaciente, correo: e.target.value})}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField 
                          label="Dirección Completa" fullWidth size="small"
                          value={isEditing ? editedPaciente.direccion : (paciente.direccion || 'No registrada')}
                          disabled={!isEditing}
                          onChange={(e) => setEditedPaciente({...editedPaciente, direccion: e.target.value})}
                        />
                      </Grid>
                    </Grid>

                    {isEditing && (
                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveChanges}>
                          Guardar Cambios
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </div>

              {/* PESTAÑA 2: HISTORIAL */}
              <div role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">Antecedentes Clínicos</Typography>
                    <TextField
                      multiline rows={10} fullWidth
                      placeholder="Escriba aquí..."
                      value={isEditing ? editedPaciente.historial_medico : (paciente.historial_medico || 'Sin antecedentes.')}
                      disabled={!isEditing}
                      onChange={(e) => setEditedPaciente({...editedPaciente, historial_medico: e.target.value})}
                      sx={{ bgcolor: isEditing ? 'white' : '#f5f5f5' }}
                    />
                    <Box sx={{ mt: 2 }}>
                        {!isEditing ? (
                            <Button variant="outlined" startIcon={<EditIcon/>} onClick={() => setIsEditing(true)}>Editar Historial</Button>
                        ) : (
                            <Button variant="contained" startIcon={<SaveIcon/>} onClick={handleSaveChanges}>Guardar Historial</Button>
                        )}
                    </Box>
                  </Box>
                )}
              </div>

              {/* PESTAÑA 3: ANÁLISIS */}
              <div role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png" alt="Expediente" style={{ width: 80, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                        Historial de análisis vacío.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        startIcon={<AddPhotoIcon />} 
                        onClick={() => navigate('/comenzar-analisis')}
                        sx={{ borderRadius: 50, px: 4 }}
                    >
                        Realizar Nuevo Análisis
                    </Button>
                  </Box>
                )}
              </div>

            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Layout>
  );
}

export default PatientProfilePage;