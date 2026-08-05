import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

const INITIAL_FORM = {
  title: "",
  description: "",
  old_price: "",
  price: "",
  popular: false,
  active: true,
  start_date: "",
  expiration_date: "",
};

function UpdatePromotion() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Información de la promoción
  const [form, setForm] = useState(INITIAL_FORM);

  // Imagen que ya está guardada en Supabase
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImagePath, setCurrentImagePath] = useState("");

  // Nueva imagen seleccionada
  const [newImagePromo, setNewImagePromo] = useState(null);
  const [imageErrorPromo, setImageErrorPromo] = useState("");

  // Estados generales
  const [loadingUpdate, setLoadingUpdate] = useState(true);
  const [savingPromo, setSavingPromo] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Cargar la promoción seleccionada
  useEffect(() => {
    async function getPromotion() {
      setLoadingUpdate(true);
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
        console.error("Error al cargar la promoción:", error);
        setErrorMessage("No se pudo cargar la promoción.");
        setLoadingUpdate(false);
        return;
      }

      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        old_price: data.old_price ?? "",
        price: data.price ?? "",
        popular: data.popular ?? false,
        active: data.active ?? true,
        start_date: data.start_date ?? "",
        expiration_date: data.expiration_date ?? "",
      });

      setCurrentImageUrl(data.image_url ?? "");
      setCurrentImagePath(data.image_path ?? "");

      setLoadingUpdate(false);
    }

    if (id) {
      getPromotion();
    }
  }, [id]);

  // Guardar lo que el usuario cambia
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Guardar y validar la nueva imagen
  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setNewImagePromo(null);
      setImageErrorPromo("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setNewImagePromo(null);

      setImageErrorPromo(
        "Este archivo no está permitido. Selecciona una imagen.",
      );

      event.target.value = "";
      return;
    }

    setNewImagePromo(file);
    setImageErrorPromo("");
    setErrorMessage("");
  }

  // Actualizar la promoción
  async function handleSubmit(event) {
    event.preventDefault();

    setSavingPromo(true);
    setErrorMessage("");

    // Validar textos
    if (!form.title.trim() || !form.description.trim()) {
      setErrorMessage("Completa el nombre y la descripción.");
      setSavingPromo(false);
      return;
    }

    const oldPrice = Number(form.old_price);
    const promotionPrice = Number(form.price);

    // Validar precios
    if (oldPrice <= 0 || promotionPrice <= 0) {
      setErrorMessage("Los precios deben ser mayores que cero.");
      setSavingPromo(false);
      return;
    }

    if (promotionPrice > oldPrice) {
      setErrorMessage(
        "El precio promocional no puede ser mayor que el precio anterior.",
      );

      setSavingPromo(false);
      return;
    }

    // Validar fechas
    if (form.expiration_date < form.start_date) {
      setErrorMessage(
        "La fecha de vencimiento no puede ser anterior a la fecha de inicio.",
      );

      setSavingPromo(false);
      return;
    }

    // Conservamos la imagen actual por defecto
    let imageUrl = currentImageUrl;
    let imagePath = currentImagePath;
    let uploadedImagePath = "";

    try {
      // Solo subir una imagen si el usuario seleccionó una nueva.
      if (newImagePromo) {
        const fileExtension =
          newImagePromo.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${Date.now()}.${fileExtension}`;
        uploadedImagePath = `promotions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("studioJireh")
          .upload(uploadedImagePath, newImagePromo, {
            cacheControl: "3600",
            upsert: false,
            contentType: newImagePromo.type,
          });

        if (uploadError) {
          console.error("Error al subir la nueva imagen:", uploadError);
          throw new Error("No se pudo subir la nueva imagen.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("studioJireh")
          .getPublicUrl(uploadedImagePath);

        imageUrl = publicUrlData.publicUrl;
        imagePath = uploadedImagePath;
      }

      // Actualizar los datos de la promoción
      const { error: updateError } = await supabase
        .from("promotions")
        .update({
          title: form.title.trim(),
          description: form.description.trim(),
          old_price: oldPrice,
          price: promotionPrice,
          image_url: imageUrl,
          image_path: imagePath,
          popular: form.popular,
          active: form.active,
          start_date: form.start_date,
          expiration_date: form.expiration_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error al actualizar la promoción:", updateError);
        throw new Error("No se pudo actualizar la promoción.");
      }

      // Eliminar la imagen anterior después de actualizar correctamente la tabla.
      if (
        newImagePromo &&
        currentImagePath &&
        currentImagePath !== uploadedImagePath
      ) {
        const { error: removeOldImageError } = await supabase.storage
          .from("studioJireh")
          .remove([currentImagePath]);

        if (removeOldImageError) {
          console.error(
            "No se pudo eliminar la imagen anterior:",
            removeOldImageError,
          );
        }
      }

      navigate("/admin/promotions", {
        replace: true,
      });
    } catch (error) {
      // Si se subió una nueva imagen, pero fallo el UPDATE, se elimina la imagen nueva.
      if (uploadedImagePath) {
        const { error: removeNewImageError } = await supabase.storage
          .from("studioJireh")
          .remove([uploadedImagePath]);

        if (removeNewImageError) {
          console.error(
            "No se pudo limpiar la imagen nueva:",
            removeNewImageError,
          );
        }
      }

      console.error("Error en el UPDATE:", error);

      setErrorMessage(
        error.message || "Ocurrió un error al actualizar la promoción.",
      );
    } finally {
      setSavingPromo(false);
    }
  }

  //Pantalla mientras se consulta Supabase
  if (loadingUpdate) {
    return (
      <section className="min-h-screen bg-[#fbfaf8] px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-slate-500">
            Cargando información de la promoción...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fbfaf8] px-5 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Encabezado */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
            Administración
          </span>

          <h1 className="mt-2 font-serif text-4xl font-medium text-rose-700">
            Actualizar promoción
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Modifica la información de la promoción seleccionada.
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <p className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-rose-100 bg-white p-6 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Promoción popular */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between gap-5 rounded-lg border border-rose-200 bg-[#fbfaf8] px-4 py-4">
                <div>
                  <label
                    htmlFor="popular"
                    className="block text-sm font-medium text-slate-600"
                  >
                    Promoción popular
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Activa esta opción para mostrar la etiqueta “Popular”.
                  </p>
                </div>

                <input
                  id="popular"
                  name="popular"
                  type="checkbox"
                  checked={form.popular}
                  onChange={handleChange}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-rose-700"
                />
              </div>
            </div>

            {/* Nombre */}
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Nombre de la promoción
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej. Summer Glow Pack"
                required
                className="w-full rounded-lg border border-rose-200 px-4 py-3 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Descripción */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Descripción
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe brevemente la promoción..."
                rows="4"
                required
                className="w-full resize-none rounded-lg border border-rose-200 px-4 py-3 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Precio anterior */}
            <div>
              <label
                htmlFor="old_price"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Precio anterior
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  id="old_price"
                  name="old_price"
                  type="number"
                  value={form.old_price}
                  onChange={handleChange}
                  placeholder="1200"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-rose-200 py-3 pl-8 pr-16 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  MXN
                </span>
              </div>
            </div>

            {/* Precio promocional */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Precio promocional
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="899"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-rose-200 py-3 pl-8 pr-16 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  MXN
                </span>
              </div>
            </div>

            {/* Fecha de inicio */}
            <div>
              <label
                htmlFor="start_date"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Fecha de inicio
              </label>

              <input
                id="start_date"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Fecha de vencimiento */}
            <div>
              <label
                htmlFor="expiration_date"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Fecha de vencimiento
              </label>

              <input
                id="expiration_date"
                name="expiration_date"
                type="date"
                value={form.expiration_date}
                onChange={handleChange}
                min={form.start_date || undefined}
                required
                className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Imagen actual */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Imagen actual
              </label>

              <div className="overflow-hidden rounded-lg border border-rose-200 bg-rose-50/50">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt={form.title}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <p className="text-sm text-slate-400">
                      No hay una imagen disponible.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cambiar imagen */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Cambiar imagen
              </label>

              <label
                htmlFor="image"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-rose-50"
              >
                <span className="truncate">
                  {newImagePromo
                    ? newImagePromo.name
                    : "Seleccionar una nueva imagen"}
                </span>

                <span className="shrink-0 rounded-md bg-rose-100 px-4 py-2 text-xs font-medium text-rose-700">
                  Examinar
                </span>
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-slate-400">
                Deja este campo vacío para conservar la imagen actual.
              </p>

              {imageErrorPromo && (
                <p className="mt-2 text-sm text-red-500">{imageErrorPromo}</p>
              )}
            </div>

            {/* Estado */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between gap-5 rounded-lg border border-rose-200 bg-[#fbfaf8] px-4 py-4">
                <div>
                  <label
                    htmlFor="active"
                    className="block text-sm font-medium text-slate-600"
                  >
                    Promoción activa
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Define si la promoción estará disponible en la página
                    pública.
                  </p>
                </div>

                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-rose-700"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={savingPromo}
              onClick={() => navigate("/admin/promotions")}
              className="rounded-lg border border-rose-200 px-6 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={savingPromo}
              className="rounded-lg bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingPromo ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UpdatePromotion;
