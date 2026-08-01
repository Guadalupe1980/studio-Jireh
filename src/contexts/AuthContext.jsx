import { createContext } from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); //Indica si existe un usuario autenticado.
  const [loading, setLoading] = useState(true);

  //Iniciar Sesion (manda los datos a supabase)
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    setUser(data.user);

    return data.user;
  }

  //Cerrar Sesion activa
  async function logout() {
    const { error } = await supabase.auth.signOut({
        scope: "local"
    });

    if (error) {
      throw error;
    }
    setUser(null);
  }

  // Escuchar si el usuario inicia o cierra sesión
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //se comparten todos los valores
  const value ={user, login, logout, loading}

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

export {AuthContext, AuthProvider}
