import { Request, Response } from 'express';
import companyService from './company.service';
import CompanyData from './company.interface';

const addCompany = async (req: Request, res: Response) => {
    try {
        const userId = req.user.payload.userId;
        const { name, description, location, website, applicationDate }: CompanyData = req.body;
        const companyData = { name, description, location, website, applicationDate, userId };
        const company = await companyService.addCompany(companyData);
        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const updateCompany = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description, location, website, applicationDate, state }: CompanyData = req.body;
        const companyData = { id, name, description, location, website, applicationDate, state };
        const company = await companyService.updateCompany(companyData);

        if (!company) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }

        return res.status(200).json(company);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const deleteCompany = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const company = await companyService.deleteCompany(id);

        if (!company) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

export default { addCompany, updateCompany, deleteCompany };
