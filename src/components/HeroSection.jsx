import LinkButton from "../ui/LinkButton";

function HeroSection() {
  return (
    <section className="relative bg-[url('/src/assets/images/HeroSection-mobile.jpg')] min-h-screen bg-cover bg-top bg-no-repeat">
      {/*Capa clara sobre la imagen*/}
      <div className="absolute inset-0 bg-white/35">
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-5 md:px-8 py-16">
          {/*Datos-Hero*/}
          <span className="text-[13px] md:text-[14px] font-medium uppercase text-rose-700 tracking-wider">
            Estética Premium
          </span>
          <div className="mt-3">
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Tu mejor Servicio
            </h1>
            <h2 className="font-serif text-4xl md:text-5xl italic text-rose-700 leading-tight">
              Comienza conmigo
            </h2>
          </div>
          <p className="mt-8 max-w-xs md:max-w-md text-base leading-7 text-gray-700">
            Sumérgete en una oasis de relajacion y belleza.Donde cada
            tratamiento es un ritual personalizado para realzar tu brillo
            natural.
          </p>

          {/*Enlace de pagina de Facebook*/}
          <LinkButton
            href="https://www.facebook.com/share/19JfeoCzWU/"
            newTab //LinkButton
            className="mt-8 w-full bg-rose-800 px-6 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-rose-900 md:w-70"
          >
            Visita mis trabajos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M22 12a10 10 0 1 0-11.563 9.875v-6.988H7.898V12h2.539V9.797c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.243 0-1.63.772-1.63 1.563V12h2.773l-.443 2.887h-2.33v6.988A10.002 10.002 0 0 0 22 12Z" />
            </svg>
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
