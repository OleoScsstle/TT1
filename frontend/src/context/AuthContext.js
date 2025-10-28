import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('accessToken') || null,
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: true,
  });

  const fetchUserProfile = async (token) => {
    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }
    console.log("Intentando obtener perfil con token:", token);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:8000/api/profile/', config);

      console.log("Perfil obtenido:", response.data);
      setAuthState(prev => ({
        ...prev,
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error al obtener el perfil:", error.response?.data || error.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile(token);
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []); // Se ejecuta solo una vez al montar

  // Función para Iniciar Sesión
  const login = (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAuthState(prev => ({
        ...prev,
        token: access,
        isAuthenticated: true,
        isLoading: true,
    }));
    fetchUserProfile(access); // Llama a la función para obtener los datos del usuario
    console.log("Usuario logueado, token guardado. Obteniendo perfil...");
  };

  // Función para Cerrar Sesión
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    console.log("Usuario deslogueado, tokens eliminados.");
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  if (authState.isLoading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;