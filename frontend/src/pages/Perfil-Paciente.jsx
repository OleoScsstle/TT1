import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, IconButton, Divider, Grid, 
  Button, TextField, Tab, Tabs, Switch, FormControlLabel, Badge, Snackbar, 
  CircularProgress, Alert, Avatar, Checkbox, FormGroup, FormLabel, Radio, RadioGroup, FormControl, Stack
} from '@mui/material';
import {
  Person as PersonIcon, 
  History as HistoryIcon,
  Biotech as BiotechIcon,
  Edit as EditIcon, 
  Save as SaveIcon, 
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  MedicalServices as MedicalIcon,
  FamilyRestroom as FamilyIcon,
  PregnantWoman as PregnantIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Layout from '../components/Layout';

// 🛑 IMPORTACIONES DEL EDITOR
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

// Configuración del Editor (Barra de herramientas simplificada para notas)
const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline'], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
    ],
};

function PatientProfilePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS PRINCIPALES ---
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPaciente, setEditedPaciente] = useState({});
  const [status, setStatus] = useState(true);
  
  // Imagen
  const [newProfileImage, setNewProfileImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);

  // --- ESTADOS DEL FORMULARIO MÉDICO ---
  // Estado inicial para el formulario estructurado
  const initialMedicalForm = {
    ahf_cancer_mama: 'no',
    ahf_otros: '',
    menarca: '',
    menopausia: 'no',
    embarazos: '',
    lactancia: 'no',
    uso_hormonas: 'no',
    diabetes: false,
    hipertension: false,
    biopsias_previas: false,
    tabaquismo: false
  };

  const [medicalForm, setMedicalForm] = useState(initialMedicalForm);
  const [notasAdicionales, setNotasAdicionales] = useState(''); // Para el ReactQuill

  // 1. Cargar Datos
  useEffect(() => {
    if (id && token) {
      const fetchPaciente = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/api/pacientes/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const data = response.data;
          setPaciente(data);
          setEditedPaciente(data);
          setStatus(data.estado === 'ACTIVO');

          // --- LÓGICA DE PARSEO DEL HISTORIAL ---
          // Intentamos leer si historial_medico es un JSON (nuestro formato nuevo)
          // O si es texto plano/HTML (formato viejo o plantilla)
          if (data.historial_medico) {
            try {
                // Intentamos parsear como JSON
                const parsedHistory = JSON.parse(data.historial_medico);
                // Si tiene la estructura esperada, cargamos los estados
                if (parsedHistory.form && parsedHistory.notes !== undefined) {
                    setMedicalForm(parsedHistory.form);
                    setNotasAdicionales(parsedHistory.notes);
                } else {
                    // Es JSON pero no el nuestro, o es texto plano que casualmente parece JSON
                    setNotasAdicionales(data.historial_medico); 
                }
            } catch (e) {
                // Si falla el parseo, es texto plano/HTML antiguo
                setNotasAdicionales(data.historial_medico);
            }
          }

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

  // --- HANDLERS DEL FORMULARIO MÉDICO ---
  const handleMedicalFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicalForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejo de Imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // 3. Guardar Cambios GENERAL
  const handleSaveChanges = async () => {
    const isHistorialTab = tabValue === 1; 

    try {
      const formData = new FormData();
      
      if (!isHistorialTab) {
        // Datos Personales
        formData.append('nombre', editedPaciente.nombre || '');
        formData.append('apellido', editedPaciente.apellido || '');
        formData.append('fecha_nac', editedPaciente.fecha_nac || ''); 
        formData.append('sexo', editedPaciente.sexo || 'O');
        formData.append('telefono', editedPaciente.telefono || '');
        formData.append('correo', editedPaciente.correo || '');
        formData.append('direccion', editedPaciente.direccion || '');
      }
      
      if (isHistorialTab) {
        // --- EMPAQUETADO INTELIGENTE ---
        // Guardamos tanto el formulario como las notas en un objeto JSON stringificado
        const historialCombinado = JSON.stringify({
            form: medicalForm,
            notes: notasAdicionales
        });
        formData.append('historial_medico', historialCombinado); 
      }
      
      formData.append('estado', status ? 'ACTIVO' : 'INACTIVO');

      if (newProfileImage) {
        formData.append('imagen_perfil', newProfileImage);
      }

      const response = await axios.patch(
        `http://localhost:8000/api/pacientes/${id}/`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      
      setPaciente(response.data);
      setEditedPaciente(response.data); // Actualizamos datos visuales
      setNewProfileImage(null);
      setImagePreview(null);
      setIsEditing(false);
      
      setMensajeExito(`¡${isHistorialTab ? "Historial Clínico" : "Datos Personales"} guardados correctamente!`);
      
    } catch (err) {
      console.error("Error update:", err.response?.data);
      alert("Error al guardar. Verifica los datos.");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.checked;
    setStatus(newStatus);
    try {
        await axios.patch(`http://localhost:8000/api/pacientes/${id}/`, 
            { estado: newStatus ? 'ACTIVO' : 'INACTIVO' },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setPaciente(prev => ({ ...prev, estado: newStatus ? 'ACTIVO' : 'INACTIVO' }));
        setMensajeExito(`Paciente ${newStatus ? 'ACTIVADO' : 'DESACTIVADO'}`);
    } catch (err) {
        setStatus(!newStatus); 
    }
  };

  const handleTabChange = (event, newValue) => {
    if (isEditing) {
        // Si cambia de tab sin guardar, recargamos los datos originales visualmente
        setEditedPaciente(paciente);
        setIsEditing(false);
    }
    setTabValue(newValue);
  };

  const handleCloseAlert = () => setMensajeExito('');

  const getImageUrl = (url) => {
    if (!url) return null;
    // Si la URL ya viene completa del backend (http://...), la dejamos así.
    if (url.startsWith('http')) return url;
    // Si viene relativa (/media/...), le pegamos el dominio.
    return `http://localhost:8000${url}`;
  };

  if (loading) return <Layout><Box sx={{display:'flex', height:'80vh', justifyContent:'center', alignItems:'center'}}><CircularProgress/></Box></Layout>;
  if (error) return <Layout><Container sx={{mt:4}}><Alert severity="error">{error}</Alert></Container></Layout>;
  if (!paciente) return null;

  return (
    <Layout>
      <Snackbar 
        open={!!mensajeExito} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>{mensajeExito}</Alert>
      </Snackbar>

      <Box sx={{ height: 160, background: 'linear-gradient(90deg, #E4007C 0%, #ff66a1 100%)', mb: -8 }} />

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          
          {/* IZQUIERDA */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={ isEditing && tabValue === 0 ? (
                      <IconButton component="label" sx={{ bgcolor: '#E4007C', color: 'white', '&:hover': { bgcolor: '#C20069' }, width: 35, height: 35 }}>
                        <PhotoCameraIcon fontSize="small" /><input hidden type="file" accept="image/*" onChange={handleImageChange} />
                      </IconButton>
                    ) : null }
                >
                  <Avatar
                    src={
    imagePreview || 
    (paciente.imagen_perfil ? `${getImageUrl(paciente.imagen_perfil)}?v=${Date.now()}` : '')
}
                    sx={{ width: 120, height: 120, bgcolor: '#e0e0e0', border: '4px solid white', boxShadow: 2, fontSize: 50 }}
                  >
                    {!paciente.imagen_perfil && !imagePreview && <PersonIcon fontSize="inherit" />}
                  </Avatar>
                </Badge>
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>{paciente.nombre} {paciente.apellido}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>ID: {paciente.id}</Typography>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ bgcolor: status ? '#e8f5e9' : '#ffebee', p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" color={status ? "success.main" : "error.main"} fontWeight="bold" gutterBottom>ESTADO DEL EXPEDIENTE</Typography>
                <FormControlLabel control={<Switch checked={status} onChange={handleStatusChange} color={status ? "success" : "error"} />} label={status ? "Paciente Activo" : "Paciente Inactivo"} />
              </Box>
            </Paper>
          </Grid>

          {/* DERECHA */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', minHeight: 500 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9f9f9' }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" textColor="primary" indicatorColor="primary">
                  <Tab label="Datos Personales" icon={<PersonIcon />} iconPosition="start" />
                  <Tab label="Historial Médico" icon={<HistoryIcon />} iconPosition="start" />
                  <Tab label="Análisis" icon={<BiotechIcon />} iconPosition="start" />
                </Tabs>
              </Box>

              {/* --- TAB 0: DATOS PERSONALES --- */}
              <div role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                  <Box sx={{ p: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" fontWeight="bold" color="primary">Ficha de Identificación</Typography>
                      <Button startIcon={isEditing ? <CloseIcon/> : <EditIcon/>} onClick={() => { setIsEditing(!isEditing); if(isEditing) setEditedPaciente(paciente); }} color={isEditing ? "error" : "primary"} variant="outlined">
                        {isEditing ? "Cancelar" : "Editar Datos"}
                      </Button>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}><TextField label="Nombre" fullWidth size="small" value={isEditing ? editedPaciente.nombre : paciente.nombre} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, nombre: e.target.value})} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Apellido" fullWidth size="small" value={isEditing ? editedPaciente.apellido : paciente.apellido} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, apellido: e.target.value})} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Fecha Nacimiento" fullWidth size="small" type="date" value={isEditing ? editedPaciente.fecha_nac : paciente.fecha_nac} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, fecha_nac: e.target.value})} InputLabelProps={{shrink: true}} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Sexo" fullWidth size="small" value={isEditing ? editedPaciente.sexo : paciente.sexo} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, sexo: e.target.value})} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Teléfono" fullWidth size="small" value={isEditing ? editedPaciente.telefono : paciente.telefono || ''} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, telefono: e.target.value})} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Correo" fullWidth size="small" value={isEditing ? editedPaciente.correo : paciente.correo || ''} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, correo: e.target.value})} /></Grid>
                        <Grid item xs={12}><TextField label="Dirección" fullWidth size="small" value={isEditing ? editedPaciente.direccion : paciente.direccion || ''} disabled={!isEditing} onChange={(e) => setEditedPaciente({...editedPaciente, direccion: e.target.value})} /></Grid>
                    </Grid>
                    {isEditing && (
                      <Box sx={{ mt: 4, textAlign: 'right' }}><Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveChanges}>Guardar Datos</Button></Box>
                    )}
                  </Box>
                )}
              </div>

              {/* --- TAB 1: HISTORIAL MÉDICO (FORMULARIO + EDITOR) --- */}
              <div role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                  <Box sx={{ p: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="primary">Antecedentes Clínicos</Typography>
                        {!isEditing ? (
                            <Button variant="outlined" startIcon={<EditIcon/>} onClick={() => setIsEditing(true)}>Editar Historial</Button>
                        ) : (
                            <Box>
                                <Button variant="text" color="inherit" onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>Cancelar</Button>
                                <Button variant="contained" startIcon={<SaveIcon/>} onClick={handleSaveChanges}>Guardar Todo</Button>
                            </Box>
                        )}
                    </Box>

                    {/* === SECCIÓN 1: FORMULARIO ESTRUCTURADO === */}
                    <Box sx={{ mb: 4, opacity: isEditing ? 1 : 0.8, pointerEvents: isEditing ? 'auto' : 'none' }}>
                        
                        {/* AHF */}
                        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fffdfd' }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <FamilyIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle2" fontWeight="bold">Heredofamiliares (AHF)</Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>¿Madre/Hermana con Cáncer de Mama?</FormLabel>
                                    <RadioGroup row name="ahf_cancer_mama" value={medicalForm.ahf_cancer_mama} onChange={handleMedicalFormChange}>
                                        <FormControlLabel value="no" control={<Radio size="small"/>} label="No" />
                                        <FormControlLabel value="si" control={<Radio size="small"/>} label="Sí" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth size="small" label="Otros Cánceres (Familia)" name="ahf_otros" value={medicalForm.ahf_otros} onChange={handleMedicalFormChange} placeholder="Ej: Ovario (Tía)" />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* AGO */}
                        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fefeff' }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <PregnantIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle2" fontWeight="bold">Gineco-Obstétricos (AGO)</Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <TextField fullWidth size="small" type="number" label="Edad Menarca" name="menarca" value={medicalForm.menarca} onChange={handleMedicalFormChange} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField fullWidth size="small" type="number" label="Embarazos" name="embarazos" value={medicalForm.embarazos} onChange={handleMedicalFormChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>¿Lactancia Materna?</FormLabel>
                                    <RadioGroup row name="lactancia" value={medicalForm.lactancia} onChange={handleMedicalFormChange}>
                                        <FormControlLabel value="si" control={<Radio size="small"/>} label="Sí" />
                                        <FormControlLabel value="no" control={<Radio size="small"/>} label="No" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>¿Uso de Hormonas?</FormLabel>
                                    <RadioGroup row name="uso_hormonas" value={medicalForm.uso_hormonas} onChange={handleMedicalFormChange}>
                                        <FormControlLabel value="no" control={<Radio size="small"/>} label="No" />
                                        <FormControlLabel value="si" control={<Radio size="small"/>} label="Sí (AC/TRH)" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>¿Menopausia?</FormLabel>
                                    <RadioGroup row name="menopausia" value={medicalForm.menopausia} onChange={handleMedicalFormChange}>
                                        <FormControlLabel value="no" control={<Radio size="small"/>} label="No" />
                                        <FormControlLabel value="si" control={<Radio size="small"/>} label="Sí" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* APP (Checkboxes) */}
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fdfefe' }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <MedicalIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle2" fontWeight="bold">Personales Patológicos (APP)</Typography>
                            </Stack>
                            <FormGroup row>
                                <FormControlLabel control={<Checkbox size="small" checked={medicalForm.diabetes} onChange={handleMedicalFormChange} name="diabetes" />} label="Diabetes" />
                                <FormControlLabel control={<Checkbox size="small" checked={medicalForm.hipertension} onChange={handleMedicalFormChange} name="hipertension" />} label="Hipertensión" />
                                <FormControlLabel control={<Checkbox size="small" checked={medicalForm.biopsias_previas} onChange={handleMedicalFormChange} name="biopsias_previas" />} label="Biopsias Previas" />
                                <FormControlLabel control={<Checkbox size="small" checked={medicalForm.tabaquismo} onChange={handleMedicalFormChange} name="tabaquismo" />} label="Tabaquismo" />
                            </FormGroup>
                        </Paper>
                    </Box>

                    {/* === SECCIÓN 2: NOTAS ADICIONALES (EDITOR) === */}
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 'bold' }}>
                        Anotaciones Extra / Padecimiento Actual
                    </Typography>
                    
                    <Box sx={{ 
                        '& .ql-container': { borderBottomLeftRadius: 4, borderBottomRightRadius: 4, border: '1px solid #ccc', bgcolor: 'white' },
                        '& .ql-toolbar': { borderTopLeftRadius: 4, borderTopRightRadius: 4, border: '1px solid #ccc', display: isEditing ? 'block' : 'none' }, 
                        mb: 2
                    }}>
                        {isEditing ? (
                            <ReactQuill
                                theme="snow"
                                modules={quillModules}
                                value={notasAdicionales}
                                onChange={setNotasAdicionales}
                                style={{ minHeight: '200px' }}
                                placeholder="Escribe aquí detalles sobre el motivo de consulta, exploración física o notas libres..."
                            />
                        ) : (
                            <Box sx={{ p: 2, minHeight: 100, border: '1px solid #f0f0f0', borderRadius: 1, bgcolor: '#fafafa' }}>
                                {notasAdicionales ? (
                                    <div dangerouslySetInnerHTML={{ __html: notasAdicionales }} />
                                ) : (
                                    <Typography variant="body2" fontStyle="italic" color="text.disabled">Sin notas adicionales registradas.</Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                  </Box>
                )}
              </div>

              {/* --- TAB 2: ANÁLISIS --- */}
              <div role="tabpanel" hidden={tabValue !== 2}>
                 {tabValue === 2 && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                             Historial de análisis vacío.
                         </Typography>
                        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/comenzar-analisis')}>
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