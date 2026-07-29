{
  /*Esta página será la que junte y controle todo tu CRUD de servicios*/
}
import CreateServicio from "../../components/admin/services/CreateServicio";
import ReadServicio from "../../components/admin/services/ReadServicio";

function ServicesAdmin() {
  return (
    <>
      <main>
        <ReadServicio />
        <CreateServicio />
      </main>
    </>
  );
}

export default ServicesAdmin;
