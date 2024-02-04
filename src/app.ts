import express, { Application, Router } from 'express';
import purchaseController from './controllers/purchaseController';
import clientController from './controllers/clientController';

const app: Application = express();
const router: Router = express.Router();

app.use(router);

router.get('/compras', purchaseController.getSortedPurchases)
router.get('/maior-compra/:ano', purchaseController.getBiggestPurchasesPerYear);

router.get('/clientes-fieis', clientController.getTopClients)
router.get('/recomendacao/:cliente/tipo', clientController.getRecommendationByClient)

export default app; 