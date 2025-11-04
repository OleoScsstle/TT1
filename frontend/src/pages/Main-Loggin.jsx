import React, { useState, useEffect } from "react"; // <-- IMPORTANTE: Añadir useEffect
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "../css/ItinerariesSavedPage.css";
import ThemeMaterialUI from "../components/ThemeMaterialUI";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import AutomationIcon from "@mui/icons-material/PlayArrow";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Stack,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  CircularProgress, // <-- AÑADIDO: Para indicador de carga
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import axios from 'axios'; // <-- AÑADIDO: Para llamadas API

// Opciones del sidebar (sin cambios)
const opcionesMenu = [
  { id: 'inicio', icon: <HomeIcon />, label: "Inicio" },
  { id: 'crear', icon: <AddIcon />, label: "Agregar Nuevo" },
  { id: 'informacion', icon: <InfoIcon />, label: "Información" },
];

// Datos de ejemplo (los dejamos para 'renderCatalogo' y 'renderVisualizacion')
const pacientesEjemplo = [
  { id: 1, nombre: "Aguilar Pedraza David", edad: 45, ultimaVisita: "2024-01-15" },
  { id: 2, nombre: "Martinez Perez Ricardo", edad: 32, ultimaVisita: "2024-01-10" },
  { id: 3, nombre: "Valverde Hernandez Ivan", edad: 28, ultimaVisita: "2024-01-08" },
  { id: 4, nombre: "Sanchez Moreno Samantha", edad: 35, ultimaVisita: "2024-01-05" },
];
const citasMedicas = [
  { id: 1, paciente: "Juan Pérez", fecha: "2024-01-25", hora: "10:00", tipo: "Consulta general" },
  { id: 2, paciente: "María García", fecha: "2024-01-25", hora: "11:30", tipo: "Seguimiento" },
  { id: 3, paciente: "Carlos López", fecha: "2024-01-26", hora: "09:00", tipo: "Especialista" },
];

function MedicalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const { user, token } = useAuth(); // <-- Obtenemos el token
  const navigate = useNavigate();

  // --- AÑADIDO: Estados para pacientes reales ---
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [errorPacientes, setErrorPacientes] = useState('');
  // ------------------------------------------

  // --- AÑADIDO: Cargar pacientes cuando se selecciona "Inicio" ---
  useEffect(() => {
    if (seccionActiva === 'inicio' && token) {
      const fetchPacientes = async () => {
        setLoadingPacientes(true);
        setErrorPacientes('');
        try {
          const response = await axios.get('http://localhost:8000/api/pacientes/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setPacientes(response.data);
        } catch (error) {
          console.error("Error al cargar pacientes:", error.response?.data);
          setErrorPacientes("No se pudieron cargar los pacientes.");
        } finally {
          setLoadingPacientes(false);
        }
      };
      fetchPacientes();
    }
  }, [seccionActiva, token]); // Se ejecuta si cambia la sección o el token

  // --- CORREGIDO: Ruta para agregar paciente ---
  const handleAgregarPaciente = () => {
    navigate('/Comenzar-Analisis'); // Esta es la ruta correcta
  };

  // --- AÑADIDO: Navegar al perfil del paciente ---
  const handleVerPaciente = (pacienteId) => {
    navigate(`/perfil-paciente/${pacienteId}`);
  };

  const nombre = user
    ? (user.medico_perfil 
        ? `${user.medico_perfil.nombre} ${user.medico_perfil.apellido}`.trim() 
        : `${user.first_name} ${user.last_name}`.trim() || user.username)
    : "Usuario";
  
  const renderContenido = () => {
    switch(seccionActiva) {
      case 'inicio':
        return renderInicio(); // <-- Esta función será modificada
      case 'crear':
        return renderCrear();
      case 'catalogo':
        return renderCatalogo(); // Esta usa 'pacientesEjemplo'
      case 'visualizacion':
        return renderVisualizacion(); // Esta usa 'citasMedicas'
      // ... (resto de tus casos)
      case 'informacion':
        return renderInformacion();
      default:
        return renderInicio();
    }
  };

  // --- FUNCIÓN renderInicio() MODIFICADA ---
  const renderInicio = () => (
    <>
      <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', mb: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e1e5e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
            Pacientes recientes
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#7f8c8d' }}><ChevronLeftIcon /></IconButton>
            <IconButton size="small" sx={{ color: '#7f8c8d' }}><ChevronRightIcon /></IconButton>
            <Button size="small" sx={{ textTransform: 'none', fontSize: '12px', color: '#1976d2' }}>Ver todo</Button>
          </Box>
        </Box>
        
        {/* --- Lógica de Carga / Error / Lista / Vacío --- */}
        {loadingPacientes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : errorPacientes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, flexDirection: 'column', alignItems: 'center' }}>
            <Typography color="error">{errorPacientes}</Typography>
            <Typography variant="body2" color="text.secondary">Asegúrate de estar logueado.</Typography>
          </Box>
        ) : pacientes.length === 0 ? (
          // Si no hay pacientes, muestra el mensaje original
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, flexDirection: 'column' }}>
            <Box sx={{ width: 80, height: 80, border: '2px solid #e1e5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <SearchIcon sx={{ fontSize: '32px', color: '#bdc3c7' }} />
            </Box>
            <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50', mb: 1 }}>
              No hay contenido disponible todavía.
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
              Los pacientes registrados a los que tiene acceso se mostrarán aquí. 
            </Typography>
          </Box>
        ) : (
          // Si hay pacientes, muéstralos en una lista
          <List sx={{ p: 0 }}>
            {pacientes.map((paciente) => (
              <ListItem
                key={paciente.id}
                button
                onClick={() => handleVerPaciente(paciente.id)} // <-- Acción al hacer clic
                sx={{ '&:hover': { bgcolor: '#f9f9f9' }, borderBottom: '1px solid #eee' }}
              >
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${paciente.nombre} ${paciente.apellido}`}
                  secondary={paciente.correo || 'Sin correo registrado'}
                />
              </ListItem>
            ))}
          </List>
        )}
        {/* ------------------------------------------- */}
      </Paper>

      {/* La sección "Apps para explorar" se queda igual (comentada) */}
    </>
  );

  // --- El resto de tus funciones (renderCrear, renderCatalogo, etc.) se quedan EXACTAMENTE IGUAL ---

  const renderCrear = () => (
    <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Contenido:
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={handleAgregarPaciente}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <PersonIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Agregar Paciente</Typography>
              <Typography variant="body2" color="text.secondary">
                Registrar un nuevo paciente en el sistema.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <EventIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Agregar Nueva Cita</Typography>
              <Typography variant="body2" color="text.secondary">
                Programa una nueva cita médica.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderCatalogo = () => (
    <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Catálogo de Pacientes
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Buscar pacientes..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '18px', color: '#7f8c8d' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <List>
        {pacientesEjemplo
          .filter(paciente => 
            paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((paciente) => (
            <Paper key={paciente.id} elevation={1} sx={{ mb: 2, borderRadius: '8px' }}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={paciente.nombre}
                  secondary={`Edad: ${paciente.edad} años | Última visita: ${paciente.ultimaVisita}`}
                />
              </ListItem>
            </Paper>
          ))}
      </List>
    </Paper>
  );

  const renderVisualizacion = () => (
    <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Citas Médicas
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#7f8c8d' }}>
        Próximas citas programadas
      </Typography>
      <Grid container spacing={2}>
        {citasMedicas.map((cita) => (
          <Grid item xs={12} md={6} lg={4} key={cita.id}>
            <Card sx={{ borderRadius: '8px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontSize: '16px' }}>
                    {cita.tipo}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Paciente:</strong> {cita.paciente}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Fecha:</strong> {cita.fecha}
                </Typography>
                <Typography variant="body2">
                  <strong>Hora:</strong> {cita.hora}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderSeccionGenerica = (titulo, icono, descripcion) => (
    <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', p: 4 }}>
      <Box sx={{ textAlign: 'center', py: 4 }}>
        {icono}
        <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 600, color: '#2c3e50' }}>
          {titulo}
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d', maxWidth: '600px', mx: 'auto' }}>
          {descripcion}
        </Typography>
      </Box>
    </Paper>
  );

  const renderFavoritos = () => renderSeccionGenerica( "Favoritos", <FavoriteIcon sx={{ fontSize: 64, color: '#e91e63' }} />, "Aquí encontrarás todos tus elementos favoritos marcados para acceso rápido." );
  const renderColecciones = () => renderSeccionGenerica( "Colecciones", <FolderIcon sx={{ fontSize: 64, color: '#ff9800' }} />, "Organiza tu contenido en colecciones personalizadas para mejor gestión." );
  const renderPreparar = () => renderSeccionGenerica( "Preparar Datos", <SettingsIcon sx={{ fontSize: 64, color: '#607d8b' }} />, "Herramientas para limpiar, transformar y preparar tus datos para análisis." );
  const renderAutomatizaciones = () => renderSeccionGenerica( "Automatizaciones", <AutomationIcon sx={{ fontSize: 64, color: '#4caf50' }} />, "Configura procesos automáticos para optimizar tu flujo de trabajo." );
  const renderAlertas = () => renderSeccionGenerica( "Alertas", <NotificationsIcon sx={{ fontSize: 64, color: '#f44336' }} />, "Gestiona tus notificaciones y alertas del sistema médico." );
  const renderSuscripciones = () => renderSeccionGenerica( "Suscripciones", <SubscriptionsIcon sx={{ fontSize: 64, color: '#9c27b0' }} />, "Administra tus suscripciones a reportes y actualizaciones automáticas." );
  const renderInformacion = () => renderSeccionGenerica( "Información", <InfoIcon sx={{ fontSize: 64, color: '#2196f3' }} />, "Accede a la documentación, ayuda y información del sistema." );

  const getTituloSeccion = () => {
    const opcion = opcionesMenu.find(op => op.id === seccionActiva);
    return opcion ? opcion.label : 'Inicio';
  };

  // --- EL RETURN PRINCIPAL SE QUEDA IGUAL ---
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Navbar
        showingresa={false}
        showRegistrate={false}
        transparentNavbar={false}
        lightLink={false}
        staticNavbar={false}
      />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        
        {/* Sidebar izquierdo */}
        <Paper 
          elevation={0}
          sx={{ 
            width: 240, 
            bgcolor: 'white',
            borderRight: '1px solid #e1e5e9',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {/* ... (todo el contenido del sidebar) ... */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e1e5e9' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Sistema Médico
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '12px' }}>
              Dashboard
            </Typography>
          </Box>
          <Box sx={{ p: 2, borderBottom: '1px solid #e1e5e9' }}>
            <TextField
              placeholder="Buscar contenido"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  fontSize: '14px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '18px', color: '#7f8c8d' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: 1, py: 1 }}>
            {opcionesMenu.map((opcion, index) => (
              <Box
                key={index}
                onClick={() => setSeccionActiva(opcion.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1,
                  px: 2,
                  cursor: 'pointer',
                  bgcolor: seccionActiva === opcion.id ? '#e8f4fd' : 'transparent',
                  borderRight: seccionActiva === opcion.id ? '3px solid #1976d2' : 'none',
                  '&:hover': {
                    bgcolor: seccionActiva === opcion.id ? '#e8f4fd' : '#f5f5f5'
                  }
                }}
              >
                <Box sx={{ 
                  mr: 2, 
                  color: seccionActiva === opcion.id ? '#1976d2' : '#7f8c8d',
                  '& svg': { fontSize: '20px' }
                }}>
                  {opcion.icon}
                </Box>
                <Typography 
                  sx={{ 
                    fontSize: '14px', 
                    fontWeight: seccionActiva === opcion.id ? 600 : 400,
                    color: seccionActiva === opcion.id ? '#1976d2' : '#2c3e50'
                  }}
                >
                  {opcion.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            right: -12, 
            zIndex: 10 
          }}>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'white',
                border: '1px solid #e1e5e9',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Paper>

        {/* Contenido principal */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header principal */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: 'white',
              borderBottom: '1px solid #e1e5e9',
              borderRadius: 0
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2c3e50',
                  fontSize: '24px'
                }}
              >
                {seccionActiva === 'inicio' ? `Bienvenido/a ${nombre}.` : getTituloSeccion()}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton sx={{ color: '#7f8c8d' }}>
                  <SearchIcon />
                </IconButton>
                <Button
                  startIcon={<WidgetsIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#e1e5e9',
                    color: '#2c3e50',
                    textTransform: 'none',
                    fontSize: '12px'
                  }}
                >
                  Agregar widgets
                </Button>
              </Box>
            </Box>

            {/* Tabs */}
            {seccionActiva === 'inicio' && (
              <Box sx={{ mt: 2, borderBottom: '2px solid #1976d2', display: 'inline-block' }}>
                <Typography 
                  sx={{ 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: '#1976d2',
                    pb: 1
                  }}
                >
                  Personal
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Área de contenido */}
          <Box sx={{ flex: 1, p: 3 }}>
            {renderContenido()}
          </Box>
        </Box>
      </Box>
      
      <Footer showIncorporaLugar={true} />
    </ThemeProvider>
  );
}

export default MedicalPage;