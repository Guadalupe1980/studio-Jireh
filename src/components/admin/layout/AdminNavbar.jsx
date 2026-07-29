import { useState } from "react";
import { Link } from "react-router-dom";

function AdminNavbar() {
  const [Openmenu, setOpenmenu] = useState(false); //Estado del menu

  return (
    <header className="sticky top-0 left-0 z-50 flex w-full justify-between items-center shadow-md bg-[#fbfaf8] px-5 py-3 md:px-10">
      <img
        src="/logo-jireh.png"
        alt="logo Jireh"
        className="h-auto w-43 md:w-50"
      />

      {/*Boton del menu falso/true*/}
      <button
        type="button"
        onClick={() => setOpenmenu(!Openmenu)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-gray-800 transition border border-gray-300 hover:bg-gray-300 lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-6 w-6 transition-transform duration-500 ease-in-out cursor-pointer ${Openmenu ? "rotate-60" : "rotate-0"}`}
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>

      <nav
        className={`absolute left-0 top-full z-50 w-full flex-col gap-2 bg-[#fbfaf8] text-gray-500 px-5 py-4 shadow-md ${Openmenu ? "flex items-center" : "hidden"} lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:text-gray-500 lg:gap-7 lg:bg-transparent lg:p-0 lg:shadow-none`}
      >
        <Link
          to={"/admin"}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Dashboard
        </Link>
        <Link
          to={"/admin/services"}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Servicios
        </Link>
        <Link
          to={"/admin/promotions"}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Promociones
        </Link>
        <Link
          to={""}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Configuración
        </Link>
        <Link
          to={""}
          className="hover:scale-110 duration-300 md:hover:text-rose-700"
        >
          Cerrar sesión
        </Link>
      </nav>
    </header>
  );
}

export default AdminNavbar;
