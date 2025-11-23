import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Si YA está autenticado, no debería ver el Login. Lo mandamos a su dashboard.
  if (isAuthenticated) {
    if (user?.is_staff) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Redirige al dashboard de médico (confirma si tu ruta es /main-page o /dashboard-medico)
    return <Navigate to="/main-page" replace />;
  }

  // Si NO está autenticado, le dejamos ver el Login/Registro
  return children ? children : <Outlet />;
};

export default PublicRoute;