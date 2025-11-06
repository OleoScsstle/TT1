import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import '../css/NavBar.css';
import logo from '../img/dashboard.png';
import avatar from '../img/userFoto.jpg';

// Componentes locales
import ButtonsMod from './ButtonsMod';
import { useAuth } from '../context/AuthContext'; 

function Navbar({ showingresa, showRegistrate, transparentNavbar, lightLink, staticNavbar }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => navigate('/login');
  const handleRegisterClick = () => navigate('/register');
  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // ✅ Determina qué nombre mostrar (más completo)
  const displayUserName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email
    : 'Usuario';

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          transparentNavbar ? 'position-fixed' : 'bg-light position-initial'
        } ${staticNavbar ? 'position-absolute' : ''}`}
      >
        <div className="mx-3 container-fluid">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img className="logo-img" src={logo} alt="Logo" />
          </Link>

          {/* Botón de colapso */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Enlaces del menú */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/image-analysis">Análisis</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/about">Sobre nosotros</Link>
              </li>
            </ul>

            {/* Lógica condicional: logueado vs no logueado */}
            {isAuthenticated ? (
              <>
                {/* --- Pantallas grandes --- */}
                <div className="d-none d-lg-flex align-items-center justify-content-end">
                  <div className="order-lg-1 text-end me-2">
                    <div>Bienvenido</div>
                    <div className="fw-bold">{displayUserName}</div>
                  </div>
                  <div className="order-lg-1">
                    <img
                      src={avatar}
                      alt="Perfil"
                      className="rounded-circle"
                      width="50"
                      height="50"
                    />
                  </div>
                  <div className="order-lg-2 dropdown">
                    <button
                      onClick={toggleMenu}
                      aria-expanded={menuOpen}
                      data-bs-toggle="dropdown"
                      id="userDropdown"
                      className="nav-link p-0 d-flex align-items-center bg-transparent border-0"
                    >
                      <i className={`bi ms-1 ${menuOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><Link className="dropdown-item" to="/perfil-page">Mi Perfil</Link></li>
                      <li><Link className="dropdown-item" to="/itinerariesSaved">Buscar paciente</Link></li>
                      <li><Link className="dropdown-item" to="/image-analysis">Análisis de imágenes</Link></li>
                      <li><Link className="dropdown-item" to="/Comenzar-Analisis">Comenzar Análisis</Link></li>
                      <li><Link className="dropdown-item" to="/Main-Loggin">Mis pacientes</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogoutClick}>Cerrar Sesión</button></li>
                    </ul>
                  </div>
                </div>

                {/* --- Pantallas pequeñas --- */}
                <div className="d-lg-none">
                  <hr className="my-3" />
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <span className={`nav-link fw-bold ${lightLink ? 'blanco' : ''}`}>
                        Hola, {displayUserName}
                      </span>
                    </li>
                    <li><Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/perfil-page">Mi Perfil</Link></li>
                    <li><Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/itinerariesSaved">Buscar paciente</Link></li>
                    <li><Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/image-analysis">Análisis de imágenes</Link></li>
                    <li><Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/Comenzar-Analisis">Comenzar Análisis</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className={`nav-link btn btn-link ${lightLink ? 'blanco' : ''}`}
                        onClick={handleLogoutClick}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {showingresa && (
                  <Box>
                    <ButtonsMod
                      variant="secundario"
                      textCont="Ingresa"
                      width="6rem"
                      height="2.rem"
                      clickEvent={handleLoginClick}
                    />
                  </Box>
                )}
                {showRegistrate && (
                  <Box className="ms-1">
                    <ButtonsMod
                      variant="principal"
                      textCont="Regístrate"
                      width="6rem"
                      height="2.rem"
                      clickEvent={handleRegisterClick}
                    />
                  </Box>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
