import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Biotech as BiotechIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NuevoAnalisis() {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // Estados de carga y respuesta
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);
  const [error, setError] = useState('');
  const [resultadoExitoso, setResultadoExitoso] = useState(null);

  // 1. CARGAR LISTA DE PACIENTES AL INICIAR
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pacientes/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPacientes(response.data);
      } catch (err) {
        console.error("Error cargando pacientes:", err);
        setError("No se pudieron cargar tus pacientes. Asegúrate de tener pacientes registrados.");
      } finally {
        setLoadingPacientes(false);
      }
    };

    if (token) fetchPacientes();
  }, [token]);

  // 2. MANEJAR SELECCIÓN DE ARCHIVO
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setResultadoExitoso(null);
    }
  };

  // 3. FUNCIÓN PARA DESCARGAR PDF (SEGURA)
  const handleDownloadPDF = async (analisisId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/analisis/${analisisId}/pdf/`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob' // Importante para archivos binarios
        }
      );
      // Crear URL temporal y abrirla
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err) {
      console.error("Error descargando PDF:", err);
      alert("No se pudo descargar el reporte. Verifica tu sesión.");
    }
  };

  // 4. ENVIAR AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pacienteSeleccionado) {
      setError('Por favor, selecciona un paciente de la lista.');
      return;
    }
    if (!selectedFile) {
      setError('Por favor, sube una imagen mamográfica.');
      return;
    }

    setLoadingAnalisis(true);
    setError('');

    const formData = new FormData();
    formData.append('paciente', pacienteSeleccionado);
    formData.append('imagen', selectedFile);

    try {
      // Nota: URL corregida con '/' al final
      const response = await axios.post('http://localhost:8000/api/analisis/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Respuesta del servidor:", response.data);
      setResultadoExitoso(response.data); 

    } catch (err) {
      console.error("Error en el análisis:", err);
      setError("Ocurrió un error al procesar la imagen. Inténtalo de nuevo.");
    } finally {
      setLoadingAnalisis(false);
    }
  };

  // --- PANTALLA DE RESULTADO ---
  if (resultadoExitoso) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ my: 6 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#2c3e50">
              ¡Análisis Completado!
            </Typography>
            <Typography color="textSecondary" paragraph>
              El sistema ha procesado la imagen correctamente.
            </Typography>
            
            <Card sx={{ mt: 4, mb: 4, border: '1px solid #eee', boxShadow: 'none', bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                  RESULTADO DEL MODELO
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#333' }}>
                  {resultadoExitoso.resultado}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="textSecondary" style={{ whiteSpace: 'pre-line' }}>
                  {resultadoExitoso.descripcion}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 2, color: '#999' }}>
                  Fecha: {resultadoExitoso.fecha_analisis ? new Date(resultadoExitoso.fecha_analisis).toLocaleDateString() : 'Hoy'}
                </Typography>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/main-page')}>
                Ir al Dashboard
              </Button>

              {/* BOTÓN PDF CORREGIDO */}
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<PdfIcon />}
                onClick={() => handleDownloadPDF(resultadoExitoso.id)}
              >
                Descargar Reporte
              </Button>

              <Button variant="contained" onClick={() => {
                setResultadoExitoso(null);
                setSelectedFile(null);
                setPreview(null);
                setPacienteSeleccionado('');
              }}>
                Analizar Otra Imagen
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Layout>
    );
  }

  // --- PANTALLA DEL FORMULARIO ---
  return (
    <Layout>
      <Container maxWidth="md" sx={{ my: 6 }}>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <BiotechIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold" color="#2c3e50">
            Nuevo Análisis
          </Typography>
        </Stack>

        <Paper elevation={3} sx={{ p: 5, borderRadius: 2, bgcolor: 'white' }}>
          {loadingPacientes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              
              {/* 1. Selector de Paciente */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                1. Seleccionar Paciente
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="paciente-select-label">Paciente</InputLabel>
                <Select
                  labelId="paciente-select-label"
                  value={pacienteSeleccionado}
                  label="Paciente"
                  onChange={(e) => setPacienteSeleccionado(e.target.value)}
                  startAdornment={<PersonIcon color="action" sx={{ mr: 1 }} />}
                >
                  {pacientes.length === 0 ? (
                    <MenuItem disabled value="">
                      No tienes pacientes registrados.
                    </MenuItem>
                  ) : (
                    pacientes.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre} {p.apellido} (ID: {p.id})
                      </MenuItem>
                    ))
                  )}
                </Select>
                {pacientes.length === 0 && (
                  <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/registrar-paciente')}>
                    Registrar un paciente primero
                  </Button>
                )}
              </FormControl>

              {/* 2. Carga de Imagen */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                2. Cargar Mamografía
              </Typography>

              <Button
                component="label"
                fullWidth
                sx={{
                  height: 300,
                  border: '2px dashed',
                  borderColor: error && !selectedFile ? 'error.main' : 'primary.main',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#fafafa',
                  color: 'text.secondary',
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                  '&:hover': { bgcolor: '#f0f7ff', borderColor: 'primary.dark' }
                }}
              >
                {preview ? (
                  <Box 
                    component="img" 
                    src={preview} 
                    alt="Vista previa" 
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 1 }} 
                  />
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.7 }} />
                    <Typography variant="h6" color="primary">Haz clic para subir imagen</Typography>
                    <Typography variant="body2">o arrastra el archivo aquí</Typography>
                  </>
                )}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>

              {/* Mensaje de Error */}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              {/* Botón de Acción */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loadingAnalisis || !pacienteSeleccionado || !selectedFile}
                  startIcon={loadingAnalisis ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
                  sx={{ px: 5, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  {loadingAnalisis ? 'Procesando con ML...' : 'Analizar Imagen'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default NuevoAnalisis;