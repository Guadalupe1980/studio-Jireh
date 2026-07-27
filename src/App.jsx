import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Promotions from "./pages/Promotions";
import CortesPeinados from "./pages/CortesPeinados";
import Coloracion from "./pages/Coloracion";
import Extensiones from "./pages/Extensiones";
import TratamientosCapilares from "./pages/TratamientosCapilares";
import Maquillaje from "./pages/Maquillaje";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutMe" element={<AboutMe />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/cortesPeinados" element={<CortesPeinados />} />
          <Route path="/coloracion" element={<Coloracion />} />
          <Route path="/extensiones" element={<Extensiones />} />
          <Route path="/tratamientosCapilares" element={<TratamientosCapilares />} />
          <Route path="/maquillaje" element={<Maquillaje />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
