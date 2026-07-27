function CortesPeinados() {
  return (
    <section className="min-h-screen bg-[#fbfaf8] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="mb-10 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-rose-700">
            Servicios especializados
          </span>

          <h1 className="mt-3 font-serif text-4xl text-rose-700 md:text-5xl">
            Cortes y peinados
          </h1>

          <div className="mx-auto mt-5 h-0.5 w-20 bg-rose-700"></div>
        </div>

        {/* Contenedor de tarjetas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tarjeta 1 */}
          <article className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-rose-100 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-56 overflow-hidden bg-rose-50">
              <img
                src="https://imgs.search.brave.com/inyjyhI7Lcpn_TaxKLpeG7ZH-V4OlRfRnuhZNZzJFl8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/cHJpbWVyLXBsYW5v/LXZlcnRpY2FsLXBl/bHVxdWVyby1jb3J0/YW5kby1wZWxvLWNv/cnRvLW11amVyLXNh/bG9uLWJlbGxlemFf/MTgxNjI0LTIxMDY4/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA"
                alt="Servicio de corte para dama"
                className="h-full w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>

            <div className="p-5">
              <h2 className="font-serif text-xl uppercase tracking-[0.08em] text-rose-700">
                Corte para dama
              </h2>

              <p className="mt-3 text-xs italic leading-6 text-stone-500">
                Corte personalizado según tu estilo, tipo de rostro y
                preferencias.
              </p>

              <div className="my-5 h-px bg-rose-100"></div>

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-4 w-4 text-stone-400"
                  aria-hidden="true"
                >
                  <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>

                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400">
                  Duración: 60 min
                </span>
              </div>

              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                Desde $350 MXN
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CortesPeinados;
