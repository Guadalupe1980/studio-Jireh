

function Login() {
  function handleSubmit(event) {
    event.preventDefault();

    // Aquí irá posteriormente la función para iniciar sesión
  }

  return (
    <section className="min-h-screen bg-[#f8f5f6] px-4 py-10 sm:py-3">
      <div className="mx-auto max-w-sm overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_20px_60px_rgba(93,56,68,0.15)]">
        {/* Encabezado */}
        <div className="px-6 pb-8 pt-7 text-center sm:px-8">
          <img
            src="/logo-jireh.png"
            alt="Logo del Estudio de Belleza Jireh"
            className="mx-auto h-auto w-44"
          />

          <h1 className="mt-5 font-serif text-3xl font-medium text-gray-900">
            Admin Access
          </h1>

          <p className="mt-2 text-xs tracking-wide text-gray-500">
            Portal seguro para la administración del estudio
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-rose-100 bg-[#fbfaf8] px-6 py-8 sm:px-8"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-left text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700"
            >
              Email Address
            </label>

            <input
              type="email"
              name="email"
              id="email"
              placeholder="autora@jirehbeauty.com"
              autoComplete="email"
              required
              className="
                mt-2 w-full rounded-md border border-gray-200 bg-white
                px-4 py-3 text-sm text-gray-700 outline-none
                transition duration-300 placeholder:text-gray-400
                focus:border-rose-500 focus:ring-2 focus:ring-rose-100
              "
            />
          </div>

          {/* Contraseña */}
          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="password"
                className="text-left text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700"
              >
                Password
              </label>

              <button
                type="button"
                className="text-[10px] font-medium text-gray-500 transition hover:text-rose-700"
              >
                Forgot password?
              </button>
            </div>

            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="
                mt-2 w-full rounded-md border border-gray-200 bg-white
                px-4 py-3 text-sm text-gray-700 outline-none
                transition duration-300 placeholder:text-gray-400
                focus:border-rose-500 focus:ring-2 focus:ring-rose-100
              "
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="
              mt-8 w-full rounded-md bg-rose-700 px-5 py-4
              text-xs font-bold uppercase tracking-[0.14em] text-white
              shadow-md transition duration-300
              hover:-translate-y-0.5 hover:bg-rose-800 hover:shadow-lg
              active:translate-y-0
            "
          >
            Login to portal
          </button>

          {/* Texto inferior */}
          <div className="mt-6 border-t border-gray-200 pt-5 text-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-400">
              Acceso exclusivo para personal autorizado
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
