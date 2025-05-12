import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  Stack,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  DoneAllRounded as Check,
  File as FileIcon,
  NoteAdd as NoteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  PhotoCamera as CameraIcon,
} from '@mui/icons-material';

function RegisterPlacePage() {
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Navbar
        showingresa={false}
        showRegistrate={false}
        transparentNavbar={false}
        lightLink={false}
        staticNavbar={false}
      />

    {/* INICIO DEL CONTENIDO DE LA PRIMERA CAJA*/}
      <Container maxWidth="lg" sx={{ my: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="space-between"
          sx={{ mb: 4 }}
          justifyContent={{ sm: 'space-between' }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            <Check color="primary" fontSize="large" />
            <h1 className="it-page-title">
              Comenzar con el análisis
            </h1>
          </Stack>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ my: 6 }}>
    <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6, // Aumenta el espacio horizontal
    mt: 2,  // Opcional: espacio arriba del bloque
    mb: 4,  // Opcional: espacio abajo del bloque
  }}
>
 <Paper
            elevation={3}
            sx={{
              flex: 1,
              minWidth: 300,
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  border: '2px dashed rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CameraIcon
                  sx={{
                    fontSize: 40,
                    color: 'primary.main',
                    mb: 16,
                    opacity: 0,
                  }}
                />
                <Typography variant="h6" gutterBottom color="primary.main">
                  Vista previa de la imagen
                </Typography>
                
              </Box>

              
            </Box>
          </Paper>
          {/* Primera Caja: Datos del paciente */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              minWidth: 300,
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ fontWeight: 'bold' }}
              >
                Cargar información
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Container
              sx={{flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 2}}>
              <NoteIcon color="primary" />              
              <Button
                variant="outlined"
                component="label"
                sx={{
                  mt: 1,
                  px: 3,
                  height: 50,
                  width: '100%',                  
                  justifyContent: 'flex-start', // Opcional: alinea el texto a la izquierda
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(255, 20, 147, 0.04)',
                  },
                }}
              >
                
                Subir mamografía
                <input type="file" hidden accept="image/*" />
              </Button>
              </Container>
              <Container
              sx={{flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 2}}>
              <NoteIcon color="primary" />              
              <Button
                variant="outlined"
                component="label"
                sx={{
                  mt: 1,
                  px: 3,
                  height: 50,
                  width: '100%',                  
                  justifyContent: 'flex-start', // Opcional: alinea el texto a la izquierda
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(255, 20, 147, 0.04)',
                  },
                }}
              >
                
                Subir expediente
                <input type="file" hidden accept="image/*" />
              </Button>
              </Container>

              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                sx={{ alignSelf: 'flex-end', px: 4 }}
              >
                Comenzar
              </Button>
            </Box>
          </Paper>

    {/* FIN DEL CONTENIDO DE LA PRIMERA CAJA*/}



    {/* INICIO DEL CONTENIDO DE LA SEGUNDA CAJA*/}
         
        </Box>
      </Container>
    {/* FIN DEL CONTENIDO DE LA SEGUNDA CAJA*/}

      <Footer showIncorporaLugar={true} />
    </ThemeProvider>
  );
}

export default RegisterPlacePage;
