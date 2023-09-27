import express from 'express';
import authController from './auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', authMiddleware.validateRegistrationData, authController.register);

export default router;
