import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Contexto y Protecciones ---
// Nota los '../' para salir de la carpeta 'routes'
import { AuthProvider } from '../context/AuthContext'; 
import PublicRoute from '../components/PublicRoute';
import ProtectedRoute from '../components/ProtectedRoute';

// --- Páginas ---
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RecuperarContrasena from '../pages/RecuperarConstrasena';
import IngresarNuevaContrasena from '../pages/IngresarNuevaContrasena';
import DashboardMedico from '../pages/DashboardMedico';
import AdminPage from '../pages/AdminPage';
import Perfil from '../pages/Perfil';
import PerfilPaciente from '../pages/Perfil-Paciente';
import NuevoAnalisis from '../pages/NuevoAnalisis';
import RegistrarNuevoPaciente from '../pages/RegisterPacientPage';
import TerminosCondiciones from '../pages/TerminosCondiciones';
import PoliticasPrivacidad from '../pages/PoliticasPrivacidad';
import ConfirmacionRegistro from '../pages/ConfirmacionRegistro';
import GenerarCita from '../pages/GenerarCita';
import AgendaPage from '../pages/AgendaPage';

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>          
          {/* =========================================
              RUTAS DE ACCESO LIBRE
             ========================================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/politica-privacidad" element={<PoliticasPrivacidad />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/reset-password/:uidb64/:token" element={<IngresarNuevaContrasena />} />
          <Route path="/confirmacion-registro" element={<ConfirmacionRegistro />} />
          <Route path="/proximas-citas" element={<AgendaPage />} />

          {/* =========================================
              RUTAS "PÚBLICAS" RESTRINGIDAS (Login/Registro)
             ========================================= */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* =========================================
              RUTAS PROTEGIDAS (Dashboard, Análisis, etc.)
             ========================================= */}
          <Route element={<ProtectedRoute />}>
            
            {/* --- Rutas Médico --- */}
            <Route path="/dashboard-medico" element={<DashboardMedico />} />
            <Route path="/main-page" element={<DashboardMedico />} /> 
            
            <Route path="/perfil-page" element={<Perfil />} />
            <Route path="/perfil-paciente/:id" element={<PerfilPaciente />} />
            
            <Route path="/registrar-paciente" element={<RegistrarNuevoPaciente />} />
            <Route path="/generar-cita" element={<GenerarCita />} />
            
            {/* Ruta de análisis */}
            <Route path="/comenzar-analisis" element={<NuevoAnalisis />} />
            <Route path="/image-analysis" element={<NuevoAnalisis />} />

            {/* --- Rutas Admin --- */}
            <Route path="/admin/dashboard" element={<AdminPage />} />
            <Route path="/admin/validaciones" element={<AdminPage />} />
            <Route path="/admin/medicos" element={<AdminPage />} />
            <Route path="/admin/pacientes" element={<AdminPage />} />

          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;