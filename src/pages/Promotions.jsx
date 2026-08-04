import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

/* Convierte 2026-08-03 en 03 ago 2026 */
function formatDate(date) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* Obtiene la fecha actual en formato YYYY-MM-DD */
function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getPromotions() {
      setLoading(true);
      setErrorMessage("");

      const today = getToday();

      const { data, error } = await supabase
        .from("promotions")
        .select(
          `
          id,
          title,
          description,
          old_price,
          price,
          image_url,
          popular,
          active,
          start_date,
          expiration_date
        `,
        )
        .eq("active", true)
        .lte("start_date", today)
        .gte("expiration_date", today)
        .order("popular", { ascending: false })
        .order("id", { ascending: true });

      if (error) {
        console.error("Error al cargar las promociones:", error);
        setErrorMessage("No se pudieron cargar las promociones.");

        setLoading(false);
        return;
      }

      setPromotions(data || []);
      setLoading(false);
    }

    getPromotions();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfaf8] px-5 py-14">
      <section className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-rose-400" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-500">
              Ofertas de temporada
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl font-medium leading-none text-rose-700 sm:text-5xl">
            Promociones
            <span className="block italic">Exclusivas</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500">
            Descubre promociones diseñadas para consentirte y renovar tu estilo
            con los servicios especiales de Jireh.
          </p>
        </header>

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-100 border-t-rose-700" />

            <p className="mt-4 text-sm text-slate-500">
              Cargando promociones...
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {!loading && errorMessage && (
          <div className="mt-10 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* No hay promociones */}
        {!loading && !errorMessage && promotions.length === 0 && (
          <div className="mt-10 rounded-xl border border-rose-100 bg-white px-5 py-12 text-center">
            <p className="font-serif text-2xl text-rose-700">Próximamente</p>

            <p className="mt-2 text-sm text-slate-500">
              En este momento no hay promociones disponibles.
            </p>
          </div>
        )}

        {/* Tarjetas */}
        {!loading && !errorMessage && promotions.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {promotions.map((promotion) => (
              <article
                key={promotion.id}
                className="group overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Imagen */}
                <div className="relative h-64 overflow-hidden bg-rose-50">
                  <img
                    src={promotion.image_url}
                    alt={`Promoción ${promotion.title}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent" />
                </div>

                {/* Información */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-xl uppercase leading-tight text-rose-700">
                      {promotion.title}
                    </h2>

                    {promotion.popular && (
                      <span className="shrink-0 rounded-full bg-rose-700 px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="mt-4 min-h-10 text-[13px] italic leading-6 text-slate-500">
                    {promotion.description}
                  </p>

                  {/* Fechas */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-rose-100 py-4">
                    <div>
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        Inicia
                      </span>

                      <span className="mt-1 block text-xs font-medium capitalize text-slate-600">
                        {formatDate(promotion.start_date)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        Finaliza
                      </span>

                      <span className="mt-1 block text-xs font-medium capitalize text-rose-700">
                        {formatDate(promotion.expiration_date)}
                      </span>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="mt-5 flex items-end gap-3">
                    <span className="pb-1 text-xs text-slate-400 line-through">
                      ${Number(promotion.old_price).toLocaleString("es-MX")}
                    </span>

                    <span className="font-serif text-4xl font-medium text-rose-700">
                      ${Number(promotion.price).toLocaleString("es-MX")}
                    </span>
                  </div>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/529142797596?text=${encodeURIComponent(
                      `Hola, quiero reservar la promoción ${promotion.title}. Vigente del ${formatDate(
                        promotion.start_date,
                      )} al ${formatDate(promotion.expiration_date)}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-700 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-rose-800"
                  >
                    Reservar ahora
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M16.02 3C8.84 3 3 8.72 3 15.76c0 2.25.6 4.44 1.73 6.37L3 29l7.03-1.8a13.2 13.2 0 0 0 5.98 1.45h.01C23.2 28.65 29 22.93 29 15.88 29 8.84 23.2 3 16.02 3Zm0 23.5a11 11 0 0 1-5.6-1.52l-.4-.23-4.17 1.07 1.11-4-.26-.42a10.7 10.7 0 0 1-1.67-5.64c0-5.86 4.92-10.63 10.98-10.63 6.06 0 10.98 4.77 10.98 10.75 0 5.86-4.92 10.62-10.97 10.62Zm6.02-7.95c-.33-.16-1.96-.95-2.26-1.06-.3-.1-.52-.16-.74.16-.22.32-.85 1.06-1.04 1.28-.19.21-.38.24-.7.08-.34-.16-1.4-.5-2.67-1.6a10.02 10.02 0 0 1-1.84-2.25c-.2-.32-.02-.5.15-.66.15-.15.33-.37.5-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.74-1.74-1.01-2.38-.27-.64-.55-.55-.74-.56h-.63c-.22 0-.58.08-.88.4-.3.32-1.16 1.11-1.16 2.71s1.2 3.14 1.36 3.36c.17.21 2.35 3.51 5.7 4.92.8.34 1.42.54 1.9.69.8.25 1.53.21 2.1.13.65-.1 1.97-.79 2.25-1.55.27-.77.27-1.42.19-1.56-.08-.13-.3-.21-.63-.37Z" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Promotions;
