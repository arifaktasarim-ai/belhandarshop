import { Router } from 'express';
import { generatePdfReport, generateExcelReport } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, authorize('ADMIN', 'STAFF'));

// type: products | stock | critical
router.get('/:type/pdf', generatePdfReport);
router.get('/:type/excel', generateExcelReport);

export default router;
