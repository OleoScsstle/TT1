import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, Grid } from '@mui/material';

// Componentes
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import ButtonsMod from '../components/ButtonsMod';
import PreguntaRegistro from '../components/preguntaRegistro'; // <--- 1. IMPORTAR EL NUEVO COMPONENTE

// Imágenes
import screeningImg from '../img/HomePage/ilustracion-mamografia.avif'; 

function HomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login');
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      {/* Navbar controla automáticamente los enlaces */}
      <Navbar
        showingresa={true}
        showRegistrate={true}
        transparentNavbar={false}
        lightLink={false}
      />

      {/* === SECCIÓN HERO (Portada) === */}
      <Box sx={{ 
        minHeight: '85vh', // Un poco más alto para lucir mejor
        display: 'flex', 
        alignItems: 'center', 
        background: 'linear-gradient(to bottom right, #fff0f7, #ffffff)',
        pt: 2 // Padding top para separar del navbar si no es transparente
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Texto Hero */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1, letterSpacing: 1 }}>
                  SISTEMA DE APOYO AL DIAGNÓSTICO
                </Typography>
                
                <Typography variant="h2" sx={{ fontWeight: '800', mb: 3, color: '#2c3e50', lineHeight: 1.2 }}>
                  Tecnología avanzada para el cuidado de la mujer
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', color: '#666', lineHeight: 1.6 }}>
                  Una herramienta inteligente diseñada para asistir a especialistas en el análisis de mamografías. Únete a la innovación médica y mejora la precisión en la detección temprana.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <ButtonsMod
                    variant='principal'
                    textCont='Comenzar ahora'
                    width='12rem'
                    clickEvent={handleStartClick}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Imagen Hero */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src={screeningImg} 
                alt="Ilustración médica tecnología" 
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))' }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* === SECCIÓN SOBRE NOSOTROS (Aquí insertamos el componente) === */}
      <PreguntaRegistro />

      <Footer showIncorporaLugar={false} />
    </ThemeProvider>
  );
}

export default HomePage;