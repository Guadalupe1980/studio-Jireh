import fotoAutora from "../assets/images/FotoAutora.webp"

function AboutMe() {
  return (
    <section className="min-h-screen bg-[#fbfaf8] px-4 py-10 sm:px-6 md:py-13">
      <article className="mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-xl md:max-w-5xl">
        <div className="md:grid md:grid-cols-2">
          {/* Imagen */}
          <div className="relative min-h-75 overflow-hidden bg-rose-50 sm:min-h-95 md:min-h-full">
            <img
              src={fotoAutora}
              alt="Fundadora del Estudio de Belleza Jireh"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-linear-to-t from-rose-950/10 to-transparent"></div>
          </div>

          {/* Información */}
          <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-14">
            {/* Encabezado pequeño */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-rose-600"></div>

              <span className="font-serif text-[9px] font-semibold uppercase tracking-[0.35em] text-rose-700 sm:text-[10px]">
                Nuestra filosofía
              </span>
            </div>

            {/* Título */}
            <h1 className="mt-5 font-serif text-[31px] leading-[1.1] text-rose-700 sm:text-4xl md:text-[42px]">
              El arte de la{" "}
              <span className="block italic sm:inline">belleza consciente</span>
            </h1>

            {/* Frase principal */}
            <blockquote className="mt-7 border-l border-rose-300 pl-4 font-serif text-[15px] italic leading-7 text-stone-500 sm:text-base">
              “Mi misión es crear cambios que inspiren seguridad, renovación y
              una forma única de expresar la personalidad de cada cliente.”
            </blockquote>

            {/* Descripción */}
            <p className="mt-7 text-sm leading-7 text-stone-600 sm:text-[15px]">
              <span className="font-semibold text-rose-700">
                Estudio de Belleza Jireh{" "}
              </span>{" "}
              nació con el propósito de crear un espacio donde cada persona
              pueda sentirse especial, segura y auténtica, disfrutando una
              experiencia pensada para resaltar su belleza y estilo personal.
            </p>

            {/* Línea divisora */}
            <div className="my-7 h-px bg-stone-200"></div>

            {/* Certificaciones */}
            <div>
              <h2 className="font-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-700">
                Certificaciones y logros
              </h2>

              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3 text-xs leading-5 text-stone-500 sm:text-sm">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-500 text-[8px] text-rose-600">
                    ✓
                  </span>

                  <span>Taller de automaquillaje profesional</span>
                </li>

                <li className="flex items-start gap-3 text-xs leading-5 text-stone-500 sm:text-sm">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-500 text-[8px] text-rose-600">
                    ✓
                  </span>

                  <span>Taller de kerabotox alisante</span>
                </li>
                <li className="flex items-start gap-3 text-xs leading-5 text-stone-500 sm:text-sm">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-500 text-[8px] text-rose-600">
                    ✓
                  </span>

                  <span>Curso de peinado en casa Mac</span>
                </li>
                <li className="flex items-start gap-3 text-xs leading-5 text-stone-500 sm:text-sm">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-500 text-[8px] text-rose-600">
                    ✓
                  </span>

                  <span>Certificado en diseño de cejas HD brown</span>
                </li>
                <li className="flex items-start gap-3 text-xs leading-5 text-stone-500 sm:text-sm">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-500 text-[8px] text-rose-600">
                    ✓
                  </span>

                  <span>Diploma en corte de cabello para dama</span>
                </li>

                <li className="flex items-start gap-3 text-xs leading-5 text-stone-500 sm:text-sm">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-500 text-[8px] text-rose-600">
                    ✓
                  </span>

                  <span>10+ años transformando miradas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default AboutMe;
