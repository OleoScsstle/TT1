import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, TextField, InputAdornment, Divider, Tabs, Tab, Chip
} from "@mui/material";
import {
  Person as PersonIcon,
  Search as SearchIcon,
  ArrowForwardIos as ArrowIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

function DashboardMedico() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [errorPacientes, setErrorPacientes] = useState('');
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // ESTADO PARA EL FILTRO DE PESTAÑAS (ACTIVOS / INACTIVOS)
  const [filterStatus, setFilterStatus] = useState('ACTIVO'); // Por defecto ver Activos

  // Cargar pacientes
  useEffect(() => {
    if (token) {
      const fetchPacientes = async () => {
        setLoadingPacientes(true);
        try {
          const response = await axios.get('http://localhost:8000/api/pacientes/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setPacientes(response.data);
        } catch (error) {
          console.error("Error:", error);
          setErrorPacientes("No se pudieron cargar los pacientes.");
        } finally {
          setLoadingPacientes(false);
        }
      };
      fetchPacientes();
    }
  }, [token]);

  const handleVerPaciente = (id) => navigate(`/perfil-paciente/${id}`);

  const nombre = user?.medico_perfil 
    ? `${user.medico_perfil.nombre} ${user.medico_perfil.apellido}` 
    : user?.username || "Usuario";

  // --- LÓGICA DE FILTRADO DOBLE (Buscador + Estatus) ---
  const pacientesFiltrados = pacientes.filter((paciente) => {
    // 1. Filtro por texto
    const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
    const matchText = nombreCompleto.includes(searchTerm.toLowerCase());
    
    // 2. Filtro por estatus (Si la pestaña es "TODOS", pasa todo. Si no, debe coincidir)
    const matchStatus = filterStatus === 'TODOS' ? true : paciente.estado === filterStatus;

    return matchText && matchStatus;
  });

  // Cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setFilterStatus(newValue);
  };

  return (
    <Layout> 
      
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', borderBottom: '1px solid #e1e5e9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '24px' }}>
              Hola, Dr(a). {nombre}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Gestión de expedientes clínicos.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ p: 3, maxWidth: '1000px', margin: '0 auto' }}> 
        
        <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e1e5e9', overflow: 'hidden' }}>
          
          {/* Header de la Lista: Buscador y Pestañas */}
          <Box sx={{ borderBottom: '1px solid #e1e5e9' }}>
             
             {/* Buscador arriba */}
             <Box sx={{ p: 2 }}>
                <TextField
                  placeholder="Buscar paciente por nombre..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                  }}
                />
             </Box>

             {/* Pestañas de Filtro */}
             <Tabs 
                value={filterStatus} 
                onChange={handleTabChange} 
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{ bgcolor: '#f9f9f9' }}
             >
                <Tab label="Activos" value="ACTIVO" icon={<ActiveIcon fontSize="small"/>} iconPosition="start" />
                <Tab label="Inactivos" value="INACTIVO" icon={<InactiveIcon fontSize="small"/>} iconPosition="start" />
                <Tab label="Todos" value="TODOS" />
             </Tabs>
          </Box>
          
          {/* Lista de Pacientes */}
          <Box sx={{ width: '100%', p: 0 }}>
            {loadingPacientes ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress /></Box>
            ) : errorPacientes ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error">{errorPacientes}</Typography></Box>
            ) : pacientesFiltrados.length === 0 ? (
               <Box sx={{ p: 6, textAlign: 'center' }}>
                 <PersonIcon sx={{ fontSize: 60, color: '#eee', mb: 2 }} />
                 <Typography variant="h6" color="textSecondary">
                   No se encontraron pacientes {filterStatus !== 'TODOS' ? filterStatus.toLowerCase() + 's' : ''}.
                 </Typography>
               </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {pacientesFiltrados.map((paciente, index) => (
                  <React.Fragment key={paciente.id}>
                    <ListItem 
                      button 
                      onClick={() => handleVerPaciente(paciente.id)}
                      sx={{ 
                        py: 2, px: 3,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#fff0f7' } // Hover rosa muy suave
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ 
                          bgcolor: paciente.estado === 'ACTIVO' ? '#e3f2fd' : '#ffebee', 
                          p: 1, borderRadius: '50%', display: 'flex' 
                        }}>
                          <PersonIcon color={paciente.estado === 'ACTIVO' ? 'primary' : 'disabled'} />
                        </Box>
                      </ListItemIcon>
                      
                      <ListItemText 
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                             <Typography fontWeight="600" color="#333">
                                {paciente.nombre} {paciente.apellido}
                             </Typography>
                             {/* Chip pequeño si estamos viendo "Todos" para diferenciar */}
                             {filterStatus === 'TODOS' && (
                                <Chip 
                                    label={paciente.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'} 
                                    size="small" 
                                    color={paciente.estado === 'ACTIVO' ? 'success' : 'default'} 
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: 10 }}
                                />
                             )}
                          </Box>
                        }
                        secondary={paciente.correo || 'Sin correo registrado'}
                      />
                      
                      <ArrowIcon sx={{ fontSize: 16, color: '#ccc' }} />
                    </ListItem>
                    {index < pacientesFiltrados.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>

      </Box>
      
    </Layout>
  );
}

export default DashboardMedico;