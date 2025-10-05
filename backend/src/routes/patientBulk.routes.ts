import express from 'express';
import patientBulkController from '../controllers/patientBulk.controller';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.post('/bulk-import', upload.single('file'), patientBulkController.bulkImportPatients);

export default router;
