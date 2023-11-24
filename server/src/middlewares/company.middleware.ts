import { Request, Response, NextFunction } from 'express';
import validationUtil from '../utils/validation.util';
import { validStates } from '../companies/company.interface';

const validateCompanyData = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, location, website, applicationDate, state } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "Nom de l'entreprise requis" });
    }

    if (description && description.length > 4000) {
        return res.status(400).json({ error: "Description de l'entreprise trop longue" });
    }

    if (location && location.length > 100) {
        return res.status(400).json({ error: "Emplacement de l'entreprise trop long" });
    }

    if (website && !validationUtil.isValidURL(website)) {
        return res.status(400).json({ error: 'URL du site web invalide' });
    }

    if (applicationDate && !validationUtil.isValidDate(applicationDate)) {
        return res.status(400).json({ error: 'Date de candidature invalide' });
    }

    if (state && !validStates.includes(state.toLowerCase())) {
        return res.status(400).json({ error: "L'état de la candidature n'est pas valide" });
    }

    next();
};

export default { validateCompanyData };
