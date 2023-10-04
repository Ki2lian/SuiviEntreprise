import { Request, Response } from 'express';
import companyService from './company.service';
import CreateCompany from './company.interface';

const addCompany = async (req: Request, res: Response) => {
    try {
        const userId = req.user.payload.userId;
        const { name, description, location, website, applicationDate }: CreateCompany = req.body;
        const companyData = { name, description, location, website, applicationDate, userId };
        const company = await companyService.addCompany(companyData);
        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

export default { addCompany };
