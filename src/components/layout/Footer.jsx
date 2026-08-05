import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate(); //para navegar al login

  // Dirección que se muestra como texto en el footer
  const address =
    "TAB / Jalpa de Méndez 138, El Río, 86203 Jalpa de Méndez, Tabasco";

  // Enlace exacto generado desde Google Maps
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!4v1784793950517!6m8!1m7!1s4jI6JDnFy4Ad5Cr8VZ1hKw!2m2!1d18.15221178470845!2d-93.05922439155826!3f270!4f0!5f0.7820865974627469https://www.google.com/maps/place//@18.151964,-93.0610091,50m/data=!3m1!1e3!4m6!1m5!3m4!2zMTjCsDA5JzA3LjQiTiA5M8KwMDMnMzguNiJX!8m2!3d18.15205!4d-93.0607224?hl=es&entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D";

  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-gray-200 bg-[#f8f5f6]"
    >
      {/* Información de contacto y mapa */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-10">
        {/* Datos de contacto */}
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-rose-700">
            ¿Hablamos?
          </span>

          <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight text-rose-700 md:text-5xl">
            Tu próxima gran experiencia
            <span className="block italic">empieza aquí</span>
          </h2>

          <div className="mt-10 space-y-8">
            {/* Dirección */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-400q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Dirección
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                  {address}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 14-2.5 25T371-624l-97 98q20 37 47.5 71.5T381-389q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T664-392l137 28q13 3 21 13t8 23v166q0 18-12 30t-30 12Z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Teléfono
                </h3>

                <a
                  href="tel:+529142797596"
                  className="mt-2 block text-sm text-gray-600 transition duration-300 hover:text-rose-700"
                >
                  +52 914 279 7596
                </a>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Horarios
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Lunes a Sábado: 9:00 a 18:00
                  <br />
                  Domingo: Cerrado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de Google Maps */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <iframe
            src={mapUrl}
            title="Ubicación del Estudio de Belleza Jireh"
            className="h-100 w-full border-0 lg:h-full lg:min-h-112.5"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>

      {/* Información del estudio */}
      <section className="border-t border-gray-200 px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <img
            src="/logo-jireh.png"
            alt="Logo del Estudio de Belleza Jireh"
            className="h-auto w-44"
          />

          <p className="mt-5 max-w-md text-sm italic leading-6 text-gray-500">
            “La verdadera belleza nace de la confianza. Nosotros solo nos
            encargamos de hacerla brillar.”.
          </p>
        </div>
      </section>

      {/* Derechos reservados */}
      <div className="border-t border-gray-200 px-5 py-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
          © 2026{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="cursor-default uppercase tracking-[0.3em] text-gray-500"
            aria-label="Abrir inicio de sesión"
          >
            Estudio Jireh
          </button>
          . Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
