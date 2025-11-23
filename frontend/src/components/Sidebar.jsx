import React, { useState } from 'react';
import { 
  Paper, Box, Typography, TextField, InputAdornment, Collapse, List, 
  ListItemButton, ListItemIcon, ListItemText 
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Add as AddIcon, 
  Info as InfoIcon, 
  Search as SearchIcon,
  Event as EventIcon,
  AssignmentInd as AssignmentIndIcon,
  Group as GroupIcon,
  RecentActors as RecentActorsIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Description as DescriptionIcon, // Para Términos
  Policy as PolicyIcon,           // Para Privacidad
  Biotech as BiotechIcon          // Para Análisis
} from "@mui/icons-material";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Estado para controlar qué menús están abiertos (para el acordeón)
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSubmenuClick = (id) => {
    setOpenSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- ESTRUCTURA DEL MENÚ ---
  const menuMedico = [
    { id: 'dashboard', icon: <HomeIcon />, label: "Inicio", path: '/main-page' },
    { id: 'crear', icon: <AddIcon />, label: "Agregar Paciente", path: '/registrar-paciente' },
    
    // Esta es la opción que tú habías agregado:
    { id: 'nueva_cita', icon: <EventIcon />, label: "Registrar Nueva Cita", path: '/' }, 
    
    { id: 'analisis', icon: <BiotechIcon />, label: "Nuevo Análisis", path: '/comenzar-analisis' },
    
    // Ítem con SUB-MENÚ (Desplegable)
    { 
      id: 'informacion', 
      icon: <InfoIcon />, 
      label: "Información", 
      subItems: [
        { id: 'privacidad', label: "Aviso de Privacidad", path: '/politica-privacidad', icon: <PolicyIcon /> },
        { id: 'terminos', label: "Términos y Cond.", path: '/terminos-condiciones', icon: <DescriptionIcon /> },
      ]
    },
  ];

  const menuAdmin = [
    { id: 'inicio', icon: <DashboardIcon />, label: "Inicio", path: '/admin/dashboard' },
    { id: 'validaciones', icon: <AssignmentIndIcon />, label: "Validaciones", path: '/admin/validaciones' },
    { id: 'medicos', icon: <GroupIcon />, label: "Médicos", path: '/admin/medicos' },
    { id: 'pacientes', icon: <RecentActorsIcon />, label: "Pacientes", path: '/admin/pacientes' },
  ];

  const opcionesMenu = user?.is_staff ? menuAdmin : menuMedico;
  const tituloSistema = user?.is_staff ? 'Panel Admin' : 'Sistema Médico';
  const subtitulo = user?.is_staff ? 'Administración' : 'Dashboard';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: 240, 
        bgcolor: 'white',
        borderRight: '1px solid #e1e5e9',
        borderRadius: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh'
      }}
    >
      {/* Header del Sidebar */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e1e5e9' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          {tituloSistema}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '12px' }}>
          {subtitulo}
        </Typography>
      </Box>

      {/* Buscador */}
      

      {/* Lista de Menú */}
      <List component="nav" sx={{ flex: 1, py: 1 }}>
        {opcionesMenu.map((opcion) => {
          // Verificamos si es un ítem simple o con submenú
          const hasSubItems = opcion.subItems && opcion.subItems.length > 0;
          const isSubmenuOpen = openSubmenus[opcion.id];
          
          // Está activo si la ruta coincide Y no tiene subitems (o si un subitem está activo)
          const isActive = !hasSubItems && location.pathname === opcion.path;

          return (
            <React.Fragment key={opcion.id}>
              {/* Ítem Principal */}
              <ListItemButton
                onClick={() => hasSubItems ? handleSubmenuClick(opcion.id) : navigate(opcion.path)}
                sx={{
                  py: 1.5, px: 2,
                  bgcolor: isActive ? '#e8f4fd' : 'transparent',
                  borderRight: isActive ? '3px solid #E4007C' : '3px solid transparent', // Borde rosa si activo
                  '&:hover': { bgcolor: isActive ? '#e8f4fd' : '#f5f5f5' },
                  transition: 'all 0.2s'
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#E4007C' : '#7f8c8d' }}>
                  {opcion.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={opcion.label} 
                  primaryTypographyProps={{ 
                    fontSize: '14px', 
                    fontWeight: isActive ? 600 : 400, 
                    color: isActive ? '#E4007C' : '#2c3e50' 
                  }} 
                />
                {/* Flechita si tiene submenú */}
                {hasSubItems ? (isSubmenuOpen ? <ExpandLess sx={{ color: '#7f8c8d' }} /> : <ExpandMore sx={{ color: '#7f8c8d' }} />) : null}
              </ListItemButton>

              {/* Sub-items (Desplegables) */}
              {hasSubItems && (
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {opcion.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <ListItemButton 
                          key={subItem.id} 
                          sx={{ pl: 4, bgcolor: isSubActive ? '#fff0f7' : 'transparent' }} // Rosa pálido al activar subitem
                          onClick={() => navigate(subItem.path)}
                        >
                          <ListItemIcon sx={{ minWidth: 40, color: isSubActive ? '#E4007C' : '#9ca3af' }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={subItem.label} 
                            primaryTypographyProps={{ fontSize: '13px', color: '#555' }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
}

export default Sidebar;