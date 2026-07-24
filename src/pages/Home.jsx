import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import ServicePreview from "../components/ServicePreview";
import Footer from "../components/layout/Footer";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    // Si nadie presionó Servicios, no hacemos nada
    if (!sectionId) {
      return;
    }

    const timer = setTimeout(() => {
      const section = document.getElementById(sectionId);

      section?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Limpiamos el estado para que no vuelva a bajar al recargar
      navigate("/", {
        replace: true,
        state: null,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  return (
    <>
      <HeroSection />
      <ServicePreview />
      <Footer />
    </>
  );
}

export default Home;
