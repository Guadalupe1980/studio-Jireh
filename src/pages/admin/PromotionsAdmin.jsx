{/*Esta página será la que junte y controle todo tu CRUD de promociones*/}
import CreatePromotion from "../../components/admin/promotions/CreatePromotion";
import ReadPromotion from "../../components/admin/promotions/ReadPromotion";

function PromotionsAdmin() {
  return (
    <main>
      <h1>Panel de promociones</h1>

      <CreatePromotion />
      <ReadPromotion />
    </main>
  );
}

export default PromotionsAdmin;
