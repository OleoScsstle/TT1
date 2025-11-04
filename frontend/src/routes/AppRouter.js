import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PlacePage from '../pages/PlacePage';
import DeseadosPage from '../pages/DeseadosPage';
import FavoritesPage from '../pages/FavoritesPage';
import Itinerary from '../pages/ItineraryPage';
import ItinerariesSavedPage from '../pages/ItinerariesSavedPage';
import TerminosCondiciones from '../pages/TerminosCondiciones';
import PoliticasPrivacidad from '../pages/PoliticasPrivacidad';
import ConfirmacionRegistro from '../pages/ConfirmacionRegistro';
import HistorialBusqueda from '../pages/HistoryPage';
import GenerarItinerario from '../pages/GenerarItinerario';
import CategoriasPage from '../pages/Categorias';
import ResumePage from '../pages/ResumenPage';
import RegisterPacientPage from '../pages/RegisterPacientPage'; 
import AdminPage from '../pages/Administrador'; 
import AdminPagePlaces from '../pages/AdministradorLugares'; 
import Perfil from '../pages/Perfil';
import Alcaldias from '../pages/AlcaldiasTotales';
import RecuperarContrasena from '../pages/RecuperarConstrasena';
import IngresarNuevaContrasena from '../pages/IngresarNuevaContrasena';
import AdminDash from '../pages/AdminDashboard';
import AllPlacesPage from '../pages/AllPlacesPage';
import PreferenciasModal from '../components/preferencias/PreferenciasModal';
import AdminSavedPlaces from '../pages/AdminSavedPlaces';
import ComenzarAnalisisPages from '../pages/comenzarAnalisisPage';
import MainPageLoggin from '../pages/Main-Loggin';  
import PerfilPaciente from '../pages/Perfil-Paciente';


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/deseados' element={<DeseadosPage />} />
        <Route path='/favoritos' element={<FavoritesPage />} />
        <Route path='/itinerary' element={<Itinerary />} />
        <Route path='/itinerariesSaved' element={<ItinerariesSavedPage/>} />
        <Route path='/HistoryPage' element={<HistorialBusqueda/>} />
        <Route path='/Categorias-page' element={<CategoriasPage/>} />
        <Route path='/terminos-condiciones' element={<TerminosCondiciones />} />
        <Route path='/politica-privacidad' element={<PoliticasPrivacidad />} />
        <Route path='/confirmacion-registro' element={<ConfirmacionRegistro />} />
        <Route path='/placepage' element={<PlacePage />} />
        <Route path='/generar-itinerario' element={<GenerarItinerario />} />
        <Route path='/resume-page' element={<ResumePage />}/>
        <Route path='/image-analysis' element={<RegisterPacientPage />}/>
        <Route path='/Admin-Page' element={<AdminPage />}/>
        <Route path='/Admin-Page-Places' element={<AdminPagePlaces />}/>
        <Route path='/perfil-page' element={<Perfil />}/>
        <Route path='/alcaldias' element={<Alcaldias/>} />
        <Route path='/recuperar-contrasena' element={<RecuperarContrasena />} />
        <Route path='/Admin-dashboard' element={<AdminDash/>} />
        <Route path='/all-places' element={<AllPlacesPage/>} />
        <Route path = '/preferencias' element={<PreferenciasModal/>} />
        <Route path='/Admin-SavedPlaces' element={<AdminSavedPlaces/>}/>
        <Route path='/Comenzar-Analisis' element={<ComenzarAnalisisPages/>}/>
        <Route path='/Main-Loggin' element={<MainPageLoggin/>}/>
        <Route path='/perfil-paciente/:id' element={<PerfilPaciente />} />
        <Route path="/reset-password/:uidb64/:token" element={<IngresarNuevaContrasena/>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;