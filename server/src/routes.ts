import express, { Request, Response } from 'express';
import authRoutes from './auth/auth.route';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

router.use('/auth', authRoutes);

export default router;
