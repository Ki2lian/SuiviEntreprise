import authService from './auth.service';
import { Request, Response } from 'express';

const register = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const existingUser = await authService.findUserByName(name);
        if (existingUser) {
            return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
        }
        await authService.register({ name, password });
        res.status(201).json({
            message: 'Compte créé',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

export default { register };
