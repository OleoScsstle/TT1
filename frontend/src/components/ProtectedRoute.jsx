import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Mientras verifica el estado de la sesión, mostramos el spinner
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // 2. LOGICA DE PROTECCIÓN:
  // Si terminó de cargar y NO hay usuario autenticado, te manda al HomePage ("/")
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado, te deja pasar
  return children ? children : <Outlet />;
};

export default ProtectedRoute;