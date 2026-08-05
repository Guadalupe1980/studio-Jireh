import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

function CreateServicio() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  {
    /*Llamamos los datos de servicios */
  }
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    active: true,
  });

  {
    /*Estado para guardar el archivo seleccionado*/
  }
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(""); //mostrar un mensaje si no es una imagen.

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    //se verifica que es una imagen
    if (!file.type.startsWith("image/")) {
      setImage(null);
      setImageError("Este archivo no es permitido. Selecciona una imagen");
      e.target.value = "";
      return;
    }

    setImage(file);
    setImageError("");
  }

  {
    /*Traer las categorías*/
  }
  useEffect(() => {
    async function bringCategories() {
      const { data, error } = await supabase
        .from("service_categories")
        .select("id, name")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error al cargar categorias", error);
        return;
      }
      setCategories(data || []);
    }
    bringCategories();
  }, []);

  {
    /* guardamos lo que el usuario escribe */
  }
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  {
    /* parte central del CREATE */
  }
  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    if (!image) {
      setErrorMessage("Selecciona una imagen");
      setLoading(false);
      return;
    }

    //obtener extencion del archivo
    const fileExtension = image.name.split(".").pop();

    //crear nombre unico
    const fileName = `${Date.now()}.${fileExtension}`;

    //se crea la ruta dentro del bucket
    const filePath = `services/${fileName}`;

    //subir la imagen al storage
    const { error: uploadError } = await supabase.storage
      .from("studioJireh")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.type,
      });

    if (uploadError) {
      console.error("Error al subir la imagen:", uploadError);

      setErrorMessage("No se pudo subir la imagen");
      setLoading(false);
      return;
    }

    //Obtenemos la URL publica
    const { data: publicUrlData } = supabase.storage
      .from("studioJireh")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    //creamos el servicio
    const { error } = await supabase.from("services").insert({
      category_id: Number(form.category_id),
      name: form.name,
      description: form.description,
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
      image_url: imageUrl,
      active: form.active,
    });

    if (error) {
      console.error("Error al crear el servicio:", error);
      setErrorMessage("No se pudo crear el servicio.");
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate("/admin/services");
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfaf8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-rose-100 border-t-rose-700" />

          <p className="mt-4 text-sm text-slate-500">Guardando servicio...</p>
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
            Crear nuevo servicio
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Agrega un nuevo servicio al catálogo de Jireh.
          </p>
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

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
                placeholder="Ej. Peinado de noche"
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
                placeholder="Describe brevemente el servicio..."
                rows="4"
                className="w-full resize-none rounded-lg border border-rose-200 px-4 py-3 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
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
                  placeholder="60"
                  min="1"
                  required
                  className="w-full rounded-lg border border-rose-200 px-4 py-3 pr-16 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
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
                  placeholder="150"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-rose-200 py-3 pl-8 pr-16 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  MXN
                </span>
              </div>
            </div>

            {/* imagen */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Imagen del servicio
              </label>

              <label
                htmlFor="image"
                className="flex cursor-pointer items-center justify-between rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-rose-50"
              >
                <span>{image ? image.name : "Seleccionar imagen"}</span>

                <span className="rounded-md bg-rose-100 px-4 py-2 text-xs font-medium text-rose-700">
                  Examinar
                </span>
              </label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

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
              className="rounded-lg border border-rose-200 px-6 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-800"
            >
              {loading ? "Guardando..." : "Crear servicio"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateServicio;
