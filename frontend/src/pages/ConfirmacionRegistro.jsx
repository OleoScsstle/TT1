import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Fade 
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Usaré la versión rellena, se ve mejor en color
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import ThemeMaterialUI from '../components/ThemeMaterialUI'; // <-- Importante para el color rosa

function ConfirmacionRegistro() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: '#ffffff' // Un rosa MUY pálido de fondo para combinar
      }}>
        
        {/* Navbar simple */}
        <Navbar showingresa={false} showRegistrate={false} />

        <Container 
          component="main" 
          maxWidth="sm" 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 4
          }}
        >
          <Fade in={true} timeout={1000}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, 
                borderRadius: 4, 
                textAlign: 'center',
                bgcolor: 'white',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderTop: '6px solid #E4007C' // Detalle rosa en el borde superior
              }}
            >
              {/* Ícono Rosa Mexicano */}
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 90, 
                  color: '#E4007C', // Forzamos el rosa mexicano
                  mb: 3,
                  filter: 'drop-shadow(0px 4px 6px rgba(228, 0, 124, 0.3))'
                }} 
              />

              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#E4007C', mb: 2 }}>
                ¡Registro Exitoso!
              </Typography>

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium', color: '#333' }}>
                Bienvenido al Sistema de Apoyo al Diagnóstico
              </Typography>

              <Typography variant="body1" sx={{ mb: 5, color: '#666', lineHeight: 1.6 }}>
                Tu cuenta ha sido creada correctamente. Ahora puedes comenzar a utilizar nuestra herramienta de análisis.
              </Typography>

              <Button 
                variant="contained" 
                color="primary" // Esto tomará el #E4007C de tu ThemeMaterialUI
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  px: 6, 
                  py: 1.5, 
                  borderRadius: 50, // Botón redondeado estilo "pill"
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(228, 0, 124, 0.4)', // Sombra rosa brillante
                  '&:hover': {
                    backgroundColor: '#CA006B', // Un poco más oscuro al pasar el mouse
                    boxShadow: '0 6px 20px rgba(228, 0, 124, 0.6)',
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            </Paper>
          </Fade>
        </Container>

        <Footer showIncorporaLugar={false} />
      </Box>
    </ThemeProvider>
  );
}

export default ConfirmacionRegistro;