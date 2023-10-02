import authService from './auth.service';
import { Request, Response } from 'express';
import jwtUtils from '../utils/jwt.util';

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

const login = async (req: Request, res: Response) => {
    const { name, password } = req.body;

    try {
        const user = await authService.findUserByName(name);
        const errorResponse = { error: "Nom d'utilisateur ou mot de passe incorrect" };

        if (!user) {
            return res.status(401).json(errorResponse);
        }

        const isPasswordValid = await authService.checkPassword(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).json(errorResponse);
        }

        const token = await jwtUtils.signAccessToken({ userId: user.id });

        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la connexion" });
    }
};

export default { register, login };
