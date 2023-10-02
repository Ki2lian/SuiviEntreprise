import prisma from '../database';
import bcrypt from 'bcrypt';
import CreateUser from '../users/user.interface';

const register = async (user: CreateUser) => {
    user.password = bcrypt.hashSync(user.password, 8);

    return await prisma.user.create({
        data: {
            name: user.name,
            password: user.password,
        },
    });
};

const findUserByName = async (name: string) => {
    return await prisma.user.findUnique({
        where: {
            name,
        },
    });
};

const checkPassword = async (hashedPassword: string, password: string) => {
    return bcrypt.compare(password, hashedPassword);
};

export default { register, findUserByName, checkPassword };
