import express from 'express';
import patientController from '../controllers/patient.controller';
import tokenExtractor from '../middlewares/tokenExtractor';
import { requireRoles } from '../middlewares/requireRoles';
import { upload } from '../middlewares/upload';

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
  patientController.bulkImportCsv
);

export default router;
