import cortesPeinadosImage from "../assets/images/cortesPeinadosImage.webp";
import coloracionImage from "../assets/images/coloracionImage.webp";
import extensionesImage from "../assets/images/extensionesImage.webp";
import tratamientosImage from "../assets/images/tratamientosImage.webp";
import maquillajeImage from "../assets/images/maquillajeImage.webp";

{/*Objeto de srvicios parte Hero*/}
export const homeServices = [
  {
    id: 1,
     categoryId: 1,
    title: "Cortes y peinados",
    description:
      "Renueva tu estilo con cortes personalizados y peinados profesionales para cada ocasión.",
    image: cortesPeinadosImage,
    path: "/cortesPeinados",
  },
  {
    id: 2,
     categoryId: 2,
    title: "Coloracion",
    description:
      "Transforma tu cabello con técnicas de color diseñadas especialmente para ti.",
    image: coloracionImage,
    path: "/coloracion",
  },
  {
    id: 3,
     categoryId: 3,
    title: "Extensiones",
    description:
      "Realza tu belleza con extensiones de cabello y pestañas aplicadas profesionalmente.",
    image: extensionesImage,
    path: "/extensiones",
  },
  {
    id: 4,
     categoryId: 4,
    title: "Tratamientos capilares",
    description:
      "Cuida, restaura y mejora la apariencia de tu cabello con tratamientos especializados.",
    image: tratamientosImage,
    path: "/tratamientosCapilares",
  },
  {
    id: 5,
     categoryId: 5,
    title: "Maquillaje",
    description:
      "Maquillaje profesional para eventos, celebraciones y ocasiones especiales.",
    image: maquillajeImage,
    path: "/maquillaje",
  },
];
