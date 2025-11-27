import '../css/Footer.css';
import { Link } from 'react-router-dom';
import React from 'react'; // Necesario si no lo tienes importado antes

function Footer({ showIncorporaLugar }) {
  return (
    <footer className='footer rosaMexicano text-center text-lg-start'>
      <div className='container p-4'>
        <section>
          <div className='row'>
            
            {/* === COLUMNA 1: INTRO Y DESCRIPCIÓN === */}
            <div className='col-md-3 col-lg-3 col-xl-3 mx-auto mt-3'>
              <h6>Mapeo Rosa</h6>
              <p>
                Realiza los análisis de una forma más rápida y sencilla que ayuden a más pacientes.
              </p>
            </div>

            <hr className='w-100 clearfix d-md-none' />

            {/* === COLUMNA 2: ENLACES RÁPIDOS (REFORMULADA) === */}
            <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mt-3 explore-links'>
              <h6>Enlaces Rápidos</h6>
                              
              {/* Mostrar el enlace de incorporar lugar si showIncorporaLugar es verdadero */}
              {showIncorporaLugar && (
                <p><Link to='/'>Incorpora un Lugar</Link></p>
              )}

              <p><Link to='/terminos-condiciones'>Terminos y Condiciones</Link></p>
            </div>

            <hr className='w-100 clearfix d-md-none' />

            {/* === COLUMNA 3: CONTACTO === */}
            <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mt-3 contact-info'>
              <h6>Contacto</h6>
              <p><i className='bi bi-house-fill'></i> Ciudad de México, México</p>
              <p><i className='bi bi-envelope-fill'></i> contacto@sistemadeapoyo.com</p>
              <p><i className='bi bi-telephone-fill'></i> +52 55 5555 5555</p>
            </div>

            {/* === COLUMNA 4: REDES SOCIALES (FILTRADA) === */}
            <div className='col-md-3 col-lg-2 col-xl-2 mx-auto mt-3 social-media'>
              <h6>Síguenos</h6>
              
              {/* LOGO FACEBOOK (bi bi-facebook) */}
              <Link className='btn btn-primary btn-floating facebook' to='/' role='button'>
                <i className='bi bi-facebook'></i>
              </Link>
              
              {/* LOGO INSTAGRAM (bi bi-instagram) */}
              <Link className='btn btn-primary btn-floating instagram' to='/' role='button'>
                <i className='bi bi-instagram'></i>
              </Link>
              
              {/* Eliminados: Twitter, Google, LinkedIn, GitHub */}
            </div>
          </div>
        </section>
      </div>

      {/* === COPYRIGHT === */}
      <div className='copyright'>
        © {new Date().getFullYear()} CDMX
      </div>
    </footer>
  );
}

export default Footer;