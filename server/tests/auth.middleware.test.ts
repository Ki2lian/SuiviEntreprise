import authMiddleware from '../src/middlewares/auth.middleware';
import { Request, Response } from 'express';

const createMockRequestResponse = () => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn();

    return { req, res, next };
};

describe('AuthMiddleware', () => {
    describe('validateRegistrationData', () => {
        it('should pass with a valid password', () => {
            const { req, res, next } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123*',
            };

            authMiddleware.validateRegistrationData(req, res, next);

            expect(next).toHaveBeenCalled();
        });
        it('should return 400 if password does not respect complexity', () => {
            const { req, res, next } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123',
            };

            authMiddleware.validateRegistrationData(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Le mot de passe doit respecter les critères de complexité' });
        });
    });
    describe('validateLoginData', () => {
        it('should call next() if name and password are provided', () => {
            const { req, res, next } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
                password: 'TestPassword123*',
            };

            authMiddleware.validateLoginData(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
        it('should return 400 if name is missing', () => {
            const { req, res, next } = createMockRequestResponse();
            req.body = {
                password: 'TestPassword123*',
            };

            authMiddleware.validateLoginData(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Nom d'utilisateur requis" });
        });
        it('should return 400 if password is missing', () => {
            const { req, res, next } = createMockRequestResponse();
            req.body = {
                name: 'TestUser',
            };

            authMiddleware.validateLoginData(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Mot de passe requis' });
        });
    });
});
