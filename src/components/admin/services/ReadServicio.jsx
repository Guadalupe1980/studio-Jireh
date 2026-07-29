import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";

function ReadServicio() {
  const [services, setServices] = useState([]); //todos los servicios de Supabase
  const [categories, setCategories] = useState([]); //todas las categorías
  const [selectedCategory, setSelectedCategory] = useState(""); //categoría elegida en el filtro
  const [loading, setLoading] = useState(true);
  const [errorMensage, setErrorMensage] = useState("");

  {/*Traemos los servicios desde supabase*/ }
  useEffect(() => {
    async function getData() {
      setLoading(true);
      setErrorMensage("");

      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select(
          `
        id, 
        category_id,
        name,
        description,
        duration_minutes,
        price,
        image_url,
        active,
        service_categories (
        id,
        name,
        slug)
        `,
        )
        .order("id", { ascending: true });

      if (servicesError) {
        console.error("Error al cargar los servicios:", servicesError);
        setErrorMensage("No se pudieron cargar los servicios");
        setLoading(false);
        return;
      }

      { /*Trae las categorías de supabase*/ }
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("service_categories")
        .select("id, name")
        .order("id", { ascending: true });

      if (categoriesError) {
        console.error("Error al cargar las categorias:", categoriesError);
        setErrorMensage("No se pudieron cargar la categorias");
        setLoading(false);
        return;
      }
      setServices(servicesData || []);
      setCategories(categoriesData || []);
      setLoading(false);
    }
    getData();
  }, []);

  {/*Filtro de servicios*/}
  const filteredServices = selectedCategory
  ? services.filter((service) => service.category_id === Number(selectedCategory),
  ) : services;

  return (
    <section className="min-h-screen bg-[#fbfaf8] px-5 py-10">
      <div className="mx-auto max-w-325">
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

          {/* Filtro de las categorias */}
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            >
              <option value="">Todas las categorías</option>
              {categories.map ((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Título secundario */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-slate-400">
            Todos los servicios registrados actualmente.
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="h-5 w-5 shrink-0 text-slate-400"
            >
              <path d="M183.5-183.5Q160-207 160-240t23.5-56.5Q207-320 240-320t56.5 23.5Q320-273 320-240t-23.5 56.5Q273-160 240-160t-56.5-23.5Zm0-240Q160-447 160-480t23.5-56.5Q207-560 240-560t56.5 23.5Q320-513 320-480t-23.5 56.5Q273-400 240-400t-56.5-23.5Zm0-240Q160-687 160-720t23.5-56.5Q207-800 240-800t56.5 23.5Q320-753 320-720t-23.5 56.5Q273-640 240-640t-56.5-23.5Zm240 0Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Zm240 0Q640-687 640-720t23.5-56.5Q687-800 720-800t56.5 23.5Q800-753 800-720t-23.5 56.5Q753-640 720-640t-56.5-23.5Zm-240 240Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5ZM520-160v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Z" />
            </svg>
          </p>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-800 sm:w-auto"
          >
            <span className="text-lg leading-none">+</span>
            Nuevo servicio
          </button>
        </div>

        {/*Estados de carga y error*/}
        {loading && (
          <p className="mt-10 text-center text-sm text-slate-400">
            Cargando servicios
            </p>
        )}

        {!loading && errorMensage && (
          <p className="mt-10 text-center text-sm text-red-500">
            {errorMensage}
          </p>
        )}

        {!loading && !errorMensage && filteredServices.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">
          No hay servicios registrados en esta categoría.
        </p>
        )}

        {/* Tarjetas*/}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredServices.map((service) => (

          <article key={service.id} className="group w-full overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Imagen */}
            <div className="relative h-52 overflow-hidden bg-rose-50">
              <img
                src={service.image_url}
                alt={`Servicio de ${service.name}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <span className={`absolute right-3 top-3 rounded-full bg-green-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700
                ${service.active
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-slate-500"
                }`}>
                  {service.active ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* Información */}
            <div className="p-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500">
                {service.service_categories?.name}
              </span>

              <h3 className="mt-2 font-serif text-xl text-rose-700">
                {service.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {service.description}
              </p>

              <div className="my-5 border-y border-rose-100 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Duración
                    </span>

                    <span className="mt-1 block text-sm font-medium text-slate-600">
                      {service.duration_minutes} min
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Precio
                    </span>

                    <span className="mt-1 block text-sm font-semibold text-rose-700">
                      ${Number(service.price).toLocaleString("es-MX")} MXN
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-12 26.5-17.5T705-840q16 0 31 6t27 18l55 56q12 11 17 26t5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Z" />
                  </svg>
                  Editar
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReadServicio;
