import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Wc as GenderIcon,
  ToggleOn as StatusIcon,
  Description as DocumentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

function PatientProfilePage() {
  const nombrePaciente = "Leonardo Gaell Hernandez Molina"; 
  const emailPaciente = "leonardo.gaell@example.com";
  const fechaNacimiento = "01/01/1990";
  const celular = "+52 123 456 7890";

  // Estados para los campos editables
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [sexo, setSexo] = useState('');
  const [status, setStatus] = useState(true);

  // Estados para los diálogos
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openSexo, setOpenSexo] = useState(false);
  const [tempFecha, setTempFecha] = useState('');
  const [tempSexo, setTempSexo] = useState('');

  // Handlers para Fecha de Ingreso
  const handleOpenCalendar = () => {
    setTempFecha(fechaIngreso);
    setOpenCalendar(true);
  };

  const handleSaveFecha = () => {
    setFechaIngreso(tempFecha);
    setOpenCalendar(false);
  };

  // Handlers para Sexo
  const handleOpenSexo = () => {
    setTempSexo(sexo);
    setOpenSexo(true);
  };

  const handleSaveSexo = () => {
    setSexo(tempSexo);
    setOpenSexo(false);
  };

  // Handler para Status
  const handleToggleStatus = () => {
    setStatus(!status);
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
    
      {/* Contenido Principal */}
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
              {/* Encabezado Rosa */}
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  height: 100,
                  position: 'relative',
                }}
              />

              {/* Avatar */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: -8,
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#d3d3d3',
                    border: '4px solid white',
                  }}
                />
              </Box>

              {/* Nombre del Paciente */}
              <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: 'bold', mb: 4, px: 3 }}
              >
                {nombrePaciente}
              </Typography>

              {/* Secciones de Información */}
              <Box sx={{ px: 4, pb: 4 }}>
                {/* Fecha de Ingreso */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Fecha de ingreso
                      </Typography>
                      {fechaIngreso && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {fechaIngreso}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="primary" onClick={handleOpenCalendar}>
                      <CalendarIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Sexo */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Sexo
                      </Typography>
                      {sexo && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : 'Otro'}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="primary" onClick={handleOpenSexo}>
                      <GenderIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Status */}
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                    }}
                  >
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
                sx={{
                  p: 4,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}
              >
                {/* Botón de Editar */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                {/* Título */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Información personal
                  </Typography>
                </Box>

                {/* Campos de Información */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      E-mail
                    </Typography>
                    <Typography variant="body1">
                      {emailPaciente}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Nombre
                    </Typography>
                    <Typography variant="body1">
                      {nombrePaciente}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Fecha de nacimiento
                    </Typography>
                    <Typography variant="body1">
                      {fechaNacimiento}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Celular
                    </Typography>
                    <Typography variant="body1">
                      {celular}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Tarjeta de Documentos/Análisis */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}
              >
                {/* Botón de Editar */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                {/* Título */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <DocumentIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Documentos/Análisis
                  </Typography>
                </Box>

                {/* Grid de Chips/Documentos */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 2,
                  }}
                >
                  {[...Array(10)].map((_, index) => (
                    <Chip
                      key={index}
                      label=""
                      sx={{
                        height: 40,
                        bgcolor: '#d3d3d3',
                        borderRadius: 20,
                        '&:hover': {
                          bgcolor: '#c0c0c0',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Diálogo para Fecha de Ingreso */}
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

      {/* Diálogo para Sexo */}
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