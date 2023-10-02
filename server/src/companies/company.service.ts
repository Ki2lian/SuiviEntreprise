import prisma from '../database';
import CreateCompany from './company.interface';

const addCompany = async (companyData: CreateCompany) => {
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

export default { addCompany };
