import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import {
  Box, IconButton, InputAdornment, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, Stack, TextField
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  AssignmentInd as AssignmentIndIcon, 
  Group as GroupIcon, 
  RecentActors as RecentActorsIcon, 
  Delete as DeleteIcon,
  Dashboard as DashboardIcon
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import Layout from "../components/Layout";

function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  
  const { token } = useAuth();
  const location = useLocation(); 
  
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // --- 1. DETECTAR SECCIÓN POR URL ---
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/validaciones')) setSeccionActiva('validaciones');
    else if (path.includes('/medicos')) setSeccionActiva('medicos');
    else if (path.includes('/pacientes')) setSeccionActiva('pacientes');
    else setSeccionActiva('inicio');
  }, [location]);

  // --- 2. CARGA DE DATOS (CON FILTRO ANTIDUPLICADOS) ---
  const fetchData = async () => {
    if (seccionActiva === 'inicio') return;

    setLoading(true);
    setError('');
    setDataList([]); // Limpiamos lista antes de cargar
    
    let url = '';
    if (seccionActiva === 'validaciones') url = 'http://localhost:8000/api/admin/medicos/?estado=PENDIENTE';
    if (seccionActiva === 'medicos') url = 'http://localhost:8000/api/admin/medicos/?estado=APROBADO';
    if (seccionActiva === 'pacientes') url = 'http://localhost:8000/api/admin/pacientes/';

    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // --- MAGIA ANTI-DUPLICADOS ---
      // Creamos un Map usando el 'id' como clave. Esto elimina automáticamente cualquier duplicado.
      const uniqueData = [...new Map(response.data.map(item => [item.id, item])).values()];
      
      setDataList(uniqueData);

    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccionActiva, token]);

  // --- 3. ACCIONES ---
  const handleValidar = async (id, estado, e) => {
    e.stopPropagation();
    try {
      await axios.patch(`http://localhost:8000/api/admin/medicos/${id}/validar/`, 
        { estado: estado },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMensajeExito(`Acción realizada correctamente.`);
      fetchData(); 
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      setError("Error al procesar la solicitud.");
    }
  };

  // --- MODIFICADO: ELIMINAR GENÉRICO (SIRVE PARA MEDICOS Y PACIENTES) ---
  const handleEliminar = async (id, e) => {
    e.stopPropagation();
    
    const tipo = seccionActiva === 'pacientes' ? 'paciente' : 'médico';
    if (!window.confirm(`¿Estás seguro de eliminar a este ${tipo}? Esta acción no se puede deshacer.`)) return;

    // Definimos la URL según la sección activa
    let deleteUrl = '';
    if (seccionActiva === 'pacientes') {
        deleteUrl = `http://localhost:8000/api/admin/pacientes/${id}/`;
    } else {
        // Para validaciones o médicos aprobados
        deleteUrl = `http://localhost:8000/api/admin/medicos/${id}/`; 
    }

    try {
      await axios.delete(deleteUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setMensajeExito("Registro eliminado correctamente.");
      // Filtramos localmente para que se vea rápido, luego fetchData asegura
      setDataList(prev => prev.filter(item => item.id !== id)); 
      
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el registro. Verifica que no tenga datos asociados críticos.");
    }
  };

  // --- 4. RENDERIZADO DE LISTA ---
  const renderListItems = () => {
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (dataList.length === 0) return <Typography sx={{p:4, textAlign:'center', color:'#7f8c8d'}}>No hay datos para mostrar.</Typography>;

    // Filtro de búsqueda
    const filteredList = dataList.filter(item => {
        const fullName = `${item.nombre} ${item.apellido}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || (item.correo && item.correo.toLowerCase().includes(search));
    });

    return (
        <List>
            {filteredList.map((item) => (
                <Paper key={item.id} elevation={0} sx={{ p: 2, mb: 1, border: '1px solid #eee', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                    {seccionActiva === 'validaciones' ? <PersonIcon color="warning" /> : 
                    seccionActiva === 'medicos' ? <PersonIcon color="primary" /> :
                    <RecentActorsIcon color="secondary" />}
                </ListItemIcon>
                
                <ListItemText 
                    primary={<Typography fontWeight="bold">{seccionActiva === 'pacientes' ? `${item.nombre} ${item.apellido}` : `Dr. ${item.nombre} ${item.apellido}`}</Typography>}
                    secondary={seccionActiva === 'pacientes' ? item.correo : `Cédula: ${item.cedula} | ${item.especialidad}`}
                    sx={{ flexGrow: 1 }}
                />
                
                <Stack direction="row" spacing={1}>
                    {/* Botones para validar médicos pendientes */}
                    {seccionActiva === 'validaciones' && (
                        <>
                        <Button size="small" variant="outlined" color="error" onClick={(e) => handleValidar(item.id, 'RECHAZADO', e)}>Rechazar</Button>
                        <Button size="small" variant="contained" color="success" sx={{color:'white'}} onClick={(e) => handleValidar(item.id, 'APROBADO', e)}>Aprobar</Button>
                        </>
                    )}
                    
                    {/* Botón de eliminar (Aparece en Médicos Aprobados y en Pacientes) */}
                    {(seccionActiva === 'medicos' || seccionActiva === 'pacientes') && (
                        <IconButton 
                            size="small" 
                            color="error" 
                            onClick={(e) => handleEliminar(item.id, e)}
                            title="Eliminar usuario"
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Stack>
                </Paper>
            ))}
        </List>
    );
  };

  // --- 5. VISTA DE INICIO (Resumen) ---
  const renderInicio = () => (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <DashboardIcon sx={{ fontSize: 60, color: '#ddd', mb: 2 }} />
      <Typography variant="h5" color="textSecondary">Bienvenido al Panel de Administración</Typography>
      <Typography variant="body1" sx={{ mt: 1, color: '#888' }}>
        Selecciona una opción del menú lateral para gestionar médicos y pacientes.
      </Typography>
    </Box>
  );

  // --- RENDER PRINCIPAL ---
  return (
    <Layout>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '24px', color: '#2c3e50' }}>
              {seccionActiva === 'inicio' && 'Inicio'}
              {seccionActiva === 'validaciones' && 'Validaciones Pendientes'}
              {seccionActiva === 'medicos' && 'Médicos Aprobados'}
              {seccionActiva === 'pacientes' && 'Listado de Pacientes'}
            </Typography>
            
            {seccionActiva !== 'inicio' && (
              <TextField
                placeholder="Buscar por nombre..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: 300 }}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
              />
            )}
          </Box>
        </Paper>

        {/* Contenido Dinámico */}
        <Box sx={{ p: 3 }}>
            {mensajeExito && <Alert severity="success" sx={{ mb: 2 }}>{mensajeExito}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {seccionActiva === 'inicio' ? renderInicio() : renderListItems()}
        </Box>
    </Layout>
  );
}

export default AdminPage;