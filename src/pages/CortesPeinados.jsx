import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

function CortesPeinados() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectImg, setSelectImg] = useState(null);

  useEffect(() => {
    async function getServices() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("services")
        .select(
          `
          id,
          name,
          description,
          duration_minutes,
          price,
          image_url,
          service_categories!inner (
            slug
          )
        `,
        )
        .eq("service_categories.slug", "cortes-peinados")
        .eq("active", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error al cargar los servicios:", error);

        setErrorMessage(
          "No se pudieron cargar los servicios. Intenta nuevamente.",
        );

        setLoading(false);
        return;
      }

      setServices(data || []);
      setLoading(false);
    }

    getServices();
  }, []);

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

        {/* Cargando */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <p className="text-sm text-stone-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="3rem"
                viewBox="0 -960 960 960"
                width="8rem"
                fill="black"
                className="animate-spin duration-300 items-center"
              >
                <path d="M522-80v-82q34-5 66.5-18t61.5-34l56 58q-42 32-88 51.5T522-80Zm-80 0Q304-98 213-199.5T122-438q0-75 28.5-140.5t77-114q48.5-48.5 114-77T482-798h6l-62-62 56-58 160 160-160 160-56-56 64-64h-8q-117 0-198.5 81.5T202-438q0 104 68 182.5T442-162v82Zm322-134-58-56q21-29 34-61.5t18-66.5h82q-5 50-24.5 96T764-214Zm76-264h-82q-5-34-18-66.5T706-606l58-56q32 39 51 86t25 98Z" />
              </svg>
              Cargando servicios...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && errorMessage && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <p className="text-sm text-stone-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="3rem"
                viewBox="0 -960 960 960"
                width="28rem"
                fill="black"
                className="animate-pulse duration-300 items-center"
              >
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q88 0 166.5 36T782-742L480-440v-360q-134 0-227 93t-93 227q0 134 93 227t227 93q69 0 132-28.5T720-270v110q-53 38-114 59T480-80Zm320-160v-320h80v320h-80Zm11.5 148.5Q800-103 800-120t11.5-28.5Q823-160 840-160t28.5 11.5Q880-137 880-120t-11.5 28.5Q857-80 840-80t-28.5-11.5Z" />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Sin servicios */}
        {!loading && !errorMessage && services.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-stone-500">
              No hay servicios disponibles actualmente.
            </p>
          </div>
        )}

        {/* Tarjetas */}
        {!loading && !errorMessage && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.id}
                className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-rose-100 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Imagen */}
                <div className="h-56 overflow-hidden bg-rose-50">
                  <img
                    src={service.image_url}
                    alt={`Servicio de ${service.name}`}
                    onClick={() => setSelectImg(service.image_url)}
                    className="h-full w-full object-cover transition duration-500 hover:scale-110 active:scale-105 cursor-pointer"
                  />
                </div>

                {/* Imagen amplia en mobil */}
                {selectImg && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectImg(null)}
                  >
                    <img
                      src={selectImg}
                      alt="imagen amplia"
                      className="max-h-[90vh] max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Información */}
                <div className="p-5">
                  {/* Nombre */}
                  <h2 className="font-serif text-xl uppercase tracking-[0.08em] text-rose-700">
                    {service.name}
                  </h2>

                  {/* Descripción */}
                  <p className="mt-3 text-xs italic leading-6 text-stone-500">
                    {service.description}
                  </p>

                  {/* Separador */}
                  <div className="my-5 h-px bg-rose-100"></div>

                  {/* Duración */}
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
                      Duración: {service.duration_minutes} min
                    </span>
                  </div>

                  {/* Precio */}
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Desde ${Number(service.price).toLocaleString("es-MX")} MXN
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CortesPeinados;
