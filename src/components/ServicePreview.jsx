import LinkButton from "../ui/LinkButton";
import { homeServices } from "../data/homeServices";
import { supabase } from "../utils/supabase";

function ServicePreview() {
  //función del clic para el diagrama
  async function handleServiceVisit(categoryId) {
    const { error } = await supabase.rpc("increment_category_visit", {
      category_id_param: categoryId,
    });
    if (error) {
      console.error("Error al registrar visita", error);
    }
  }

  return (
    <section id="services" className="scroll-mt-24 bg-[#f8f5f6] px-5 py-14">
      <div className="text-center">
        <span className="text-sm md:text-[17px] font-medium uppercase tracking-[0.35em] font-serif text-rose-700 ">
          Tratamientos Exclusivos
        </span>
        <h2 className="mt-3 text-4xl md:text-5xl font-medium font-serif text-rose-700 px-5 py-4">
          Servicios del estudio Jireh
        </h2>
        <div className="mx-auto mt-4 h-0.75 w-20 bg-rose-700"></div>
      </div>

      {/*Map de los servicios*/}
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {homeServices.map((service) => (
          <article
            key={service.id}
            className="mt-5 group flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition duration-300 hover:-translate-y-3 hover:shadow-xl"
          >
            <img
              src={service.image}
              alt={`Servicio de ${service.title}`}
              className="h-64 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-2xl font-serif font-medium text-rose-700">
                {service.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                {service.description}
              </p>

              {/*Link de navegacion(button)*/}
              <LinkButton
                to={service.path}
                onClick={() => handleServiceVisit(service.categoryId)}
                variant="outline" //LinkButton
                className="mt-6 w-full px-5 py-3 text-sm font-medium"
              >
                Ver mas{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
                </svg>
              </LinkButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicePreview;
