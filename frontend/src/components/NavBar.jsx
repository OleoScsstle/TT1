import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
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

  // Nombre del usuario para mostrar
  const displayUserName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Usuario';

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          transparentNavbar ? 'position-fixed' : 'bg-light position-initial'
        } ${staticNavbar ? 'position-absolute' : ''}`}
      >
        <div className="mx-3 container-fluid">
          
          {/* LOGO */}
          <Link 
            className="navbar-brand d-flex align-items-center" 
            to={isAuthenticated ? "/main-page" : "/"}
            style={{ textDecoration: 'none' }}
          >
            <img className="logo-img" src={logo} alt="Logo" />
            
            {/* Nombre del sistema solo si está logueado */}
            {isAuthenticated && (
              <Typography 
                variant="h6" 
                noWrap
                sx={{ 
                  ml: 1.5,
                  fontWeight: 'bold',
                  color: '#E4007C',
                  letterSpacing: '.05rem',
                  fontFamily: '"Montserrat", sans-serif',
                  display: { xs: 'none', sm: 'block' } 
                }}
              >
                Mapeo Rosa
              </Typography>
            )}
          </Link>

          {/* Botón hamburguesa */}
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

          <div className="collapse navbar-collapse" id="navbarContent">
            
            {/* ENLACES CENTRALES (Solo visibles si NO estás logueado) */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/">
                      Inicio
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${lightLink ? 'blanco' : ''}`} href="/#sobre-nosotros">
                      Sobre Nosotros
                    </a>
                  </li>
                  {/* Enlaces Legales */}
                  <li className="nav-item">
                    <Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/terminos-condiciones">
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/politica-privacidad">
                      Aviso de Privacidad
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* SECCIÓN DERECHA */}
            {isAuthenticated ? (
              <>
                {/* --- Vista Escritorio --- */}
                <div className="d-none d-lg-flex align-items-center justify-content-end">
                  <div className="order-lg-1 text-end me-2">
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Bienvenido</div>
                    <div className="fw-bold" style={{ color: '#2c3e50' }}>{displayUserName}</div>
                  </div>
                  <div className="order-lg-1">
                    <img
                      src={avatar}
                      alt="Perfil"
                      className="rounded-circle"
                      width="45"
                      height="45"
                      style={{ objectFit: 'cover', border: '2px solid #E4007C' }}
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
                      <i className={`bi ms-1 ${menuOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`} style={{ color: '#E4007C' }}></i>
                    </button>
                    
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><Link className="dropdown-item" to="/perfil-page">Mi Perfil</Link></li>
                      <li><Link className="dropdown-item" to="/main-page">Dashboard</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogoutClick}>Cerrar Sesión</button></li>
                    </ul>
                  </div>
                </div>

                {/* --- Vista Móvil --- */}
                <div className="d-lg-none">
                  <hr className="my-3" />
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <span className={`nav-link fw-bold ${lightLink ? 'blanco' : ''}`} style={{ color: '#E4007C' }}>
                        {displayUserName}
                      </span>
                    </li>
                    <li><Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/main-page">Dashboard</Link></li>
                    <li><Link className={`nav-link ${lightLink ? 'blanco' : ''}`} to="/perfil-page">Mi Perfil</Link></li>
                    <li>
                      <button
                        className={`nav-link btn btn-link text-start ${lightLink ? 'blanco' : ''}`}
                        onClick={handleLogoutClick}
                        style={{ textDecoration: 'none' }}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              /* --- Vista Pública (Botones) --- */
              <>
                {showingresa && (
                  <Box>
                    <ButtonsMod
                      variant="secundario"
                      textCont="Ingresa"
                      width="6rem"
                      height="2rem"
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
                      height="2rem"
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