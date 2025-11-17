import React, { useState } from 'react';
import NavBarHome from '../components/NavBar';
import Footer from '../components/Footer';

// componentes
import InformacionHeader from '../components/perfil/InformacionHeader';
import InformacionPersonal from '../components/perfil/InformacionPersonal';

// estilos
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/Perfil.css';

// --- Importaciones Clave ---
import { Container, Alert, CircularProgress } from '@mui/material'; // <-- Añade CircularProgress
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs'; // <-- Importa dayjs
import axios from 'axios';

const Perfil = () => {
  const { user, isAuthenticated, token, isLoading } = useAuth(); // <-- Obtén 'isLoading'
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // --- 1. Muestra "Cargando..." mientras el AuthContext está verificando al usuario ---
  if (isLoading) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <div className="layout-page">
          <NavBarHome /* ...props... */ />
          <Container maxWidth="lg" sx={{ my: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Container>
          <Footer showIncorporaLugar={false} />
        </div>
      </ThemeProvider>
    );
  }

  // --- 2. Muestra error si no está logueado o no es un usuario válido ---
  if (!isAuthenticated || !user) {
    return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <div className="layout-page">
          <NavBarHome /* ...props... */ />
          <Container maxWidth="lg" sx={{ my: 6 }}>
            <Alert severity="error">No has iniciado sesión o no se pudo cargar tu perfil.</Alert>
          </Container>
          <Footer showIncorporaLugar={false} />
        </div>
      </ThemeProvider>
    );
  }

  // --- 3. Muestra error si es un usuario (ej. Admin) sin perfil de médico ---
  if (!user.medico_perfil) {
     return (
      <ThemeProvider theme={ThemeMaterialUI}>
        <div className="layout-page">
          <NavBarHome /* ...props... */ />
          <Container maxWidth="lg" sx={{ my: 6 }}>
            <Alert severity="error">Este perfil solo está disponible para médicos.</Alert>
          </Container>
          <Footer showIncorporaLugar={false} />
        </div>
      </ThemeProvider>
    );
  }

  // --- 4. Si todo está bien, extraemos los datos ---
  const medico = user.medico_perfil;

  const nombreCompleto = `${medico.nombre} ${medico.apellido}`.trim() || user.username;
  const correo = user.email || medico.correo || 'Sin correo registrado';
  const cedula = medico.cedula || 'Sin especificar';
  const celular = medico.telefono || ''; // 'celular' en InformacionPersonal espera esto
  const fechaNacimiento = medico.fecha_nacimiento || null;
  // --- 5. Tu función de actualización (ya es correcta) ---
  const handleActualizarMedico = async (datosActualizados) => {
    try {
      setMensaje('');
      setError('');

      /* Formatea la fecha antes de enviarla si cambió
      if (datosActualizados.fechaNacimiento) {
        datosActualizados.fecha_nacimiento = dayjs(datosActualizados.fechaNacimiento, 'DD-MM-YYYY').format('YYYY-MM-DD');
        delete datosActualizados.fechaNacimiento; // Renombra la clave
      }*/
      if (datosActualizados.fechaNacimiento) {
          datosActualizados.fecha_nacimiento = datosActualizados.fechaNacimiento;
          delete datosActualizados.fechaNacimiento;
      }
      
      // Renombra 'celular' a 'telefono' para el backend
      if (datosActualizados.celular) {
          datosActualizados.telefono = datosActualizados.celular;
          delete datosActualizados.celular;
      }

      const response = await axios.patch(
        'http://127.0.0.1:8000/api/medico/update/', // Esta URL es correcta
        datosActualizados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMensaje('✅ Datos actualizados correctamente. (Refresca la página para ver los cambios)');
        // Opcional: podrías actualizar el 'user' en AuthContext aquí
      } else {
        setError('No se pudieron actualizar los datos.');
      }
    } catch (err) {
      console.error('Error al actualizar el médico:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Ocurrió un error.';
      setError(`Error: ${errorMsg}`);
    }
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <div className="layout-page">
        <NavBarHome
          showingresa={false} // Ocultamos botones porque ya está logueado
          showRegistrate={false}
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
              'https://upload.wikimedia.org/wikipedia/commons/4/41/Siberischer_tiger_de_edit02.jpg' // Avatar estático por ahora
            }
            numeroPacientes={0} // TODO: Cargar esto desde la API
            analisisRealizados={0} // TODO: Cargar esto desde la API
          />

          {/* Información personal con función de actualización */}
          <InformacionPersonal
            correoElectronico={correo}
            nombre={medico.nombre || ''}
            apellido={medico.apellido || ''}
            fechaNacimiento={fechaNacimiento} // Formato DD-MM-YYYY o null
            celular={celular}
            cedula={cedula}
            onSave={handleActualizarMedico} // <-- Tu componente espera 'onSave'
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