import React, { useState } from "react";
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
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { ThemeProvider } from "@mui/material/styles";
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
} from "@mui/material";

// Opciones del sidebar
const opcionesMenu = [
  { id: 'inicio', icon: <HomeIcon />, label: "Inicio" },
  { id: 'crear', icon: <AddIcon />, label: "Crear" },
  { id: 'favoritos', icon: <FavoriteIcon />, label: "Favoritos" },
  { id: 'colecciones', icon: <FolderIcon />, label: "Colecciones" },
  { id: 'catalogo', icon: <DescriptionIcon />, label: "Catálogo" },
  { id: 'visualizacion', icon: <BarChartIcon />, label: "Visualización y análisis" },
  { id: 'preparar', icon: <SettingsIcon />, label: "Preparar datos" },
  { id: 'automatizaciones', icon: <AutomationIcon />, label: "Automatizaciones" },
  { id: 'alertas', icon: <NotificationsIcon />, label: "Alertas" },
  { id: 'suscripciones', icon: <SubscriptionsIcon />, label: "Suscripciones" },
  { id: 'informacion', icon: <InfoIcon />, label: "Información" },
];

// Datos de ejemplo para diferentes secciones
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
  const nombre = "Leonardo Gaell Hernández Molina"; 

  // Función para renderizar el contenido según la sección activa
  const renderContenido = () => {
    switch(seccionActiva) {
      case 'inicio':
        return renderInicio();
      case 'crear':
        return renderCrear();
      case 'favoritos':
        return renderFavoritos();
      case 'colecciones':
        return renderColecciones();
      case 'catalogo':
        return renderCatalogo();
      case 'visualizacion':
        return renderVisualizacion();
      case 'preparar':
        return renderPreparar();
      case 'automatizaciones':
        return renderAutomatizaciones();
      case 'alertas':
        return renderAlertas();
      case 'suscripciones':
        return renderSuscripciones();
      case 'informacion':
        return renderInformacion();
      default:
        return renderInicio();
    }
  };

  const renderInicio = () => (
    <>
      {/* Sección: Utilizados recientemente */}
      <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', mb: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e1e5e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
            Utilizados recientemente
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#7f8c8d' }}><ChevronLeftIcon /></IconButton>
            <IconButton size="small" sx={{ color: '#7f8c8d' }}><ChevronRightIcon /></IconButton>
            <Button size="small" sx={{ textTransform: 'none', fontSize: '12px', color: '#1976d2' }}>Ver todo</Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, flexDirection: 'column' }}>
          <Box sx={{ width: 80, height: 80, border: '2px solid #e1e5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SearchIcon sx={{ fontSize: '32px', color: '#bdc3c7' }} />
          </Box>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50', mb: 1 }}>
            No hay contenido disponible todavía.
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
            El contenido al que tiene acceso se mostrará aquí. Ejemplos de tipos de contenido son gráficos, apps, datos o enlaces.
          </Typography>
        </Box>
      </Paper>

      {/* Sección: Apps para explorar */}
      <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e1e5e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
            Apps para explorar
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#7f8c8d' }}><ChevronLeftIcon /></IconButton>
            <IconButton size="small" sx={{ color: '#7f8c8d' }}><ChevronRightIcon /></IconButton>
            <Button size="small" sx={{ textTransform: 'none', fontSize: '12px', color: '#1976d2' }}>Ver todo</Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, flexDirection: 'column' }}>
          <Box sx={{ width: 80, height: 80, border: '2px solid #e1e5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <BarChartIcon sx={{ fontSize: '32px', color: '#bdc3c7' }} />
          </Box>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
            No hay apps todavía.
          </Typography>
        </Box>
      </Paper>
    </>
  );

  const renderCrear = () => (
    <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Crear Nuevo Contenido
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <PersonIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Agregar Paciente</Typography>
              <Typography variant="body2" color="text.secondary">
                Registra un nuevo paciente en el sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <EventIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Nueva Cita</Typography>
              <Typography variant="body2" color="text.secondary">
                Programa una nueva cita médica
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <BarChartIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Nuevo Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Crea un nuevo dashboard de análisis
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

  const renderFavoritos = () => renderSeccionGenerica(
    "Favoritos", 
    <FavoriteIcon sx={{ fontSize: 64, color: '#e91e63' }} />,
    "Aquí encontrarás todos tus elementos favoritos marcados para acceso rápido."
  );

  const renderColecciones = () => renderSeccionGenerica(
    "Colecciones", 
    <FolderIcon sx={{ fontSize: 64, color: '#ff9800' }} />,
    "Organiza tu contenido en colecciones personalizadas para mejor gestión."
  );

  const renderPreparar = () => renderSeccionGenerica(
    "Preparar Datos", 
    <SettingsIcon sx={{ fontSize: 64, color: '#607d8b' }} />,
    "Herramientas para limpiar, transformar y preparar tus datos para análisis."
  );

  const renderAutomatizaciones = () => renderSeccionGenerica(
    "Automatizaciones", 
    <AutomationIcon sx={{ fontSize: 64, color: '#4caf50' }} />,
    "Configura procesos automáticos para optimizar tu flujo de trabajo."
  );

  const renderAlertas = () => renderSeccionGenerica(
    "Alertas", 
    <NotificationsIcon sx={{ fontSize: 64, color: '#f44336' }} />,
    "Gestiona tus notificaciones y alertas del sistema médico."
  );

  const renderSuscripciones = () => renderSeccionGenerica(
    "Suscripciones", 
    <SubscriptionsIcon sx={{ fontSize: 64, color: '#9c27b0' }} />,
    "Administra tus suscripciones a reportes y actualizaciones automáticas."
  );

  const renderInformacion = () => renderSeccionGenerica(
    "Información", 
    <InfoIcon sx={{ fontSize: 64, color: '#2196f3' }} />,
    "Accede a la documentación, ayuda y información del sistema."
  );

  // Función para obtener el título de la sección
  const getTituloSeccion = () => {
    const opcion = opcionesMenu.find(op => op.id === seccionActiva);
    return opcion ? opcion.label : 'Inicio';
  };

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
          {/* Header del sidebar */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e1e5e9' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Sistema Médico
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '12px' }}>
              Dashboard
            </Typography>
          </Box>

          {/* Barra de búsqueda en sidebar */}
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

          {/* Opciones del menú */}
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

          {/* Botón de colapsar */}
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