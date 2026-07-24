import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuopen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  function handleServicesClick(event, sectionId) {
    event.preventDefault();

    // Si el usuario ya se encuentra en Home
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);

      section?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    // Si está en otra página, primero regresa al Home
    navigate("/", {
      state: {
        scrollTo: sectionId,
      },
    });
  }

  return (
    <header className="sticky top-0 left-0 z-50 flex w-full justify-between items-center shadow-md bg-[#fbfaf8] px-5 py-3 md:px-10">
      <img
        src="/src/assets/icon/logo-jireh.png"
        alt="logo Jireh"
        className="h-auto w-43 md:w-50"
      />

      {/*Boton del menu falso/true*/}
      <button
        type="button"
        onClick={() => setMenuopen(!menuOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-gray-800 transition border border-gray-300 hover:bg-gray-300 lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-6 w-6 transition-transform duration-500 ease-in-out cursor-pointer ${menuOpen ? "rotate-60" : "rotate-0"}`}
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>

      <nav
        className={`absolute left-0 top-full z-50 w-full flex-col gap-2 bg-[#fbfaf8] text-gray-500 px-5 py-4 shadow-md ${menuOpen ? "flex items-center" : "hidden"} lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:text-gray-500 lg:gap-7 lg:bg-transparent lg:p-0 lg:shadow-none`}
      >
        <Link
          to={"/"}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Inicio
        </Link>
        <Link
          to={"/aboutMe"}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Sobre Mi
        </Link>
        <Link
          to={"/"}
          onClick={(event) => handleServicesClick(event, "services")}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Servicios
        </Link>
        <Link
          to={"/promotions"}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Promociones
        </Link>
        <Link
          to={"/"}
          onClick={(event) => handleServicesClick(event, "contact")}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Contacto
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
