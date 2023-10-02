import { Request, Response, NextFunction } from 'express';

const validateRegistrationData = (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "Nom d'utilisateur requis" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/; // eslint-disable-line
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Le mot de passe doit respecter les critères de complexité' });
    }

    next();
};

const validateLoginData = (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "Nom d'utilisateur requis" });
    }

    if (!password || password.trim() === '') {
        return res.status(400).json({ error: 'Mot de passe requis' });
    }

    next();
};

export default { validateRegistrationData, validateLoginData };
