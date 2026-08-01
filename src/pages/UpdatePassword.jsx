import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

function UpdatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    //verifica si la contraseña coincide
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    //verifica si cumple con los 8 caracteres
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    //manda la actualizacion a supabase
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Error al cambiar la contraseña:", error);

      setErrorMessage(
        "No se pudo cambiar la contraseña. Abre nuevamente el enlace recibido.",
      );

      setLoading(false);
      return;
    }

    // Cerramos la sesión para ingresar con la contraseña nueva
    await supabase.auth.signOut();

    setLoading(false);

    navigate("/login", {
      replace: true,
      state: {
        passwordUpdated: true,
      },
    });
  }

  return (
    <section className="min-h-screen bg-[#f8f5f6] px-4 py-10">
      <div className="mx-auto mt-10 max-w-sm overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_20px_60px_rgba(93,56,68,0.15)]">
        {/* Encabezado */}
        <div className="px-6 pb-8 pt-7 text-center sm:px-8">
          <img
            src="/logo-jireh.png"
            alt="Logo del Estudio de Belleza Jireh"
            className="mx-auto h-auto w-44"
          />

          <h1 className="mt-5 font-serif text-3xl font-medium text-gray-900">
            Cambiar contraseña
          </h1>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Escribe y confirma tu nueva contraseña.
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-rose-100 bg-[#fbfaf8] px-6 py-8 sm:px-8"
        >
          {/* Nueva contraseña */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-left text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700"
            >
              Nueva contraseña
            </label>

            <input
              id="newPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="
                mt-2 w-full rounded-md border border-gray-200
                bg-white px-4 py-3 text-sm text-gray-700
                outline-none transition placeholder:text-gray-400
                focus:border-rose-500 focus:ring-2
                focus:ring-rose-100
              "
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="mt-6">
            <label
              htmlFor="confirmPassword"
              className="block text-left text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700"
            >
              Confirmar contraseña
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="
                mt-2 w-full rounded-md border border-gray-200
                bg-white px-4 py-3 text-sm text-gray-700
                outline-none transition placeholder:text-gray-400
                focus:border-rose-500 focus:ring-2
                focus:ring-rose-100
              "
            />
          </div>

          {errorMessage && (
            <p className="mt-4 text-center text-sm font-medium text-red-500">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-8 w-full rounded-md bg-rose-700 px-5 py-4
              text-xs font-bold uppercase tracking-[0.14em]
              text-white shadow-md transition
              hover:bg-rose-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Guardando contraseña..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UpdatePassword;
