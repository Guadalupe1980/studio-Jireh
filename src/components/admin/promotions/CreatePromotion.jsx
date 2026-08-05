import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

function CreatePromotion() {
  const navigate = useNavigate();

  // Datos del formulario (se guardan temporalmente)
  const [form, setForm] = useState({
    title: "",
    description: "",
    old_price: "",
    price: "",
    popular: false,
    active: true,
    start_date: "",
    expiration_date: "",
  });

  // Imagen seleccionada
  const [imagePromotions, setImagePromotions] = useState(null);
  const [imagePromotionsError, setImagePromotionsError] = useState("");

  // Estados generales
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState("");

  // Guarda los datos de inputs y checkboxes
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Guarda y valida la imagen seleccionada y la mantiene en react
  function handleImagePromoChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImagePromotions(null);

      setImagePromotionsError(
        "Este archivo no está permitido. Selecciona una imagen.",
      );

      event.target.value = "";
      return;
    }

    setImagePromotions(file);
    setImagePromotionsError("");
    setErrorCreate("");
  }

  // Envía la promoción a Supabase
  async function handleSubmit(event) {
    event.preventDefault();

    setLoadingCreate(true);
    setErrorCreate("");

    // Validar textos
    if (!form.title.trim() || !form.description.trim()) {
      setErrorCreate("Completa el nombre y la descripción.");

      setLoadingCreate(false);
      return;
    }

    // Validar imagen
    if (!imagePromotions) {
      setErrorCreate("Selecciona una imagen para la promoción.");

      setLoadingCreate(false);
      return;
    }

    // Validar precios
    if (Number(form.old_price) <= 0 || Number(form.price) <= 0) {
      setErrorCreate("Los precios deben ser mayores que cero.");

      setLoadingCreate(false);
      return;
    }

    if (Number(form.price) > Number(form.old_price)) {
      setErrorCreate(
        "El precio promocional no puede ser mayor que el precio anterior.",
      );

      setLoadingCreate(false);
      return;
    }

    // Validar fechas
    if (form.expiration_date < form.start_date) {
      setErrorCreate(
        "La fecha de vencimiento no puede ser anterior a la fecha de inicio.",
      );

      setLoadingCreate(false);
      return;
    }

    // Obtener extensión
    const fileExtension =
      imagePromotions.name.split(".").pop()?.toLowerCase() || "jpg";

    // Crear nombre y ruta únicos
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `promotions/${fileName}`;

    // Subir la imagen al Storage
    const { error: uploadError } = await supabase.storage
      .from("studioJireh")
      .upload(filePath, imagePromotions, {
        cacheControl: "3600",
        upsert: false,
        contentType: imagePromotions.type,
      });

    if (uploadError) {
      console.error("Error al subir la imagen:", uploadError);

      setErrorCreate("No se pudo subir la imagen.");
      setLoadingCreate(false);
      return;
    }

    // Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from("studioJireh")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Insertar la promoción en la tabla
    const { error: insertError } = await supabase.from("promotions").insert({
      title: form.title.trim(),
      description: form.description.trim(),
      old_price: Number(form.old_price),
      price: Number(form.price),
      image_url: imageUrl,
      image_path: filePath,
      popular: form.popular,
      active: form.active,
      start_date: form.start_date,
      expiration_date: form.expiration_date,
    });

    if (insertError) {
      console.error("Error al crear la promoción:", insertError);

      // Si falla el INSERT, borrar la imagen subida
      const { error: removeError } = await supabase.storage
        .from("studioJireh")
        .remove([filePath]);

      if (removeError) {
        console.error("No se pudo limpiar la imagen:", removeError);
      }

      setErrorCreate("No se pudo crear la promoción.");
      setLoadingCreate(false);
      return;
    }

    setLoadingCreate(false);
    navigate("/admin/promotions", {
      replace: true,
    });
  }

  if (loadingCreate) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-rose-100 border-t-rose-700" />

          <p className="mt-4 text-sm text-slate-500">Guardando promoción...</p>
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
            Crear nueva promoción
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Agrega una nueva promoción al catálogo de Jireh.
          </p>
        </div>

        {/* Error general */}
        {errorCreate && (
          <p className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorCreate}
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
                    Muestra una etiqueta especial de “Popular” en la promoción.
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
                type="text"
                name="title"
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
                  type="number"
                  name="old_price"
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
                  type="number"
                  name="price"
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
                type="date"
                name="start_date"
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
                type="date"
                name="expiration_date"
                value={form.expiration_date}
                onChange={handleChange}
                min={form.start_date || undefined}
                required
                className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Imagen de la promoción
              </label>

              <label
                htmlFor="image"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-rose-50"
              >
                <span className="truncate">
                  {imagePromotions
                    ? imagePromotions.name
                    : "Seleccionar imagen"}
                </span>

                <span className="shrink-0 rounded-md bg-rose-100 px-4 py-2 text-xs font-medium text-rose-700">
                  Examinar
                </span>
              </label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImagePromoChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-slate-400">
                Selecciona una imagen en formato JPG, PNG o WEBP.
              </p>

              {imagePromotionsError && (
                <p className="mt-2 text-sm text-red-500">
                  {imagePromotionsError}
                </p>
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
                    Al activarla podrá mostrarse en la página pública durante su
                    periodo de vigencia.
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
              onClick={() => navigate("/admin/promotions")}
              disabled={loadingCreate}
              className="rounded-lg border border-rose-200 px-6 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loadingCreate}
              className="rounded-lg bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
               Crear promoción
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreatePromotion;
