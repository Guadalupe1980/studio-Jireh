import { Routes, Route, Outlet } from "react-router-dom";
//Rutas de nav publica/admin
import Navbar from "./components/layout/Navbar";
import AdminNavbar from "./components/admin/layout/AdminNavbar";
//Rutas publicas
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Promotions from "./pages/Promotions";
import CortesPeinados from "./pages/CortesPeinados";
import Coloracion from "./pages/Coloracion";
import Extensiones from "./pages/Extensiones";
import TratamientosCapilares from "./pages/TratamientosCapilares";
import Maquillaje from "./pages/Maquillaje";
//Rutas de admin
import Login from "./pages/Login";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import PromotionsAdmin from "./pages/admin/PromotionsAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import CreateServicio from "./components/admin/services/CreateServicio";

function App() {
  return (
    <>
    {/* Outlet: es el espacio donde React Router muestra el componente correspondiente a la ruta que abrió el usuario. */}
      <Routes>
        {/* Página pública */}
        <Route element={ <> <Navbar /> <main> <Outlet /> </main> </> } >
          <Route path="/" element={<Home />} />
          <Route path="/aboutMe" element={<AboutMe />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/cortesPeinados" element={<CortesPeinados />} />
          <Route path="/coloracion" element={<Coloracion />} />
          <Route path="/extensiones" element={<Extensiones />} />
          <Route path="/tratamientosCapilares" element={<TratamientosCapilares />} />
          <Route path="/maquillaje" element={<Maquillaje />} />
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Administración */}
        <Route element={ <> <AdminNavbar /> <main> <Outlet /> </main></> }>
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/admin/services" element={<ServicesAdmin />}></Route>
          <Route path="/admin/services/create" element={<CreateServicio />}></Route>
          <Route path="/admin/promotions" element={<PromotionsAdmin />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
