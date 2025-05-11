import React, { useState } from 'react';
import angelImage from '../img/HomePage/angel.jpeg';
import screening from '../img/HomePage/Ilustration.webp';
import '../css/HomePage.css';


function PreguntaRegistro() {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Simula el estado de registro del usuario

    return (
        <div className="w-100 pr-0">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 p-3 pr-1" >
                        <div className="row">
                            <div className="col-12 col-md-7 d-flex flex-column justify-content-center pr-2" >
                                <h2 className="pregunta">
                                    {isLoggedIn ? '¡Bienvenido!' : '¿Ya te encuentras registrado?'}
                                </h2>
                                <div className="pr-pitch">
                                    {isLoggedIn ? (
                                        <>
                                            <p>
                                                ¡Descubre las funcionalidades de nuestro sistema y realiza los análisis que ayuden a más gente! Con nuestro sistema, puedes tener una base solida para el diagnostico de cada paciente!
                                            </p>

                                            <p>
                                                Aprovecha todas las herramientas que hemos desarrollado para ayudar a especialistas a tener un mejor panorama sobre la situación de cada paciente.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                ¡Regístrate ahora y lleva la organización de tus viajes al siguiente nivel! Nuestra app te permite
                                                crear un itinerario personalizado de manera fácil y rápida, ayudándote a disfrutar de cada destino al máximo.
                                                Con una cuenta, tendrás acceso a herramientas exclusivas para que planear sea tan emocionante como el viaje mismo.
                                            </p>
                                            <p>
                                                No dejes que la falta de planificación te haga perder momentos únicos. <strong>¡Regístrate ahora y comienza a crear el itinerario de tus sueños!</strong>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                                <img
                                    src={screening}
                                    alt="Ángel de la independencia"
                                    className="img-fluid pr-img"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreguntaRegistro;
