import { Request, Response } from 'express';
import authController from '../src/auth/auth.controller';
import authService from '../src/auth/auth.service';
import jwtUtils from '../src/utils/jwt.util';

jest.mock('../src/auth/auth.service');
jest.mock('../src/utils/jwt');

const createMockRequestResponse = () => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn();

    return { req, res, next };
};

describe('Authentication Controller', () => {
    describe('Registration', () => {
        it('Successful', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123*',
            };

            (authService.register as jest.Mock).mockResolvedValue(req.body);

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Compte créé',
            });
        });
        it('Failure', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123*',
            };

            (authService.register as jest.Mock).mockRejectedValue(new Error('Registration failed'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur interne du serveur',
            });
        });
    });
    describe('Login', () => {
        it('Successful', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123*',
            };

            (authService.findUserByName as jest.Mock).mockResolvedValue(req.body.name);
            (authService.checkPassword as jest.Mock).mockResolvedValue(true);
            (jwtUtils.signAccessToken as jest.Mock).mockResolvedValue('mockedToken');

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                token: 'mockedToken',
            });
        });
        it('Failure', async () => {
            const { req, res } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123*',
            };

            (authService.findUserByName as jest.Mock).mockResolvedValue(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "Nom d'utilisateur ou mot de passe incorrect",
            });
        });
    });
});
