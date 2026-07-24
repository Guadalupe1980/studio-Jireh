import cortesPeinadosImage from "../assets/images/cortesPeinadosImage.webp";
import coloracionImage from "../assets/images/coloracionImage.webp";
import extensionesImage from "../assets/images/extensionesImage.webp";
import tratamientosImage from "../assets/images/tratamientosImage.webp";
import maquillajeImage from "../assets/images/maquillajeImage.webp";

{/*Objeto de srvicios parte Hero*/}
export const homeServices = [
  {
    id: 1,
    title: "Cortes y peinados",
    description:
      "Renueva tu estilo con cortes personalizados y peinados profesionales para cada ocasión.",
    services: ["Cortes para dama", "Peinados"],
    image: cortesPeinadosImage,
    path: "/services",
  },
  {
    id: 2,
    title: "Coloración",
    description:
      "Transforma tu cabello con técnicas de color diseñadas especialmente para ti.",
    services: ["Tintes", "Diseño de color"],
    image: coloracionImage,
    path: "/services",
  },
  {
    id: 3,
    title: "Extensiones",
    description:
      "Realza tu belleza con extensiones de cabello y pestañas aplicadas profesionalmente.",
    services: ["Extensiones de pestañas"],
    image: extensionesImage,
    path: "/services",
  },
  {
    id: 4,
    title: "Tratamientos capilares",
    description:
      "Cuida, restaura y mejora la apariencia de tu cabello con tratamientos especializados.",
    services: ["Keratinas", "Botox capilar", "Alisados"],
    image: tratamientosImage,
    path: "/services",
  },
  {
    id: 5,
    title: "Maquillaje",
    description:
      "Maquillaje profesional para eventos, celebraciones y ocasiones especiales.",
    services: ["Maquillaje profesional"],
    image: maquillajeImage,
    path: "/services",
  },
];
