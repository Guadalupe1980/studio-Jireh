function ReadServicio() {
  return (
    <section className="min-h-screen bg-[#fbfaf8] px-5 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="flex flex-col gap-6 border-b border-rose-100 pb-6 md:flex-row md:items-end md:justify-between">
          <article>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
              Administración
            </span>

            <h1 className="mt-2 font-serif text-4xl font-medium text-rose-700">
              Vista de todos los servicios
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Consulta y administra los servicios disponibles dentro del
              catálogo de Jireh.
            </p>
          </article>

          {/* Filtro */}
          <div className="w-full md:w-64">
            <label
              htmlFor="filterCat"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Filtrar por categoría
            </label>

            <select
              name="filterCat"
              id="filterCat"
              className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Cortes y Peinados">Cortes y Peinados</option>
              <option value="Coloracion">Coloracion</option>
              <option value="Extensiones">Extensiones</option>
              <option value="Tratamientos Capilares">Tratamientos Capilares</option>
              <option value="Maquillaje">Maquillaje</option>
            </select>
          </div>
        </div>

        {/* Aquí irá el listado */}
        <div className="mt-8">
          <div className="rounded-xl border border-dashed border-rose-200 bg-white px-6 py-10 text-center">
            <p className="text-sm text-slate-400">
              Aquí se mostrarán los servicios registrados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReadServicio;
