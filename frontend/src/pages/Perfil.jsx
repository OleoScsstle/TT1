import React, { useState } from 'react';
import NavBarHome from '../components/NavBar';
import Footer from '../components/Footer';

// componentes
import InformacionHeader from '../components/perfil/InformacionHeader';
import InformacionPersonal from '../components/perfil/InformacionPersonal';

// estilos
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/Perfil.css';

import { Container, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';

// ✅ Importamos el contexto de autenticación
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Perfil = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  if (!isAuthenticated || !user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p>No se encontró información del usuario o no has iniciado sesión.</p>
      </div>
    );
  }

  // --- 📦 Extraemos datos del perfil médico (si existen)
  const medico = user.medico_perfil || {};

  // --- 🧠 Generamos el nombre completo
  const nombreCompleto =
    `${user.first_name || medico.nombre || ''} ${user.last_name || medico.apellido || ''}`.trim() ||
    user.username ||
    user.email ||
    'Usuario';

  // --- 📧 Determinamos correo y cédula
  const correo = user.email || medico.correo || 'Sin correo registrado';
  const cedula = medico.cedula || 'Sin especificar';

  // --- 🧩 Función para actualizar datos del médico (llamada desde InformacionPersonal)
  const handleActualizarMedico = async (datosActualizados) => {
    try {
      setMensaje('');
      setError('');
      const response = await axios.patch(
        'http://127.0.0.1:8000/api/medico/update/',
        datosActualizados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMensaje('✅ Datos actualizados correctamente');
      } else {
        setError('No se pudieron actualizar los datos.');
      }
    } catch (err) {
      console.error('Error al actualizar el médico:', err);
      setError('Ocurrió un error al intentar actualizar los datos.');
    }
  };

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
            numeroPacientes={medico.numeroPacientes || 46}
            analisisRealizados={medico.analisisRealizados || 23}
          />

          {/* Información personal con función de actualización */}
          <InformacionPersonal
            correoElectronico={correo}
            nombre={user.first_name || medico.nombre || ''}
            apellido={user.last_name || medico.apellido || ''}
            fechaNacimiento={user.fecha_nacimiento || null}
            cedula={cedula}
            onActualizar={handleActualizarMedico} // 👈 le pasamos la función
          />

          {mensaje && <Alert severity="success" sx={{ mt: 3 }}>{mensaje}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
        </Container>

        <Footer showIncorporaLugar={false} />
      </div>
    </ThemeProvider>
  );
};

export default Perfil;
