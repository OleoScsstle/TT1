import React, { useState, useEffect } from 'react'; // <-- Importa useEffect
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box, Container, Paper, Typography, Avatar, IconButton, Divider, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, RadioGroup, FormControlLabel, Radio, Switch, 
  CircularProgress, Alert // <-- Importa CircularProgress y Alert
} from '@mui/material';
import {
  Person as PersonIcon, CalendarToday as CalendarIcon, Wc as GenderIcon,
  ToggleOn as StatusIcon, Description as DocumentIcon, Edit as EditIcon,
} from '@mui/icons-material';

// --- Importaciones Clave ---
import { useParams } from 'react-router-dom'; // <-- Para leer el ID de la URL
import { useAuth } from '../context/AuthContext'; // <-- Para el token
import axios from 'axios'; // <-- Para la llamada API
import dayjs from 'dayjs'; // <-- Para formatear fechas

function PatientProfilePage() {
  const { id } = useParams(); // <-- Obtiene el ID del paciente de la URL
  const { token } = useAuth(); // <-- Obtiene el token del médico

  // --- Estados para datos, carga y error ---
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Estados para los campos editables (ahora se llenarán desde la API) ---
  const [fechaIngreso, setFechaIngreso] = useState(''); // (Este campo no está en tu modelo actual)
  const [sexo, setSexo] = useState('');
  const [status, setStatus] = useState(true);

  // Estados para los diálogos (sin cambios)
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openSexo, setOpenSexo] = useState(false);
  const [tempFecha, setTempFecha] = useState('');
  const [tempSexo, setTempSexo] = useState('');
  
  // --- Cargar datos del Paciente al montar ---
  useEffect(() => {
    // Solo busca si tenemos un ID y un token
    if (id && token) {
      const fetchPaciente = async () => {
        setLoading(true);
        setError('');
        try {
          // Hacemos un GET al endpoint específico del paciente
          const response = await axios.get(`http://localhost:8000/api/pacientes/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          setPaciente(response.data); // Guarda el objeto paciente
          
          // Inicializa los estados editables con los datos de la API
          // setFechaIngreso(response.data.fecha_ingreso || ''); // (Añade este campo al modelo si lo necesitas)
          setSexo(response.data.sexo || '');
          setStatus(response.data.estado === 'ACTIVO');

          console.log("Datos del paciente:", response.data);

        } catch (err) {
          console.error("Error al cargar paciente:", err.response?.data);
          setError("No se pudieron cargar los datos del paciente. Es posible que no seas el médico encargado.");
        } finally {
          setLoading(false);
        }
      };

      fetchPaciente();
    }
  }, [id, token]); // Se ejecuta si el 'id' o 'token' cambian

  // Handlers para diálogos (sin cambios, pero ahora usan los datos del estado)
  const handleOpenCalendar = () => { setTempFecha(fechaIngreso); setOpenCalendar(true); };
  const handleSaveFecha = () => { setFechaIngreso(tempFecha); setOpenCalendar(false); /* Aquí iría una llamada API (PATCH) para guardar */ };
  const handleOpenSexo = () => { setTempSexo(sexo); setOpenSexo(true); };
  const handleSaveSexo = () => { setSexo(tempSexo); setOpenSexo(false); /* Aquí iría una llamada API (PATCH) para guardar */ };
  const handleToggleStatus = () => { 
    const newStatus = !status;
    setStatus(newStatus); 
    /* Aquí iría una llamada API (PATCH) para guardar el nuevo estado (newStatus ? 'ACTIVO' : 'INACTIVO') */
    console.log("Cambiando estado a:", newStatus ? 'ACTIVO' : 'INACTIVO');
  };

  // --- Lógica de Renderizado ---

  // Muestra "Cargando..." mientras busca al paciente
  if (loading) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar showingresa={false} showRegistrate={false} transparentNavbar={false} lightLink={false} staticNavbar={false} />
        <Container maxWidth="lg" sx={{ my: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress color="primary" size={60} />
        </Container>
        <Footer showIncorporaLugar={true} />
      </ThemeProvider>
    );
  }

  // Muestra un error si la API falló
  if (error) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar showingresa={false} showRegistrate={false} transparentNavbar={false} lightLink={false} staticNavbar={false} />
        <Container maxWidth="lg" sx={{ my: 6 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
        <Footer showIncorporaLugar={true} />
      </ThemeProvider>
    );
  }

  // Si no está cargando y no hay error, pero no hay paciente
  if (!paciente) {
    return (
       <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar showingresa={false} showRegistrate={false} transparentNavbar={false} lightLink={false} staticNavbar={false} />
        <Container maxWidth="lg" sx={{ my: 6 }}>
          <Alert severity="warning">No se encontró al paciente.</Alert>
        </Container>
        <Footer showIncorporaLugar={true} />
      </ThemeProvider>
    );
  }

  // --- Renderizado principal con datos reales ---
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Navbar
        showingresa={false}
        showRegistrate={false}
        transparentNavbar={false}
        lightLink={false}
        staticNavbar={false}
      />
    
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Grid container spacing={4}>
          {/* Columna Izquierda - Tarjeta del Paciente */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box sx={{ bgcolor: 'primary.main', height: 100, position: 'relative' }} />

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: -8, mb: 2 }}>
                <Avatar
                  // --- Muestra la imagen de perfil real ---
                  src={paciente.imagen_perfil ? `http://localhost:8000${paciente.imagen_perfil}` : ''}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#d3d3d3',
                    border: '4px solid white',
                  }}
                >
                  {/* Si no hay imagen, muestra iniciales */}
                  {!paciente.imagen_perfil && <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>
              </Box>

              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 4, px: 3 }}>
                {/* --- Nombre Real --- */}
                {paciente.nombre} {paciente.apellido}
              </Typography>

              <Box sx={{ px: 4, pb: 4 }}>
                {/* Fecha de Ingreso (Aún no está en el modelo) */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Fecha de ingreso
                      </Typography>
                      {fechaIngreso ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {fechaIngreso}
                        </Typography>
                      ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          No registrada
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="primary" onClick={handleOpenCalendar}>
                      <CalendarIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Sexo (desde la API) */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Sexo
                      </Typography>
                      {sexo ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : 'Otro'}
                        </Typography>
                      ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          No registrado
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="primary" onClick={handleOpenSexo}>
                      <GenderIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Status (desde la API) */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Status
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {status ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Box>
                    <Switch
                      checked={status}
                      onChange={handleToggleStatus}
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Columna Derecha - Información Personal y Documentos */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Tarjeta de Información Personal */}
              <Paper
                elevation={3}
                sx={{ p: 4, borderRadius: 2, background: 'rgba(255, 255, 255, 0.98)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', position: 'relative' }}
              >
                <IconButton sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Información personal
                  </Typography>
                </Box>
                
                {/* --- Campos de Información Reales --- */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      E-mail
                    </Typography>
                    <Typography variant="body1">
                      {paciente.correo || 'No especificado'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1">
                      {paciente.nombre} {paciente.apellido}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Fecha de nacimiento
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(paciente.fecha_nac).format('DD [de] MMMM [de] YYYY')} {/* Formato más amigable */}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Celular
                    </Typography>
                    <Typography variant="body1">
                      {paciente.telefono || 'No especificado'}
                    </Typography>
                  </Box>
                   <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Dirección
                    </Typography>
                    <Typography variant="body1">
                      {paciente.direccion || 'No especificada'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={3}
                sx={{ p: 4, borderRadius: 2, background: 'rgba(255, 255, 255, 0.98)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', position: 'relative' }}
              >
                <IconButton sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <DocumentIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Documentos/Análisis
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                  {[...Array(10)].map((_, index) => (
                    <Chip key={index} label="" sx={{ height: 40, bgcolor: '#d3d3d3', '&:hover': { bgcolor: '#c0c0c0' } }} />
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

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
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalendar(false)}>Cancelar</Button>
          <Button onClick={handleSaveFecha} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSexo} onClose={() => setOpenSexo(false)}>
        <DialogTitle>Seleccionar Sexo</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              value={tempSexo}
              onChange={(e) => setTempSexo(e.target.value)}
            >
              <FormControlLabel value="M" control={<Radio color="primary" />} label="Masculino" />
              <FormControlLabel value="F" control={<Radio color="primary" />} label="Femenino" />
              <FormControlLabel value="O" control={<Radio color="primary" />} label="Otro" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSexo(false)}>Cancelar</Button>
          <Button onClick={handleSaveSexo} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer showIncorporaLugar={true} />
    </ThemeProvider>
  );
}

export default PatientProfilePage;