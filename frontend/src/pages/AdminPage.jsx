import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import {
  Box, IconButton, InputAdornment, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, Stack, TextField, Backdrop,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  RecentActors as RecentActorsIcon, 
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon, // Icono para Aprobar
  Cancel as CancelIcon // Icono para Rechazar
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
  const [apiMessage, setApiMessage] = useState({ type: '', msg: '' });

  // --- DIÁLOGOS (ESTADOS) ---
  
  // 1. Estado para ELIMINAR
  const [deleteDialog, setDeleteDialog] = useState({ 
    open: false, id: null, tipo: '' 
  });

  // 2. NUEVO: Estado para VALIDAR / RECHAZAR
  const [validationDialog, setValidationDialog] = useState({
    open: false,
    id: null,
    estado: '', // 'APROBADO' o 'RECHAZADO'
    nombre: ''  // Para mostrar en el texto
  });

  // --- DETECTAR SECCIÓN ---
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/validaciones')) setSeccionActiva('validaciones');
    else if (path.includes('/medicos')) setSeccionActiva('medicos');
    else if (path.includes('/pacientes')) setSeccionActiva('pacientes');
    else setSeccionActiva('inicio');
  }, [location]);

  // --- CARGA DE DATOS ---
  const fetchData = async () => {
    if (seccionActiva === 'inicio') return;
    setLoading(true);
    setApiMessage({ type: '', msg: '' });
    setDataList([]); 
    
    let url = '';
    if (seccionActiva === 'validaciones') url = 'http://localhost:8000/api/admin/medicos/?estado=PENDIENTE';
    if (seccionActiva === 'medicos') url = 'http://localhost:8000/api/admin/medicos/?estado=APROBADO';
    if (seccionActiva === 'pacientes') url = 'http://localhost:8000/api/admin/pacientes/';

    try {
      const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
      const uniqueData = [...new Map(response.data.map(item => [item.id, item])).values()];
      setDataList(uniqueData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setApiMessage({ type: 'error', msg: "No se pudieron cargar los datos." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccionActiva, token]);

  // =========================================================
  // LOGICA A: VALIDAR / RECHAZAR (Con Dialog)
  // =========================================================

  // Paso 1: Abrir el diálogo
  const pedirConfirmacionValidacion = (id, estado, nombre, e) => {
    e.stopPropagation();
    setValidationDialog({
        open: true,
        id: id,
        estado: estado,
        nombre: nombre
    });
  };

  // Paso 2: Ejecutar acción real
  const ejecutarValidacion = async () => {
    const { id, estado } = validationDialog;
    
    // Cerramos modal y activamos loading
    setValidationDialog({ ...validationDialog, open: false });
    setLoading(true);
    setApiMessage({ type: '', msg: '' });

    try {
      await axios.patch(`http://localhost:8000/api/admin/medicos/${id}/validar/`, 
        { estado: estado },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const textoAccion = estado === 'APROBADO' ? 'aprobado' : 'rechazado';
      setApiMessage({ type: 'success', msg: `Médico ${textoAccion} correctamente.` });
      
      await fetchData(); 
      setTimeout(() => setApiMessage({ type: '', msg: '' }), 3000);
    } catch (err) {
      setApiMessage({ type: 'error', msg: "Error al procesar la solicitud." });
      setLoading(false);
    }
  };

  // =========================================================
  // LOGICA B: ELIMINAR (Con Dialog)
  // =========================================================

  const pedirConfirmacionEliminar = (id, e) => {
    e.stopPropagation();
    const tipoTexto = seccionActiva === 'pacientes' ? 'paciente' : 'médico';
    setDeleteDialog({ open: true, id: id, tipo: tipoTexto });
  };

  const ejecutarEliminacion = async () => {
    const { id } = deleteDialog;
    setDeleteDialog({ open: false, id: null, tipo: '' });
    setLoading(true);
    setApiMessage({ type: '', msg: '' });

    let deleteUrl = seccionActiva === 'pacientes' 
        ? `http://localhost:8000/api/admin/pacientes/${id}/`
        : `http://localhost:8000/api/admin/medicos/${id}/`;

    try {
      await axios.delete(deleteUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      setApiMessage({ type: 'success', msg: "Registro eliminado correctamente." });
      setDataList(prev => prev.filter(item => item.id !== id)); 
      setLoading(false);
      setTimeout(() => setApiMessage({ type: '', msg: '' }), 3000);
    } catch (err) {
      setApiMessage({ type: 'error', msg: "Error al eliminar. Verifica datos asociados." });
      setLoading(false);
    }
  };

  // --- RENDERIZADO DE LISTA ---
  const renderListItems = () => {
    if (!loading && dataList.length === 0) return <Typography sx={{p:4, textAlign:'center', color:'#7f8c8d'}}>No hay datos para mostrar.</Typography>;

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
                    primary={<Typography fontWeight="bold">{seccionActiva === 'pacientes' ? `${item.nombre} ${item.apellido}` : `Dr(a). ${item.nombre} ${item.apellido}`}</Typography>}
                    secondary={seccionActiva === 'pacientes' ? item.correo : `Cédula: ${item.cedula} | ${item.especialidad}`}
                    sx={{ flexGrow: 1 }}
                />
                
                <Stack direction="row" spacing={1}>
                    {seccionActiva === 'validaciones' && (
                        <>
                        {/* --- BOTONES MODIFICADOS PARA USAR DIALOG --- */}
                        <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={(e) => pedirConfirmacionValidacion(item.id, 'RECHAZADO', `${item.nombre} ${item.apellido}`, e)}
                        >
                            Rechazar
                        </Button>
                        <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            sx={{color:'white'}} 
                            onClick={(e) => pedirConfirmacionValidacion(item.id, 'APROBADO', `${item.nombre} ${item.apellido}`, e)}
                        >
                            Aprobar
                        </Button>
                        </>
                    )}
                    
                    {(seccionActiva === 'medicos' || seccionActiva === 'pacientes') && (
                        <IconButton 
                            size="small" color="error" 
                            onClick={(e) => pedirConfirmacionEliminar(item.id, e)}
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

  const renderInicio = () => (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <DashboardIcon sx={{ fontSize: 60, color: '#ddd', mb: 2 }} />
      <Typography variant="h5" color="textSecondary">Bienvenido al Panel de Administración</Typography>
    </Box>
  );

  // --- VARIABLES AUXILIARES PARA EL DIALOG DE VALIDACIÓN ---
  // Esto ayuda a determinar colores y textos dinámicamente
  const isApprove = validationDialog.estado === 'APROBADO';
  const actionColor = isApprove ? 'success' : 'error';
  const ActionIcon = isApprove ? CheckCircleIcon : CancelIcon;

  return (
    <Layout>
        {/* Backdrop */}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2 }} open={loading}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Procesando...</Typography>
        </Backdrop>

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
                placeholder="Buscar..."
                variant="outlined" size="small" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: 300 }}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
              />
            )}
          </Box>
        </Paper>

        <Box sx={{ p: 3 }}>
            {apiMessage.msg && <Alert severity={apiMessage.type} sx={{ mb: 2 }}>{apiMessage.msg}</Alert>}
            {seccionActiva === 'inicio' ? renderInicio() : renderListItems()}
        </Box>

        {/* --- 1. DIÁLOGO DE ELIMINACIÓN --- */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({...deleteDialog, open: false})}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" /> ¿Eliminar registro?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Estás a punto de eliminar a un <strong>{deleteDialog.tipo}</strong>. Esta acción es irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialog({...deleteDialog, open: false})} variant="outlined">Cancelar</Button>
            <Button onClick={ejecutarEliminacion} color="error" variant="contained">Eliminar</Button>
          </DialogActions>
        </Dialog>

        {/* --- 2. DIÁLOGO DE VALIDACIÓN / RECHAZO --- */}
        <Dialog
          open={validationDialog.open}
          onClose={() => setValidationDialog({...validationDialog, open: false})}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ActionIcon color={actionColor} />
            {isApprove ? "Confirmar Aprobación" : "Confirmar Rechazo"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas <strong>{isApprove ? 'APROBAR' : 'RECHAZAR'}</strong> la solicitud del médico 
              <strong> {validationDialog.nombre}</strong>?
              <br/><br/>
              {isApprove 
                ? "El médico podrá acceder al sistema inmediatamente."
                : "El registro permanecerá en la base de datos como rechazado."}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setValidationDialog({...validationDialog, open: false})} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button onClick={ejecutarValidacion} variant="contained" color={actionColor} sx={{ color: 'white' }}>
              Confirmar {isApprove ? 'Aprobación' : 'Rechazo'}
            </Button>
          </DialogActions>
        </Dialog>

    </Layout>
  );
}

export default AdminPage;