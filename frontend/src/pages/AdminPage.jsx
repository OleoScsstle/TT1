import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "../css/ItinerariesSavedPage.css";
import ThemeMaterialUI from "../components/ThemeMaterialUI";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box, InputAdornment, IconButton, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, Stack, TextField, Chip, Divider
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  VerifiedUser as VerifiedUserIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  AssignmentInd as AssignmentIndIcon,
  Group as GroupIcon, // Icono para Medicos Aprobados
  RecentActors as RecentActorsIcon, // Icono para Pacientes
  Delete as DeleteIcon // Icono para eliminar
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import axios from 'axios';

// --- MENÚ ACTUALIZADO ---
const opcionesMenu = [
  { id: 'validaciones', icon: <AssignmentIndIcon />, label: "Validaciones Pendientes" },
  { id: 'medicos', icon: <GroupIcon />, label: "Médicos Aprobados" },
  { id: 'pacientes', icon: <RecentActorsIcon />, label: "Todos los Pacientes" },
];

function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [seccionActiva, setSeccionActiva] = useState('validaciones');
  const { token } = useAuth();
  
  // Estados generales
  const [dataList, setDataList] = useState([]); // Lista genérica (se llena según la sección)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // --- FUNCIÓN MAESTRA DE CARGA ---
  const fetchData = async () => {
    setLoading(true);
    setError('');
    setDataList([]);
    
    let url = '';
    // Definimos la URL según la sección activa
    if (seccionActiva === 'validaciones') url = 'http://localhost:8000/api/admin/medicos/?estado=PENDIENTE';
    if (seccionActiva === 'medicos') url = 'http://localhost:8000/api/admin/medicos/?estado=APROBADO';
    if (seccionActiva === 'pacientes') url = 'http://localhost:8000/api/admin/pacientes/';

    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDataList(response.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [seccionActiva, token]);

  // --- VALIDAR MÉDICO ---
  const handleValidar = async (id, estado) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/medicos/${id}/validar/`, 
        { estado: estado },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMensajeExito(`Médico ${estado === 'APROBADO' ? 'aprobado' : 'rechazado'} correctamente.`);
      fetchData(); // Recargar lista
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      setError("Error al procesar la solicitud.");
    }
  };

  // --- ELIMINAR (Médico o lo que sea) ---
  const handleEliminar = async (id, tipo) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.")) return;

    try {
      // La URL base es la misma para eliminar médicos (sea pendiente o aprobado)
      const url = `http://localhost:8000/api/admin/medicos/${id}/`; 
      // NOTA: Si quisieras eliminar pacientes, necesitarías añadir esa lógica al backend viewset de pacientes (permitir destroy)
      
      await axios.delete(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setMensajeExito("Registro eliminado correctamente.");
      fetchData();
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      setError("Error al eliminar.");
    }
  };

  // --- RENDERIZADO DE ITEMS ---
  const renderContent = () => {
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (dataList.length === 0) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="textSecondary">No hay datos para mostrar.</Typography></Box>;

    return (
      <List sx={{ p: 0 }}>
        {dataList
          .filter(item => {
             // Filtro simple de búsqueda
             const texto = JSON.stringify(item).toLowerCase();
             return texto.includes(searchTerm.toLowerCase());
          })
          .map((item) => (
          <ListItem 
            key={item.id} 
            sx={{ borderBottom: '1px solid #eee', display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2, alignItems: 'flex-start', py: 2 }}
          >
            {/* Lógica para mostrar MÉDICOS (Pendientes o Aprobados) */}
            {(seccionActiva === 'validaciones' || seccionActiva === 'medicos') && (
              <>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 2, mt: 1 }}>
                   <PersonIcon color={seccionActiva === 'validaciones' ? 'warning' : 'primary'} fontSize="large" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      Dr. {item.nombre} {item.apellido}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" display="block">
                        Cédula: {item.cedula} | Especialidad: {item.especialidad}
                      </Typography>
                      <Typography variant="body2" component="span" display="block" color="textSecondary">
                        {item.correo}
                      </Typography>
                      {item.telefono && <Typography variant="caption">Tel: {item.telefono}</Typography>}
                    </>
                  }
                  sx={{ flexGrow: 1 }}
                />
                
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* Botones solo para PENDIENTES */}
                  {seccionActiva === 'validaciones' && (
                    <>
                      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => handleValidar(item.id, 'RECHAZADO')}>
                        Rechazar
                      </Button>
                      <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleValidar(item.id, 'APROBADO')} sx={{ color: 'white' }}>
                        Aprobar
                      </Button>
                    </>
                  )}
                  {/* Botón de ELIMINAR para APROBADOS */}
                  {seccionActiva === 'medicos' && (
                     <IconButton color="error" onClick={() => handleEliminar(item.id, 'medico')}>
                       <DeleteIcon />
                     </IconButton>
                  )}
                </Stack>
              </>
            )}

            {/* Lógica para mostrar PACIENTES */}
            {seccionActiva === 'pacientes' && (
               <>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 2, mt: 1 }}>
                   <RecentActorsIcon color="secondary" fontSize="large" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.nombre} {item.apellido}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" display="block">
                        Email: {item.correo || 'N/A'} | Tel: {item.telefono || 'N/A'}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={item.estado} size="small" color={item.estado === 'ACTIVO' ? 'success' : 'default'} variant="outlined" />
                        <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>
                           Médico: {item.esp_encargado ? `Dr. ${item.esp_encargado.nombre} ${item.esp_encargado.apellido}` : 'Sin asignar'}
                        </Typography>
                      </Box>
                    </>
                  }
                />
               </>
            )}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Navbar showingresa={false} showRegistrate={false} transparentNavbar={false} lightLink={false} staticNavbar={false} />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        
        {/* Sidebar */}
        <Paper elevation={0} sx={{ width: 240, bgcolor: 'white', borderRight: '1px solid #e1e5e9', display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e1e5e9' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Panel Admin</Typography>
          </Box>
          <Box sx={{ flex: 1, py: 1 }}>
            {opcionesMenu.map((opcion) => (
              <Box
                key={opcion.id}
                onClick={() => setSeccionActiva(opcion.id)}
                sx={{
                  display: 'flex', alignItems: 'center', py: 1.5, px: 2, cursor: 'pointer',
                  bgcolor: seccionActiva === opcion.id ? '#e8f4fd' : 'transparent',
                  borderRight: seccionActiva === opcion.id ? '3px solid #1976d2' : 'none',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <Box sx={{ mr: 2, color: seccionActiva === opcion.id ? '#1976d2' : '#7f8c8d' }}>{opcion.icon}</Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2c3e50' }}>{opcion.label}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Contenido */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', borderBottom: '1px solid #e1e5e9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '24px' }}>
                {seccionActiva === 'validaciones' ? 'Solicitudes Pendientes' : seccionActiva === 'medicos' ? 'Médicos Aprobados' : 'Listado de Pacientes'}
              </Typography>
               <TextField
                placeholder="Buscar..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#7f8c8d' }} /></InputAdornment>) }}
              />
            </Box>
          </Paper>

          <Box sx={{ flex: 1, p: 3 }}>
             {mensajeExito && <Alert severity="success" sx={{ mb: 2 }}>{mensajeExito}</Alert>}
             {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
             
             {/* Renderizado dinámico */}
             <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid #e1e5e9' }}>
                {renderContent()}
             </Paper>
          </Box>
        </Box>
      </Box>
      <Footer showIncorporaLugar={false} />
    </ThemeProvider>
  );
}

export default AdminPage;