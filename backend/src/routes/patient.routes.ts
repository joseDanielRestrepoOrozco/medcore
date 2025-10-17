import express from 'express';
import patientController from '../controllers/patient.controller';
import tokenExtractor from '../middlewares/tokenExtractor';
import { requireRoles } from '../middlewares/requireRoles';
import { upload } from '../middlewares/upload';
import patientBulkController from '../controllers/patientBulk.controller';
import multer from '../config/multer';

const router = express.Router();

// Seguridad: JWT y RBAC
router.use(tokenExtractor);

// Listado disponible para ADMINISTRADOR / MEDICO / ENFERMERA
router.get(
  '/',
  requireRoles('ADMINISTRADOR', 'MEDICO', 'ENFERMERA'),
  patientController.listPatients
);
router.get(
  '/:id',
  requireRoles('ADMINISTRADOR', 'MEDICO', 'ENFERMERA'),
  patientController.getPatientById
);

// cargar archivos diagnósticos
router.post(
  '/:patientId/diagnostics',
  requireRoles('MEDICO'),
  multer.uploadMultiple,
  patientController.createDiagnostic
);

// Crear / actualizar solo ADMINISTRADOR
router.post(
  '/',
  requireRoles('ADMINISTRADOR'),
  patientController.createPatient
);
router.put(
  '/:id',
  requireRoles('ADMINISTRADOR'),
  patientController.updatePatient
);
router.patch(
  '/state/:id',
  requireRoles('ADMINISTRADOR'),
  patientController.updatePatientState
);

router.post(
  '/bulk-import',
  requireRoles('ADMINISTRADOR'),
  upload.single('file'),
  patientBulkController.bulkImportPatients
);

export default router;
