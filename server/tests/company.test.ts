import { Request, Response } from 'express';
import companyService from '../src/companies/company.service';
import companyController from '../src/companies/company.controller';
import companyMiddleware from '../src/middlewares/company.middleware';

const companyServiceAddCompanyMock = jest.spyOn(companyService, 'addCompany');
const companyData = {
    name: 'Example Company',
    description: 'A sample description',
    location: 'Sample Location',
    website: 'https://example.com',
    applicationDate: new Date(),
};

const createMockRequestResponse = () => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn();

    return { req, res, next };
};

describe('Company', () => {
    describe('Controller', () => {
        describe('Add Company', () => {
            it('should create new company', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                };
                req.user = { payload: { userId: 1 } };

                companyServiceAddCompanyMock.mockResolvedValue(req.body);
                await companyController.addCompany(req, res);

                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith(companyData);
            });
            it('should return 500', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                };
                req.user = { payload: { userId: 1 } };

                companyServiceAddCompanyMock.mockRejectedValue(new Error('Add company failed'));

                await companyController.addCompany(req, res);

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: 'Erreur interne du serveur',
                });
            });
        });
    });
    describe('Middleware', () => {
        describe('validateAddCompanyData', () => {
            it('should call next() if data is valid', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                };
                req.user = { payload: { userId: 1 } };

                companyMiddleware.validateAddCompanyData(req, res, next);

                expect(next).toHaveBeenCalled();
            });
            it('should return a 400 status if name is missing', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                    name: undefined,
                };

                companyMiddleware.validateAddCompanyData(req, res, next);

                expect(next).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ error: "Nom de l'entreprise requis" });
            });
            it('should return a 400 status if URL is not valid', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                    website: 'invalid',
                };

                companyMiddleware.validateAddCompanyData(req, res, next);

                expect(next).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ error: 'URL du site web invalide' });
            });
            it('should return a 400 status if date is not valid', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                    applicationDate: 'invalid',
                };

                companyMiddleware.validateAddCompanyData(req, res, next);

                expect(next).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ error: 'Date de candidature invalide' });
            });
        });
    });
});
