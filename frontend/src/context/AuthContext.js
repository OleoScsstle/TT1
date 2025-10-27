import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Import axios para futuras llamadas (ej. perfil de usuario)

// 1. Crear el Contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Crear el Proveedor (AuthProvider)
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('accessToken') || null, // Token de acceso
    user: null, // Información del usuario (la obtendremos después)
    isAuthenticated: !!localStorage.getItem('accessToken'), // Booleano: ¿está logueado?
  });

  // Efecto para verificar el token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Opcional: Podrías verificar si el token sigue siendo válido aquí
      // haciendo una petición a una ruta protegida del backend.
      // Por ahora, solo asumimos que si hay token, está autenticado.
      setAuthState({
        token: token,
        user: null, // Aún no cargamos los datos del usuario
        isAuthenticated: true,
      });
      // TODO: Cargar datos del usuario desde el backend usando el token
    }
  }, []);

  // Función para Iniciar Sesión
  const login = (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAuthState({
      token: access,
      user: null, // Aún no cargamos los datos del usuario
      isAuthenticated: true,
    });
    // TODO: Cargar datos del usuario desde el backend
    console.log("Usuario logueado, token guardado.");
  };

  // Función para Cerrar Sesión
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    console.log("Usuario deslogueado, tokens eliminados.");
    // Opcional: Redirigir al login
    // navigate('/login'); // Necesitarías importar useNavigate aquí o manejarlo en el componente que llama a logout
  };

  // 3. Valor que proveerá el contexto
  const value = {
    ...authState, // Pasa el token, user, isAuthenticated
    login,
    logout,
  };

  // 4. Renderizar el proveedor con los children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; // Exporta el contexto por si se necesita directamente