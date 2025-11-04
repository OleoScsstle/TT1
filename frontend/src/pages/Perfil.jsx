import React from 'react';
import NavBarHome from '../components/NavBar';
import Footer from '../components/Footer';

// componentes
import InformacionHeader from '../components/perfil/InformacionHeader';
import InformacionPersonal from '../components/perfil/InformacionPersonal';

// estilos
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/Perfil.css';

import { Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';

// ✅ Importamos el contexto de autenticación
import { useAuth } from '../context/AuthContext';

const Perfil = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p>No se encontró información del usuario o no has iniciado sesión.</p>
      </div>
    );
  }

  // ✅ Generamos el nombre completo igual que en el NavBar
  const nombreCompleto =
    `${user.first_name || user.nombre || ''} ${user.last_name || user.apellido || ''}`.trim() ||
    user.username ||
    user.email ||
    'Usuario';

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <div className="layout-page">
        <NavBarHome
          showingresa={true}
          showRegistrate={true}
          transparentNavbar={false}
          lightLink={false}
        />

        {/* Cover superior */}
        <Box className="perfil-usuario-background" />

        <Container maxWidth="lg" className="md-4 layout-main">
          {/* Header del perfil del médico */}
          <InformacionHeader
            nombreUsuario={nombreCompleto}
            avatar={
              user.avatar ||
              'https://upload.wikimedia.org/wikipedia/commons/4/41/Siberischer_tiger_de_edit02.jpg'
            }
            numeroPacientes={user.numeroPacientes || 46}
            analisisRealizados={user.analisisRealizados || 23}
          />

          {/* Información personal */}
          <InformacionPersonal
            correoElectronico={user.email || user.correo}
            nombre={user.first_name || user.nombre || ''}
            apellido={user.last_name || user.apellido || ''}
            fechaNacimiento={user.fecha_nacimiento || null}
            cedula={user.cedula || 'Sin especificar'}
          />
        </Container>

        <Footer showIncorporaLugar={false} />
      </div>
    </ThemeProvider>
  );
};

export default Perfil;
