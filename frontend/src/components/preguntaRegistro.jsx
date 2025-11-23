import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeMaterialUI from './ThemeMaterialUI';

// Asegúrate de tener esta imagen o usa una de médicos/tecnología
import screeningImg from '../img/HomePage/Ilustration.webp'; 

function preguntaRegistro() {
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      {/* El id="sobre-nosotros" es CLAVE para que el enlace del menú funcione */}
      <Box id="sobre-nosotros" sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            
            {/* Columna de Texto */}
            <Grid item xs={12} md={7}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  color="primary" 
                  fontWeight="bold" 
                  gutterBottom
                >
                  ¿Quiénes Somos?
                </Typography>
                
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 'medium' }}>
                  Innovación tecnológica al servicio de la salud en México.
                </Typography>

                <Typography variant="body1" paragraph align="justify" sx={{ color: '#555' }}>
                  Somos un equipo de ingenieros en formación del <strong>Instituto Politécnico Nacional (ESCOM)</strong>, comprometidos con el desarrollo de soluciones tecnológicas que impacten positivamente en la sociedad.
                </Typography>

                <Typography variant="body1" paragraph align="justify" sx={{ color: '#555' }}>
                  Nuestro proyecto nace de la necesidad de fortalecer las herramientas de diagnóstico en el sector salud. Entendemos que la detección temprana es la clave en la lucha contra el cáncer de mama, por lo que hemos desarrollado este sistema auxiliar basado en <strong>Inteligencia Artificial y Aprendizaje Automático</strong>.
                </Typography>

                <Typography variant="body1" paragraph align="justify" sx={{ color: '#555' }}>
                  Nuestro objetivo no es sustituir al médico, sino brindarle una "segunda opinión" matemática y precisa que agilice el análisis de mamografías, permitiendo diagnósticos más rápidos y confiables para salvar más vidas.
                </Typography>
              </Box>
            </Grid>

            {/* Columna de Imagen */}
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={4} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  transform: 'rotate(2deg)', // Un pequeño toque de diseño
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'rotate(0deg)' }
                }}
              >
                <Box 
                  component="img" 
                  src={screeningImg} 
                  alt="Equipo médico y tecnología" 
                  sx={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block' 
                  }} 
                />
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default preguntaRegistro;