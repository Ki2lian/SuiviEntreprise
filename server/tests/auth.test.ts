/* eslint-disable no-empty-function */
import { Request, Response } from 'express';
import authController from '../src/auth/auth.controller';
import authService from '../src/auth/auth.service';
import authMiddleware from '../src/middlewares/auth.middleware';
import jwtUtils from '../src/utils/jwt.util';
import { prismaMock } from './singleton';

jest.mock('../src/utils/jwt.util');
jest.mock('bcrypt', () => ({
    hashSync: (data: string) => data,
}));
const authServiceRegisterMock = jest.spyOn(authService, 'register');
const authServiceFindUserByNameMock = jest.spyOn(authService, 'findUserByName');
const authServiceCheckPasswordMock = jest.spyOn(authService, 'checkPassword');

const createMockRequestResponse = () => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn();

    return { req, res, next };
};

describe('Authentication', () => {
    describe('Service', () => {
        it('should create new user ', async () => {
            const today = new Date();
            const user = {
                id: 1,
                name: 'testuser',
                password: 'Testpassword123*',
                createdAt: today,
            };

            prismaMock.user.create.mockResolvedValue(user);

            await expect(authService.register(user)).resolves.toEqual({
                id: 1,
                name: 'testuser',
                password: 'Testpassword123*',
                createdAt: today,
            });
        });
    });
    describe('Controller', () => {
        describe('Registration', () => {
            it('should create new user', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    name: 'TestUser',
                    password: 'TestPassword123*',
                };
                const serviceMock = jest.spyOn(authService, 'register');
                serviceMock.mockResolvedValue(req.body);

                await authController.register(req, res);

                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Compte créé',
                });
            });
            it('should return 500', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    name: 'TestUser',
                    password: 'TestPassword123*',
                };

                authServiceRegisterMock.mockRejectedValue(new Error('Registration failed'));

                await authController.register(req, res);

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: 'Erreur interne du serveur',
                });
            });
        });
        describe('Login', () => {
            it('should login', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    name: 'TestUser',
                    password: 'TestPassword123*',
                };

                authServiceFindUserByNameMock.mockResolvedValue(req.body.name);
                authServiceCheckPasswordMock.mockResolvedValue(true);
                (jwtUtils.signAccessToken as jest.Mock).mockResolvedValue('mockedToken');

                await authController.login(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    token: 'mockedToken',
                });
            });
            it('should return 401', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    name: 'TestUser',
                    password: 'TestPassword123*',
                };

                authServiceFindUserByNameMock.mockResolvedValue(null);

                await authController.login(req, res);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Nom d'utilisateur ou mot de passe incorrect",
                });
            });
        });
    });
    describe('Middleware', () => {
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
});
