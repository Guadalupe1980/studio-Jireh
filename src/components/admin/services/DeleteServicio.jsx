import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

function DeleteServicio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getService() {
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
            active,
            service_categories (
              name
            )
          `,
        )
        .eq("id", id)
        .single(); //Le dice a Supabase que esperas obtener un único servicio, no una lista.

      if (error) {
        console.error("Error al obtener el servicio:", error);
        setErrorMessage("No se pudo encontrar el servicio.");

        setLoading(false);
        return;
      }

      setService(data);
      setLoading(false);
    }

    getService();
  }, [id]);

  // Obtiene la ruta interna de la imagen
  function getImagePath(imageUrl) {
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

  async function handleDelete() {
    setDeleting(true);
    setErrorMessage("");

    const imagePath = getImagePath(service.image_url);

    // Elimina el registro de la tabla
    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar el servicio:", deleteError);
      setErrorMessage("No se pudo eliminar el servicio.");
      setDeleting(false);
      return;
    }

    // Elimina la imagen del Storage
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from("studioJireh")
        .remove([imagePath]);

      if (storageError) {
        console.error(
          "El servicio se eliminó, pero la imagen no:",
          storageError,
        );
      }
    }

    setDeleting(false);

    navigate("/admin/services", {
      replace: true,
    });
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-rose-100 border-t-rose-700" />

          <p className="mt-4 text-sm text-slate-500">Cargando servicio...</p>
        </div>
      </section>
    );
  }

  if (!service) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8] px-5">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl text-red-600">
            Servicio no encontrado
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            El servicio solicitado no existe o no se pudo cargar.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/services")}
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
            Eliminar servicio
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Revisa la información antes de eliminar este servicio.
          </p>
        </div>

        {/* Tarjeta */}
        <article className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
          {/* Imagen */}
          <div className="relative h-64 bg-rose-50">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={`Servicio de ${service.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Servicio sin imagen
              </div>
            )}

            <span
              className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                service.active
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-red-500"
              }`}
            >
              {service.active ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Información */}
          <div className="p-6 sm:p-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500">
              {service.service_categories?.name}
            </span>

            <h2 className="mt-2 font-serif text-3xl text-rose-700">
              {service.name}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {service.description || "Este servicio no tiene descripción."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-[#fbfaf8] p-4">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                  Duración
                </span>

                <span className="mt-1 block text-sm font-medium text-slate-600">
                  {service.duration_minutes} minutos
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

            {/* Advertencia */}
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="mt-0.5 h-6 w-6 shrink-0 text-red-500"
                >
                  <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold text-red-700">
                    Esta acción no se puede deshacer
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    Al confirmar, el servicio se eliminará del catálogo de
                    Jireh.
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {/* Botones */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/admin/services")}
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
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Z" />
                </svg>

                {deleting ? "Eliminando..." : "Eliminar servicio"}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default DeleteServicio;
