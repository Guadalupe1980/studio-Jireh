import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LinkButton from "../../../ui/LinkButton";
import { supabase } from "../../../utils/supabase";

function ReadPromotion() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //función para calcular el descuento
  function calculateDiscount(old_price, price) {
    const originalPrice = Number(old_price);
    const promotionsPrice = Number(price);

    if (originalPrice <= 0) {
      return 0;
    }

    return Math.round(
      ((originalPrice - promotionsPrice) / originalPrice) * 100,
    );
  }

  //función para formatear la fecha
  function formatDate(date) {
    if (!date) return "Sin fecha";

    return new Date(`${date}T00:00:00`).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  useEffect(() => {
    async function bringPromotions() {
      setLoading(true);
      setErrorMessage("");

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
        image_path,
        popular,
        active,
        start_date,
        expiration_date,
        created_at
        `,
        )
        .order("id", { ascending: true });

      if (error) {
        console.error("Error  al cargar las promociones", error);

        setErrorMessage("No se pudieron cargar las promociones.");

        setLoading(false);
        return;
      }
      setPromotions(data || []);
      setLoading(false);
    }
    bringPromotions();
  }, []);

  //calcular las promociones activas/inactivas
  const activePromotions = promotions.filter(
    (promotion) => promotion.active,
  ).length;

  const inactivePromotions = promotions.filter(
    (promotion) => !promotion.active,
  ).length;

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
              Vista de promociones
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Consulta y administra las promociones disponibles dentro del
              catálogo de Jireh.
            </p>
          </article>

          <LinkButton
            to="/admin/promotions/create"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-800 md:w-auto"
          >
            <span className="text-lg leading-none">+</span>
            Nueva promoción
          </LinkButton>
        </div>

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Promociones activas */}
          <article className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-6 py-5 shadow-sm">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Promociones activas
              </span>

              <p className="mt-2 font-serif text-4xl font-semibold text-rose-700">
                {String(activePromotions).padStart(2, "0")}
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="h-8 w-8 text-rose-300"
            >
              <path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Z" />
            </svg>
          </article>

          {/* Promociones inactivas */}
          <article className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-6 py-5 shadow-sm">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Promociones inactivas
              </span>

              <p className="mt-2 font-serif text-4xl font-semibold text-slate-700">
                {String(inactivePromotions).padStart(2, "0")}
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="h-8 w-8 text-slate-400"
            >
              <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
            </svg>
          </article>
        </div>

        {/* Título secundario */}
        <div className="mt-8">
          <p className="flex items-center gap-2 text-sm text-slate-400">
            Todas las promociones registradas actualmente.
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="h-5 w-5 shrink-0"
            >
              <path d="M160-200v-80h640v80H160Zm0-240v-80h640v80H160Zm0-240v-80h640v80H160Z" />
            </svg>
          </p>
        </div>

        {/*Estado de cargas y error*/}
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
              Cargando promociones...
            </p>
          </div>
        )}

        {!loading && errorMessage && (
          <p className="mt-10 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {/* Tarjetas */}
        {!loading && !errorMessage && promotions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {promotions.map((promotion) => (
              <article
                key={promotion.id}
                className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Imagen */}
                <div className="relative h-52 overflow-hidden bg-rose-50">
                  <img
                    src={promotion.image_url}
                    alt={`Promoción ${promotion.title}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Descuento */}
                  <span className="absolute bottom-3 left-3 rounded-full bg-rose-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    -{calculateDiscount(promotion.old_price, promotion.price)}%
                    OFF
                  </span>

                  {/* Estado */}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      promotion.active
                        ? "bg-green-100 text-green-700"
                        : "bg-rose-200 text-slate-600"
                    }`}
                  >
                    {promotion.active ? "Activa" : "Inactiva"}
                  </span>
                </div>

                {/* Información */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500">
                    {promotion.popular
                      ? "Promoción popular"
                      : "Promoción especial"}
                  </span>

                  <h3 className="mt-2 font-serif text-xl text-rose-700">
                    {promotion.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {promotion.description}
                  </p>

                  {/* Descuento y vigencia */}
                  <div className="my-5 border-y border-rose-100 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                          Fecha de Inicio
                        </span>

                        <span className="block text-xs font-medium text-slate-600">
                          {formatDate(promotion.start_date)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                          Vencimiento
                        </span>

                        <span className="block text-xs text-rose-700">
                          {formatDate(promotion.expiration_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="mb-5 flex items-end gap-3">
                    <span className="text-xs text-slate-400 line-through">
                      ${Number(promotion.old_price).toLocaleString("es-MX")}
                    </span>

                    <span className="font-serif text-3xl font-semibold text-rose-700">
                      ${Number(promotion.price).toLocaleString("es-MX")}
                    </span>
                  </div>

                  {/* Botones */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link
                      to={`/admin/promotions/update/${promotion.id}`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-12 26.5-17.5T705-840q16 0 31 6t27 18l55 56q12 11 17 26t5 30q0 16-5.5 30.5T817-647L290-120H120Z" />
                      </svg>
                      Editar
                    </Link>

                    <Link
                      to={`/admin/promotions/delete/${promotion.id}`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Z" />
                      </svg>
                      Eliminar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReadPromotion;
