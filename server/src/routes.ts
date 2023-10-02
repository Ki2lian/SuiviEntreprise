import express, { Request, Response } from 'express';
import authRoutes from './auth/auth.route';
import companyRoutes from './companies/company.route';
import authMiddleware from './middlewares/auth.middleware';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

router.use('/auth', authRoutes);
router.use('/company', authMiddleware.auth, companyRoutes);

export default router;
