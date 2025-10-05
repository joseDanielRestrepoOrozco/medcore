import express from 'express';
import userController from '../controllers/user.controller';
import tokenExtractor from '../middlewares/tokenExtractor';
import { requireRoles } from '../middlewares/requireRoles';

const router = express.Router();

// Rutas para gestión de usuarios (excluye pacientes). Protegidas para ADMINISTRADOR
router.use(tokenExtractor);
router.get('/', requireRoles('ADMINISTRADOR'), userController.getAllUsers);                    // GET /api/v1/users
router.get('/role/:role', requireRoles('ADMINISTRADOR'), userController.getUsersByRole);       // GET /api/v1/users/role/MEDICO
router.post('/', requireRoles('ADMINISTRADOR'), userController.createUser);                    // POST /api/v1/users
router.post('/bulk', requireRoles('ADMINISTRADOR'), userController.bulkCreateUsers);           // POST /api/v1/users/bulk
router.put('/:userId/role', requireRoles('ADMINISTRADOR'), userController.updateUserRole);     // PUT /api/v1/users/:id/role

export default router;
