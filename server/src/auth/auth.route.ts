import express from 'express';
import authController from './auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', authMiddleware.validateRegistrationData, authController.register);
router.post('/login', authMiddleware.validateLoginData, authController.login);

export default router;
