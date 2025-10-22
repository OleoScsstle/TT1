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

const Perfil = () => {
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <div className="layout-page">
        <NavBarHome
          showingresa={true}
          showRegistrate={true}
          transparentNavbar={false}
          lightLink={false}
        />

        {/* Cover superior (como en el mock) */}
        <Box className="perfil-usuario-background" />

        <Container maxWidth="lg" className="md-4 layout-main">
          {/* Header del perfil del MÉDICO */}
          <InformacionHeader
            nombreUsuario="nombreMedico"
            avatar="https://upload.wikimedia.org/wikipedia/commons/4/41/Siberischer_tiger_de_edit02.jpg"
            numeroPacientes={46}
            analisisRealizados={23}
          />

          {/* Información Personal */}
          <InformacionPersonal
            correoElectronico="uncorreo@gmail.com"
            nombre=""
            apellido=""
            fechaNacimiento={null}
            cedula=""
          />

        </Container>

        <Footer showIncorporaLugar={false} />
      </div>
    </ThemeProvider>
  );
};

export default Perfil;
