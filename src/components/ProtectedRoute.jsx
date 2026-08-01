import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  // Esperamos mientras Supabase revisa la sesión
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf8]">
        <p className="text-sm font-medium text-rose-700">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // Si no existe usuario, lo manda al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si existe usuario, muestra la ruta protegida
  return <Outlet />;
}

export default ProtectedRoute;
