import { Router } from 'express';
import { createStockMovement, getStockMovements, getCriticalStock } from '../controllers/stock.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, authorize('ADMIN', 'STAFF'));

router.post('/movements', createStockMovement);
router.get('/movements', getStockMovements);
router.get('/critical', getCriticalStock);

export default router;
