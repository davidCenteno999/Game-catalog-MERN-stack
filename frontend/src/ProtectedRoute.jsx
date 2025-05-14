import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated , loading } = useAuth(); // Obtiene el estado de autenticación y el usuario del contexto
  
  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras se verifica la autenticación
  }
  if (!isAuthenticated && !loading)  {
    return <Navigate to="/login" replace />; // Redirige a la página de inicio de sesión si no hay usuario
  }

  return <Outlet />; // Renderiza el componente hijo si hay un usuario
}

export default ProtectedRoute;