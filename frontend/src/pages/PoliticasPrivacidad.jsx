import React from 'react';
import { Box, Container, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import Layout from '../components/Layout'; // <--- Importar Layout
import { useAuth } from '../context/AuthContext'; // <--- Importar AuthContext

const PoliticasPrivacidad = () => {
  const { isAuthenticated } = useAuth(); // <--- Verificar sesión

  const contenidoPrincipal = (
    <Container maxWidth="lg" sx={{ py: 5, flex: 1 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        
        {/* TÍTULO PRINCIPAL EN ROSA */}
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#e91e63' }} gutterBottom>
          Aviso de Privacidad
        </Typography>
        
        <Typography variant="body1" paragraph>
          Con fundamento en los artículos 15 y 16 de la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> y su reglamento, hacemos de su conocimiento lo siguiente:
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Sección A: Datos Recabados - Subtítulo en NEGRO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
            A. Datos personales que se recaban
          </Typography>
          <Typography variant="body1" paragraph>
            Para poder brindar el servicio de evaluación de riesgo de cáncer de mama mediante mamografía, la aplicación podrá recabar los siguientes datos:
          </Typography>
          <ul>
            <li><Typography variant="body1"><strong>Datos personales de identificación:</strong> nombre, edad, sexo, correo electrónico.</Typography></li>
            <li><Typography variant="body1"><strong>Datos sensibles de salud:</strong> antecedentes médicos, resultados de mamografías, historial clínico relacionado con cáncer de mama.</Typography></li>
          </ul>
        </Box>

        {/* Sección B: Finalidades - Subtítulo en NEGRO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
            B. Finalidades del tratamiento de datos
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">Finalidades Primarias:</Typography>
          <ol>
            <li><Typography variant="body1">Procesamiento de imágenes de mamografía.</Typography></li>
            <li><Typography variant="body1">Evaluación automatizada del riesgo de cáncer de mama.</Typography></li>
            <li><Typography variant="body1">Generación de informes clínicos.</Typography></li>
            <li><Typography variant="body1">Contacto con profesionales de salud (si aplica).</Typography></li>
          </ol>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Finalidades Secundarias:</Typography>
          <ol>
            <li><Typography variant="body1">Mejoras al sistema mediante análisis estadísticos (datos anonimizados).</Typography></li>
            <li><Typography variant="body1">Envío de información educativa y actualizaciones (previo consentimiento).</Typography></li>
          </ol>
        </Box>

        {/* Sección C: Transferencia - Subtítulo en NEGRO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
            C. Transferencia de datos
          </Typography>
          <Typography variant="body1" paragraph>
            Los datos personales <strong>no serán compartidos con terceros sin su consentimiento</strong>, salvo en los casos previstos en el artículo 37 de la LFPDPPP, por ejemplo:
          </Typography>
          <ul>
            <li><Typography variant="body1">Cuando sea solicitado por autoridades competentes.</Typography></li>
            <li><Typography variant="body1">Para fines de salud pública o atención médica urgente.</Typography></li>
          </ul>
        </Box>

        {/* Sección D: Derechos ARCO - Subtítulo en NEGRO */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
            D. Derechos ARCO
          </Typography>
          <Typography variant="body1" align="justify">
            Usted puede ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>, así como revocar su consentimiento para el tratamiento de sus datos personales, enviando una solicitud al correo electrónico de contacto del sistema.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Política de Uso - Subtítulo en NEGRO */}
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
          Política de Uso de la Aplicación
        </Typography>

        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">A. Objeto</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              La presente aplicación tiene como fin asistir en la detección temprana de cáncer de mama mediante el análisis de mamografías usando tecnologías de inteligencia artificial. <strong>No sustituye el diagnóstico médico profesional.</strong>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">B. Obligaciones del Usuario</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              <li><Typography variant="body1">Utilizar la aplicación conforme a su propósito médico e informativo.</Typography></li>
              <li><Typography variant="body1">Proporcionar información veraz y completa.</Typography></li>
              <li><Typography variant="body1">No utilizar la aplicación con fines ilícitos o no autorizados.</Typography></li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">C. Limitaciones de Responsabilidad</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              <li><Typography variant="body1">La aplicación no garantiza un diagnóstico definitivo. El resultado es una herramienta de apoyo.</Typography></li>
              <li><Typography variant="body1">Se recomienda siempre consultar con un profesional de la salud.</Typography></li>
              <li><Typography variant="body1">La empresa desarrolladora no se hace responsable por decisiones médicas tomadas exclusivamente con base en la aplicación.</Typography></li>
            </ul>
          </AccordionDetails>
        </Accordion>
        
        {/* Sección D: Seguridad (Restaurada) */}
        <Box sx={{ mt: 3, mb: 3 }}>
             <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
                D. Seguridad
             </Typography>
             <Typography variant="body1">
                Se implementan medidas de seguridad físicas, técnicas y administrativas para proteger los datos personales, conforme a lo establecido por los artículos 19 y 20 de la LFPDPPP.
             </Typography>
        </Box>

        {/* Sección 3: Cambios al Aviso (Restaurada) */}
        <Box sx={{ mb: 3 }}>
             <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }} gutterBottom>
                3. CAMBIOS AL AVISO DE PRIVACIDAD
             </Typography>
             <Typography variant="body1">
                Este aviso puede sufrir modificaciones o actualizaciones derivadas de nuevos requerimientos legales o tecnológicos.
             </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
            He leído y acepto los términos del Aviso de Privacidad y la Política de Uso.
        </Typography>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#fff0f7', borderLeft: '4px solid #E4007C' }}>
          {/* Subtítulo de la Leyenda en NEGRO */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'black' }}>
            Leyenda de Datos
          </Typography>
          <Typography variant="body2">
            El resultado proporcionado por esta aplicación es únicamente una herramienta de apoyo. El diagnóstico final y cualquier decisión médica dependen exclusivamente del criterio y veredicto del profesional de la salud.
          </Typography>
        </Box>

      </Paper>
    </Container>
  );

  // --- LÓGICA DE RENDERIZADO ---

  if (isAuthenticated) {
    return (
      <Layout>
        {contenidoPrincipal}
      </Layout>
    );
  }

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Navbar showingresa={false} showRegistrate={false} />
        {contenidoPrincipal}
        <Footer showIncorporaLugar={false} />
      </Box>
    </ThemeProvider>
  );
};

export default PoliticasPrivacidad;