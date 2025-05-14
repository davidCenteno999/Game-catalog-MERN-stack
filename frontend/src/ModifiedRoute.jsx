import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ModifiedRoute = () => {
    const { modified } = useAuth(); // Obtener datos del contexto
   


    // Verificar si el usuario es el propietario del juego
    if (!modified) {
        return <Navigate to="/" />;
    }

    // Si pasa todas las verificaciones, renderizar el contenido protegido
    return <Outlet />;
};

export default ModifiedRoute;