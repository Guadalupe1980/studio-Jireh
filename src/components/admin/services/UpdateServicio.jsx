import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "../../../utils/supabase";

function UpdateServicio() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Categorías obtenidas desde Supabase
  const [categories, setCategories] = useState([]);

  // Información del formulario
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    active: true,
  });

  // Imagen actual guardada en Supabase
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Nueva imagen seleccionada
  const [newImage, setNewImage] = useState(null);
  const [imageError, setImageError] = useState("");

  // Estados de la pantalla
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 // Traer las categorías y el servicio seleccionado
  useEffect(() => {
    async function getServiceData() {
      setLoading(true);
      setErrorMessage("");

// 1. Obtener las categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("service_categories")
        .select("id, name")
        .order("id", { ascending: true });

      if (categoriesError) {
        console.error("Error al cargar categorías:", categoriesError);

        setErrorMessage("No se pudieron cargar las categorías.");

        setLoading(false);
        return;
      }

      // 2. Obtener únicamente el servicio que coincide con el id de la URL
      const { data: serviceData, error: serviceError } = await supabase
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
            active
          `,
        )
        .eq("id", id)
        .single();

      if (serviceError) {
        console.error("Error al cargar el servicio:", serviceError);

        setErrorMessage("No se pudo encontrar el servicio.");

        setLoading(false);
        return;
      }

      // 3. Guardar las categorías
      setCategories(categoriesData || []);

      // 4. Llenar el formulario con los datos actuales del servicio
      setForm({
        category_id: String(serviceData.category_id ?? ""),
        name: serviceData.name ?? "",
        description: serviceData.description ?? "",
        duration_minutes: serviceData.duration_minutes ?? "",
        price: serviceData.price ?? "",
        active: serviceData.active ?? true,
      });

      // 5. Guardar la imagen actual
      setCurrentImageUrl(serviceData.image_url ?? "");

      setLoading(false);
    }

    getServiceData();
  }, [id]);

  //Guardar los cambios de los inputs
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  //Seleccionar una nueva imagen
  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setNewImage(null);

      setImageError("Este archivo no está permitido. Selecciona una imagen.");

      event.target.value = "";
      return;
    }

    setNewImage(file);
    setImageError("");
  }

  // Actualizar el servicio
  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");

    // Por defecto conservamos la imagen que ya tenía
    let finalImageUrl = currentImageUrl;

    //Si el administrador seleccionó una nueva imagen, la subimos
    if (newImage) {
      const fileExtension = newImage.name.split(".").pop();

      const fileName = `${Date.now()}.${fileExtension}`;

      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("studioJireh")
        .upload(filePath, newImage, {
          cacheControl: "3600",
          upsert: false,
          contentType: newImage.type,
        });

      if (uploadError) {
        console.error("Error al subir la nueva imagen:", uploadError);

        setErrorMessage("No se pudo subir la nueva imagen.");

        setSaving(false);
        return;
      }

      //Obtener la URL pública de la imagen nueva
      const { data: publicUrlData } = supabase.storage
        .from("studioJireh")
        .getPublicUrl(filePath);

      finalImageUrl = publicUrlData.publicUrl;
    }

    // Actualizar la información en la tabla services
    const { error: updateError } = await supabase
      .from("services")
      .update({
        category_id: Number(form.category_id),
        name: form.name.trim(),
        description: form.description.trim(),
        duration_minutes: Number(form.duration_minutes),
        price: Number(form.price),
        image_url: finalImageUrl,
        active: form.active,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error al actualizar el servicio:", updateError);

      setErrorMessage("No se pudo actualizar el servicio.");

      setSaving(false);
      return;
    }

    setSaving(false);

    // Regresar al listado
    navigate("/admin/services");
  }

  // Pantalla de carga
  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-rose-100 border-t-rose-700" />

          <p className="mt-4 text-sm text-slate-500">Cargando Promoción...</p>
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
            Actualizar servicio
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Modifica la información del servicio seleccionado.
          </p>
        </div>

        {/* Mensaje de error */}
        {errorMessage && (
          <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-rose-100 bg-white p-6 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Categoría */}
            <div className="sm:col-span-2">
              <label
                htmlFor="category_id"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Categoría
              </label>

              <select
                id="category_id"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              >
                <option value="">Selecciona una categoría</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Nombre del servicio
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-rose-200 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
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
                rows="4"
                className="w-full resize-none rounded-lg border border-rose-200 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Duración */}
            <div>
              <label
                htmlFor="duration_minutes"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Duración
              </label>

              <div className="relative">
                <input
                  id="duration_minutes"
                  type="number"
                  name="duration_minutes"
                  value={form.duration_minutes}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full rounded-lg border border-rose-200 px-4 py-3 pr-16 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  min
                </span>
              </div>
            </div>

            {/* Precio */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Precio
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
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-rose-200 py-3 pl-8 pr-16 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  MXN
                </span>
              </div>
            </div>

            {/* Estado */}
            <div className="sm:col-span-2">
              <label
                htmlFor="active"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Estado del servicio
              </label>

              <select
                id="active"
                name="active"
                value={String(form.active)}
                className="w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              >
                <option value="true">Activo</option>

                
              </select>
            </div>

            {/* Imagen actual */}
            {currentImageUrl && (
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-slate-600">
                  Imagen actual
                </p>

                <img
                  src={currentImageUrl}
                  alt={`Imagen actual de ${form.name}`}
                  className="h-52 w-full rounded-xl object-cover sm:w-80"
                />
              </div>
            )}

            {/* Nueva imagen */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Cambiar imagen
              </label>

              <label
                htmlFor="newImage"
                className="flex cursor-pointer items-center justify-between rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-rose-50"
              >
                <span>
                  {newImage ? newImage.name : "Conservar imagen actual"}
                </span>

                <span className="rounded-md bg-rose-100 px-4 py-2 text-xs font-medium text-rose-700">
                  Examinar
                </span>
              </label>

              <input
                id="newImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-slate-400">
                Este campo es opcional. Si no seleccionas otra imagen, se
                conservará la actual.
              </p>

              {imageError && (
                <p className="mt-2 text-sm text-red-500">{imageError}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              disabled={saving}
              className="rounded-lg border border-rose-200 px-6 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Actualizando..." : "Actualizar servicio"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UpdateServicio;
