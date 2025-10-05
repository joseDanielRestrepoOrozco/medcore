import express from 'express';
import patientController from '../controllers/patient.controller';

const router = express.Router();

router.post('/', patientController.createPatient);
router.get('/', patientController.listPatients);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.patch('/state/:id', patientController.updatePatientState);

export default router;
