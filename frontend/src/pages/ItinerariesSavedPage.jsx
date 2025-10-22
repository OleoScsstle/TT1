import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "../css/ItinerariesSavedPage.css";
import ThemeMaterialUI from "../components/ThemeMaterialUI";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import RestorePageIcon from '@mui/icons-material/RestorePage';
import MedicationIcon from '@mui/icons-material/Medication';




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
} from "@mui/material";
import {
  Search as SearchIcon,
} from "@mui/icons-material";

// Datos de ejemplo para pacientes

const opcionesMenu1 = [
  { icon: <RestorePageIcon />, label: "Historial clínico", active: true },
  { icon: <AddIcon />, label: "Agregar paciente" },
  { icon: <FavoriteIcon />, label: "Citas médicas" },
  { icon: <MedicationIcon />, label: "Recetas" },
 
];

const pacientes = [
  { id: 1, nombre: "Aguilar Pedraza David" },
  { id: 2, nombre: "Martinez Perez Ricardo" },
  { id: 3, nombre: "Valverde Hernandez Ivan" },
  { id: 4, nombre: "Sanchez Moreno Samantha" },
];



// Opciones del sidebar
const opcionesMenu = [
  "Revisar historial",
  "Agregar paciente",
  "Citas médicas",
  "Recetas",
];

// Preguntas frecuentes
const preguntasFrecuentes = [
  { titulo: "Preguntas Frecuentes", subtitulo: "Ver preguntas" },
  { titulo: "Preguntas Frecuentes", subtitulo: "Funcionalidades" },
  { titulo: "Preguntas Frecuentes", subtitulo: "Los registros médicos" },
  { titulo: "Preguntas Frecuentes", subtitulo: "Convivencias más" }
];

function MedicalPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    
    <ThemeProvider theme={ThemeMaterialUI}>
        <Navbar
              showingresa={false}
              showRegistrate={false}
              transparentNavbar={false}
              lightLink={false}
              staticNavbar={false}
            />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        
        {/* Sidebar izquierdo */}
        <Paper 
          elevation={0}
          sx={{ 
            width: 200, 
            bgcolor: 'white',
            borderRight: '1px solid #e0e0e0',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Logo */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e1e5e9' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Qlik Sense
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '12px' }}>
            Analítica
          </Typography>
        </Box>

          {/* Opciones del menú */}
          <Box sx={{ flex: 1 }}>
           {opcionesMenu1.map((opcion, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 1,
                            px: 2,
                            cursor: 'pointer',
                            bgcolor: opcion.active ? '#e8f4fd' : 'transparent',
                            borderRight: opcion.active ? '3px solid #1976d2' : 'none',
                            '&:hover': {
                              bgcolor: opcion.active ? '#e8f4fd' : '#f5f5f5'
                            }
                          }}
                        >
                          <Box sx={{ 
                            mr: 2, 
                            color: opcion.active ? '#1976d2' : '#7f8c8d',
                            '& svg': { fontSize: '20px' }
                          }}>
                            {opcion.icon}
                          </Box>
                          <Typography 
                            sx={{ 
                              fontSize: '14px', 
                              fontWeight: opcion.active ? 600 : 400,
                              color: opcion.active ? '#1976d2' : '#2c3e50'
                            }}
                          >
                            {opcion.label}
                          </Typography>
                        </Box>
                      ))}
          </Box>
        </Paper>

        {/* Contenido principal */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: 'white',
              borderBottom: '1px solid #e0e0e0',
              borderRadius: 0
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontSize: '28px'
              }}
            >
              Bienvenido @Usuario
            </Typography>

        <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '16px' }}>
              Ingrese el nombre de un paciente:
            </Typography>

            {/* Barra de búsqueda y filtro */}
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              justifyContent="space-between"
            >
              <TextField
                placeholder="Buscar..."
                variant="outlined"
                size="medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  flexGrow: 1,
                  maxWidth: 400,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <IconButton 
                sx={{ 
                  border: '2px solid #f48fb1',
                  borderRadius: '12px',
                  p: 1.5,
                  color: '#f48fb1'
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Stack>
          </Paper>

          {/* Área de contenido */}
          <Box sx={{ flex: 1, display: 'flex', p: 3 }}>
            
            {/* Lista de pacientes */}
            <Box sx={{ width: '100%', p: 2, overflowY: 'auto'}}>
              <Stack spacing={1}>
                {pacientes
                  .filter(paciente => 
                    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((paciente) => (
                    <Paper
                      key={paciente.id}
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: '#f8bbd9',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: '#f5a6c7',
                        
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <PersonIcon sx={{ color: '#666' }} />
                        <Typography 
                          variant="body1" 
                          sx={{ fontWeight: 500, fontSize: '16px' }}
                        >
                          {paciente.nombre}
                        </Typography>
                      </Stack>
                      <ExpandMoreIcon sx={{ color: '#666' }} />
                    </Paper>
                  ))}
              </Stack>
            </Box>

            {/* Área derecha vacía */}
        
          </Box>

         
         
            
            
            <Stack 
              direction="row" 
              spacing={4}
              justifyContent="space-around"
            />
             
            
        </Box>
      </Box>
          <Footer showIncorporaLugar={true} />
    </ThemeProvider>
  );
}

export default MedicalPage;