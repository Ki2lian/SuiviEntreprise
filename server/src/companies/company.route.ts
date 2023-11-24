import express from 'express';
import companyController from './company.controller';
import companyMiddleware from '../middlewares/company.middleware';

const router = express.Router();

router.post('/add', companyMiddleware.validateCompanyData, companyController.addCompany);
router.put('/:id', companyMiddleware.validateCompanyData, companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
