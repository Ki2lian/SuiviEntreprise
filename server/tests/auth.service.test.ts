import authService from '../src/auth/auth.service';
import { prismaMock } from './singleton';

jest.mock('bcrypt', () => ({
    hashSync: (data: string, saltOrRounds: string | number) => data,
}));

describe('AuthService', () => {
    it('should create new user ', async () => {
        const user = {
            id: 1,
            name: 'testuser',
            password: 'Testpassword123*',
            createdAt: new Date('2023-09-26T19:19:50.000Z'),
        };

        prismaMock.user.create.mockResolvedValue(user);

        await expect(authService.register(user)).resolves.toEqual({
            id: 1,
            name: 'testuser',
            password: 'Testpassword123*',
            createdAt: new Date('2023-09-26T19:19:50.000Z'),
        });
    });
});
