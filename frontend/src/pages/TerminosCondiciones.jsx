import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import Layout from '../components/Layout'; // <--- 1. Importamos el Layout (con Sidebar)
import { useAuth } from '../context/AuthContext'; // <--- 2. Importamos el Contexto

const TerminosCondiciones = () => {
  const { isAuthenticated } = useAuth(); // <--- 3. Verificamos si hay sesión

  // Definimos el contenido en una variable para no repetirlo dos veces
  const contenidoPrincipal = (
    <Container maxWidth="lg" sx={{ py: 5, flex: 1 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
          Términos y Condiciones de Uso
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Última actualización: Mayo 2025
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            1. Aceptación de los Términos
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            Bienvenido al <strong>Sistema de Apoyo al Diagnóstico de Cáncer de Mama</strong>. 
            Al acceder y utilizar esta plataforma, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones. 
            Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            2. Descripción del Servicio
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            Este sistema es una herramienta tecnológica desarrollada en la <strong>Escuela Superior de Cómputo (ESCOM)</strong> del <strong>Instituto Politécnico Nacional (IPN)</strong>. 
            Su propósito es asistir a médicos especialistas mediante el análisis de imágenes de mamografías utilizando algoritmos de Inteligencia Artificial (Aprendizaje Automático) para identificar patrones asociados a posibles anomalías.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#d32f2f' }}>
            3. Limitación de Responsabilidad Médica (IMPORTANTE)
          </Typography>
          <Typography variant="body1" align="justify" paragraph sx={{ fontWeight: 'medium' }}>
            <strong>LA APLICACIÓN NO SUSTITUYE EL JUICIO CLÍNICO DE UN MÉDICO.</strong>
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            Los resultados proporcionados por el sistema son únicamente sugerencias basadas en probabilidades matemáticas. 
            El diagnóstico definitivo, la interpretación de los resultados y la decisión sobre el tratamiento del paciente son <strong>responsabilidad exclusiva del médico especialista</strong>. 
            Los desarrolladores y la institución no se hacen responsables por decisiones médicas tomadas basándose exclusivamente en esta herramienta.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            4. Uso Adecuado de la Plataforma
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            Usted se compromete a utilizar el sistema únicamente con fines lícitos y profesionales. Está prohibido:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Subir imágenes que no sean mamografías con fines de diagnóstico.</Typography>
            </li>
            <li>
              <Typography variant="body1">Intentar vulnerar la seguridad del sistema o acceder a datos de otros pacientes sin autorización.</Typography>
            </li>
            <li>
              <Typography variant="body1">Utilizar la plataforma para fines distintos al apoyo médico e investigación académica.</Typography>
            </li>
          </ul>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            5. Privacidad y Datos del Paciente
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            El manejo de la información de los pacientes (datos personales e imágenes médicas) se rige por nuestro <strong>Aviso de Privacidad</strong> y cumple con la normativa vigente en materia de protección de datos personales y salud en México. 
            El usuario es responsable de contar con el consentimiento necesario para subir la información de los pacientes al sistema.
          </Typography>
        </Box>

        <Box component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            6. Propiedad Intelectual
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            El software, los algoritmos, el diseño y los contenidos de este sistema son propiedad intelectual de sus desarrolladores y del Instituto Politécnico Nacional, protegidos por las leyes de derechos de autor aplicables.
          </Typography>
        </Box>

        <Box component="section">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            7. Modificaciones
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las actualizaciones serán publicadas en esta página y el uso continuo del servicio implicará la aceptación de dichos cambios.
          </Typography>
        </Box>

      </Paper>
    </Container>
  );

  // --- LÓGICA CONDICIONAL ---

  // CASO 1: Usuario Logueado (Muestra Sidebar)
  if (isAuthenticated) {
    return (
      <Layout>
        {contenidoPrincipal}
      </Layout>
    );
  }

  // CASO 2: Usuario Público (Sin Sidebar, solo Navbar y Footer)
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        
        {/* Navbar público */}
        <Navbar showingresa={false} showRegistrate={false} />

        {contenidoPrincipal}

        <Footer showIncorporaLugar={false} />
      </Box>
    </ThemeProvider>
  );
};

export default TerminosCondiciones;