import prisma from '../database';
import CompanyData from './company.interface';

const addCompany = async (companyData: CompanyData) => {
    return await prisma.company.create({
        data: {
            name: companyData.name,
            description: companyData.description,
            location: companyData.location,
            website: companyData.website,
            applicationDate: companyData.applicationDate ? companyData.applicationDate : new Date(),
            user: {
                connect: { id: companyData.userId },
            },
        },
    });
};

const updateCompany = async (companyData: CompanyData) => {
    const existingCompany = await prisma.company.findUnique({
        where: {
            id: companyData.id,
        },
    });

    if (!existingCompany) {
        return null;
    }

    if (existingCompany.userId !== companyData.userId) {
        return null;
    }

    return await prisma.company.update({
        where: {
            id: companyData.id,
        },
        data: {
            name: companyData.name,
            description: companyData.description,
            location: companyData.location,
            website: companyData.website,
            applicationDate: companyData.applicationDate,
            state: companyData.state?.toLowerCase(),
        },
    });
};

const deleteCompany = async (companyId: number, userId: number) => {
    const existingCompany = await prisma.company.findUnique({
        where: {
            id: companyId,
        },
    });

    if (!existingCompany) {
        return null;
    }

    if (existingCompany.userId !== userId) {
        return null;
    }

    return await prisma.company.delete({
        where: {
            id: companyId,
        },
    });
};

export default { addCompany, updateCompany, deleteCompany };
