import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

function DeletePromotion() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Guarda una sola promoción obtenida desde Supabase
  const [promotion, setPromotion] = useState(null);

  // Estados generales
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Convierte 2026-08-05 a 05/08/2026
  function formatDate(date) {
    if (!date) return "Sin fecha";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  // Obtener la promoción seleccionada
  useEffect(() => {
    async function getPromotionDelete() {
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
          expiration_date
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener la promoción:", error);
        setErrorMessage("No se pudo encontrar la promoción.");
        setLoading(false);
        return;
      }

      setPromotion(data);
      setLoading(false);
    }

    if (id) {
      getPromotionDelete();
    }
  }, [id]);

  // Obtener image_path desde image_url como respaldo
  function getImagePathFromUrl(imageUrl) {
    if (!imageUrl) return null;

    try {
      const url = new URL(imageUrl);
      const marker = "/storage/v1/object/public/studioJireh/";
      const markerPosition = url.pathname.indexOf(marker);

      if (markerPosition === -1) {
        return null;
      }

      return decodeURIComponent(
        url.pathname.slice(markerPosition + marker.length),
      );
    } catch (error) {
      console.error("Error al obtener la ruta de la imagen:", error);

      return null;
    }
  }

  // Eliminar promoción
  async function handleDelete() {
    if (!promotion || deleting) return;

    setDeleting(true);
    setErrorMessage("");

    // Primero usa image_path Si no existe, obtiene la ruta desde image_url.
    const imagePath =
      promotion.image_path || getImagePathFromUrl(promotion.image_url);

    // Eliminar registro de la tabla
    const { error: deleteError } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar la promoción:", deleteError);
      setErrorMessage("No se pudo eliminar la promoción.");
      setDeleting(false);
      return;
    }

    // Eliminar imagen del Storage
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from("studioJireh")
        .remove([imagePath]);

      if (storageError) {
        console.error(
          "La promoción se eliminó, pero la imagen no pudo borrarse:",
          storageError,
        );
      }
    }

    setDeleting(false);
    navigate("/admin/promotions", {
      replace: true,
    });
  }

  // Pantalla de carga
  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-rose-100 border-t-rose-700" />

          <p className="mt-4 text-sm text-slate-500">Cargando promoción...</p>
        </div>
      </section>
    );
  }

  // Promoción no encontrada
  if (!promotion) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8] px-5">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl text-red-600">
            Promoción no encontrada
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {errorMessage ||
              "La promoción solicitada no existe o no se pudo cargar."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/promotions")}
            className="mt-6 rounded-lg bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-800"
          >
            Regresar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fbfaf8] px-5 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            Zona de eliminación
          </span>

          <h1 className="mt-2 font-serif text-4xl font-medium text-red-700">
            Eliminar promoción
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Revisa la información antes de eliminar esta promoción.
          </p>
        </div>

        {/* Tarjeta */}
        <article className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
          {/* Imagen */}
          <div className="relative h-64 bg-rose-50">
            {promotion.image_url ? (
              <img
                src={promotion.image_url}
                alt={`Promoción ${promotion.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Promoción sin imagen
              </div>
            )}

            {/* Estado */}
            <span
              className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                promotion.active
                  ? "bg-green-100 text-green-700"
                  : "bg-rose-200 text-slate-600"
              }`}
            >
              {promotion.active ? "Activa" : "Inactiva"}
            </span>
          </div>

          {/* Información */}
          <div className="p-6 sm:p-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500">
              {promotion.popular ? "Promoción popular" : "Promoción"}
            </span>

            <h2 className="mt-2 font-serif text-3xl text-rose-700">
              {promotion.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {promotion.description || "Esta promoción no tiene descripción."}
            </p>

            {/* Fechas y precio */}
            <div className="mt-6 grid gap-4 rounded-xl bg-[#fbfaf8] p-4 sm:grid-cols-3">
              {/* Fecha de inicio */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                  Fecha de inicio
                </span>

                <span className="mt-1 block text-sm font-medium text-slate-600">
                  {formatDate(promotion.start_date)}
                </span>
              </div>

              {/* Vencimiento */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                  Vencimiento
                </span>

                <span className="mt-1 block text-sm font-medium text-rose-600">
                  {formatDate(promotion.expiration_date)}
                </span>
              </div>

              {/* Precio */}
              <div className="sm:text-right">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                  Precio
                </span>

                <span className="mt-1 block text-sm font-semibold text-rose-700">
                  ${Number(promotion.price).toLocaleString("es-MX")} MXN
                </span>
              </div>
            </div>

            {/* Advertencia */}
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="mt-0.5 h-6 w-6 shrink-0 text-red-500"
                  aria-hidden="true"
                >
                  <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold text-red-700">
                    Esta acción no se puede deshacer
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    Al confirmar, la promoción se eliminará del catálogo de
                    Jireh.
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {/* Botones */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/admin/promotions")}
                disabled={deleting}
                className="flex-1 rounded-lg border border-rose-200 px-6 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Z" />
                </svg>

                {deleting ? "Eliminando..." : "Eliminar promoción"}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default DeletePromotion;
