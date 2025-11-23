import React from 'react';
import { Box } from '@mui/material';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { ThemeProvider } from '@mui/material/styles';
import ThemeMaterialUI from './ThemeMaterialUI'; // Asegúrate de la ruta

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* 1. Navbar Fijo Arriba */}
        <Navbar
          showingresa={false}
          showRegistrate={false}
          transparentNavbar={false}
          lightLink={false}
          staticNavbar={false}
        />

        {/* 2. Contenedor Central (Sidebar + Contenido) */}
        <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f8f9fa' }}>
          
          {/* Sidebar Izquierdo (Visible solo en desktop por el CSS del componente) */}
          <Sidebar />

          {/* Área de Contenido de la Página */}
          <Box 
            component="main" 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              overflowX: 'hidden',
              position: 'relative'
            }}
          >
             {/* Aquí se renderiza la página específica (Dashboard, Perfil, etc.) */}
             <Box sx={{ flex: 1 }}>
                {children}
             </Box>
             
             {/* Footer al final del contenido */}
             <Footer showIncorporaLugar={false} /> 
          </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;