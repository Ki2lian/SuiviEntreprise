import { Request, Response, NextFunction } from 'express';
import jwtUtils from '../utils/jwt.util';

const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return username && username.trim() !== '' && usernameRegex.test(username);
};

const validateRegistrationData = (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    if (!validateUsername(name)) {
        return res.status(400).json({ error: "Nom d'utilisateur invalide" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/; // eslint-disable-line
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Le mot de passe doit respecter les critères de complexité' });
    }

    next();
};

const validateLoginData = (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    if (!validateUsername(name)) {
        return res.status(400).json({ error: "Nom d'utilisateur invalide" });
    }

    if (!password || password.trim() === '') {
        return res.status(400).json({ error: 'Mot de passe requis' });
    }

    next();
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        await jwtUtils.verifyAccessToken(token).then(user => {
            req.user = user as { payload: { userId: number } };
            next();
        });
    } else {
        return res.status(401).json({ error: 'Authentification requise' });
    }
};

export default { validateRegistrationData, validateLoginData, auth };
