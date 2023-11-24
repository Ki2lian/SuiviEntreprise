import { Request, Response } from 'express';
import companyService from '../src/companies/company.service';
import companyController from '../src/companies/company.controller';
import companyMiddleware from '../src/middlewares/company.middleware';

const companyServiceAddCompanyMock = jest.spyOn(companyService, 'addCompany');
const companyServiceUpdateCompanyMock = jest.spyOn(companyService, 'updateCompany');
const companyServiceDeleteCompanyMock = jest.spyOn(companyService, 'deleteCompany');
const companyData = {
    name: 'Example Company',
    description: 'A sample description',
    location: 'Sample Location',
    website: 'https://example.com',
    applicationDate: new Date(),
};

const updateCompanyData = {
    ...companyData,
};

const createMockRequestResponse = () => {
    const req = {} as Request;
    req.user = { payload: { userId: 1 } };
    req.body = {};
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
        describe('Update Company', () => {
            it('should update an existing company', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    ...updateCompanyData,
                };
                req.params = { id: '1' };

                companyServiceUpdateCompanyMock.mockResolvedValue(req.body);
                await companyController.updateCompany(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(updateCompanyData);
            });
            it('should return 404 if the company does not exist', async () => {
                const { req, res } = createMockRequestResponse();
                req.body = {
                    ...updateCompanyData,
                };
                req.params = { id: '1' };

                companyServiceUpdateCompanyMock.mockResolvedValue(null);

                await companyController.updateCompany(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ error: 'Entreprise non trouvée' });
            });
        });
        describe('Delete Company', () => {
            it('should delete an existing company', async () => {
                const { req, res } = createMockRequestResponse();
                req.params = { id: '1' };

                companyServiceDeleteCompanyMock.mockResolvedValue(req.body);
                await companyController.deleteCompany(req, res);
                expect(res.status).toHaveBeenCalledWith(204);
            });
            it('should return 404 if the company does not exist', async () => {
                const { req, res } = createMockRequestResponse();
                req.params = { id: '1' };

                companyServiceDeleteCompanyMock.mockResolvedValue(null);
                await companyController.deleteCompany(req, res);

                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ error: 'Entreprise non trouvée' });
            });
        });
    });
    describe('Middleware', () => {
        describe('validateCompanyData', () => {
            it('should call next() if data is valid', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                };

                companyMiddleware.validateCompanyData(req, res, next);

                expect(next).toHaveBeenCalled();
            });
            it('should return a 400 status if name is missing', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                    name: undefined,
                };

                companyMiddleware.validateCompanyData(req, res, next);

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

                companyMiddleware.validateCompanyData(req, res, next);

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

                companyMiddleware.validateCompanyData(req, res, next);

                expect(next).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ error: 'Date de candidature invalide' });
            });
            it('should return a 400 status if state is not valid', async () => {
                const { req, res, next } = createMockRequestResponse();
                req.body = {
                    ...companyData,
                    state: 'invalid',
                };

                companyMiddleware.validateCompanyData(req, res, next);

                expect(next).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ error: "L'état de la candidature n'est pas valide" });
            });
        });
    });
});
