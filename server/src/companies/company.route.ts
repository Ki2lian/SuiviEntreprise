import express from 'express';
import companyController from './company.controller';
import companyMiddleware from '../middlewares/company.middleware';

const router = express.Router();

router.post('/add', companyMiddleware.validateAddCompanyData, companyController.addCompany);

export default router;
