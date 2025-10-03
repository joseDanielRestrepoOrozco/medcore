import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

// Rutas para gestión de usuarios
router.get('/', userController.getAllUsers);                    // GET /api/v1/users
router.post('/', userController.createUser);                    // POST /api/v1/users
router.post('/bulk', userController.bulkCreateUsers);           // POST /api/v1/users/bulk
router.get('/role/:role', userController.getUsersByRole);       // GET /api/v1/users/role/MEDICO
router.put('/:userId/role', userController.updateUserRole);     // PUT /api/v1/users/:id/role

export default router;