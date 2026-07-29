import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

function DashboardAdmin() {
  const [categories, setCategories] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [visitsError, setVisitsError] = useState("");

  useEffect(() => {
    async function getCategoryVisits() {
      setLoadingVisits(true);
      setVisitsError("");

      const { data, error } = await supabase
        .from("service_categories")
        .select("id, name, slug, visits")
        .order("visits", { ascending: false });

      if (error) {
        console.error("Error al cargar las visitas:", error);
        setVisitsError("No se pudieron cargar las estadísticas.");
        setLoadingVisits(false);
        return;
      }

      setCategories(data || []);
      setLoadingVisits(false);
    }

    getCategoryVisits();
  }, []);

  /*
    Buscamos cuál categoría tiene más visitas.

    Ejemplo:
    Cortes = 120
    Coloración = 80

    maxVisits = 120
  */
  const maxVisits = Math.max(
    ...categories.map((category) => category.visits || 0),
    1,
  );

  return (
    <main className="min-h-screen bg-[#fbfaf8] px-5 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <section className="mb-12">
          <h1 className="max-w-md font-serif text-4xl font-medium leading-tight text-rose-700 md:text-5xl">
            Panel de Control
            <span className="block">Admin</span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Bienvenido al núcleo de gestión de Jireh Beauty. Aquí puedes
            supervisar tu estética y promociones.
          </p>
        </section>

        {/* Métricas */}
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Servicios totales */}
          <article className="relative min-h-48 overflow-hidden border border-rose-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Servicios totales
            </p>

            <span className="mt-2 block font-serif text-4xl font-semibold text-rose-700">
              8
            </span>

            <div className="mt-10 flex items-center gap-1 text-xs font-medium text-rose-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="m120-240 240-240 160 160 280-320v200h80v-336H544v80h202L520-438 360-598 64-302l56 62Z" />
              </svg>

              <span>+2 este mes</span>
            </div>

            {/* Icono decorativo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="absolute -bottom-1 -right-2 h-28 w-28 text-rose-100"
              aria-hidden="true"
            >
              <path d="M760-120 480-400l-94 94q8 15 11 32t3 34q0 66-47 113T240-80q-66 0-113-47T80-240q0-66 47-113t113-47q17 0 34 3t32 11l94-94-94-94q-15 8-32 11t-34 3q-66 0-113-47T80-720q0-66 47-113t113-47q66 0 113 47t47 113q0 17-3 34t-11 32l494 494v40H760ZM600-520l-80-80 240-240h120v40L600-520ZM296.5-663.5Q320-687 320-720t-23.5-56.5Q273-800 240-800t-56.5 23.5Q160-753 160-720t23.5 56.5Q207-640 240-640t56.5-23.5ZM494-466q6-6 6-14t-6-14q-6-6-14-6t-14 6q-6 6-6 14t6 14q6 6 14 6t14-6ZM296.5-183.5Q320-207 320-240t-23.5-56.5Q273-320 240-320t-56.5 23.5Q160-273 160-240t23.5 56.5Q207-160 240-160t56.5-23.5Z" />
            </svg>
          </article>

          {/* Promociones */}
          <article className="relative min-h-48 overflow-hidden bg-[#e60055] p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
              Promociones activas
            </p>

            <span className="mt-2 block font-serif text-4xl font-semibold">
              5
            </span>

            <div className="mt-10 flex items-center gap-1 text-xs font-medium text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M720-440v-120h-80v120H520v80h120v120h80v-120h120v-80H720ZM360-480q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM80-160v-80q0-83 58.5-141.5T280-440h160q31 0 59 9t52 25q-17 22-30 47t-21 52q-14-13-30-23t-34-17q-18-6-37-9.5t-39-3.5H280q-50 0-85 35t-35 85v0h346q11 22 26 42t34 38H80Z" />
              </svg>

              <span>Alcance de 1.2k clientes</span>
            </div>

            {/* Icono decorativo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="absolute -bottom-4 -right-4 h-28 w-28 text-white/10"
              aria-hidden="true"
            >
              <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Z" />
            </svg>
          </article>

          {/* Actividad reciente */}
          <article className="border border-rose-300 bg-white p-8 md:col-span-2 lg:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Actividad reciente
            </p>

            <div className="mt-6 space-y-6">
              <div className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-600"></span>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Make-up Editorial actualizado
                  </p>

                  <span className="mt-1 block text-[10px] text-slate-400">
                    Hace 2 horas
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500"></span>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Nueva promo "Summer Glow"
                  </p>

                  <span className="mt-1 block text-[10px] text-slate-400">
                    Ayer
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Servicios más visitados */}
        <article className="mt-5 border border-rose-200 bg-white p-6 md:p-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Servicios más visitados
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Categorías con mayor número de visitas de los clientes.
            </p>
          </div>

          {/* Cargando datos */}
          {loadingVisits && (
            <p className="text-sm text-slate-400">Cargando estadísticas...</p>
          )}

          {/* Error */}
          {!loadingVisits && visitsError && (
            <p className="text-sm text-red-500">{visitsError}</p>
          )}

          {/* Sin información */}
          {!loadingVisits && !visitsError && categories.length === 0 && (
            <p className="text-sm text-slate-400">
              No hay información de visitas disponible.
            </p>
          )}

          {/* Gráfica */}
          {!loadingVisits && !visitsError && categories.length > 0 && (
            <div className="space-y-7">
              {categories.map((category) => {
                const percentage = (category.visits / maxVisits) * 100;

                return (
                  <div key={category.id}>
                    {/* Nombre y cantidad */}
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-700">
                        {category.name}
                      </span>

                      <span className="text-xs font-semibold text-rose-700">
                        {category.visits}{" "}
                        {category.visits === 1 ? "visita" : "visitas"}
                      </span>
                    </div>

                    {/* Barra */}
                    <div className="h-3 w-full overflow-hidden rounded-full bg-rose-100">
                      <div
                        className="h-full rounded-full bg-rose-700 transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </main>
  );
}

export default DashboardAdmin;
