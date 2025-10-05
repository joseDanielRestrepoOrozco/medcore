import express from 'express';
import patientController, { bulkImport } from '../controllers/patient.controller';
import tokenExtractor from '../middlewares/tokenExtractor';
import { requireRoles } from '../middlewares/requireRoles';

const router = express.Router();

// Seguridad: JWT y RBAC
router.use(tokenExtractor);

// Listado disponible para ADMINISTRADOR / MEDICO / ENFERMERA
router.get('/', requireRoles('ADMINISTRADOR', 'MEDICO', 'ENFERMERA'), patientController.listPatients);
router.get('/:id', requireRoles('ADMINISTRADOR', 'MEDICO', 'ENFERMERA'), patientController.getPatientById);

// Crear / actualizar solo ADMINISTRADOR
router.post('/', requireRoles('ADMINISTRADOR'), patientController.createPatient);
router.put('/:id', requireRoles('ADMINISTRADOR'), patientController.updatePatient);
router.patch('/state/:id', requireRoles('ADMINISTRADOR'), patientController.updatePatientState);

// Carga masiva (JSON por ahora). Pendiente: multipart CSV/XLSX con límite 60MB
router.post('/bulk-import', requireRoles('ADMINISTRADOR'), bulkImport as any);

export default router;
