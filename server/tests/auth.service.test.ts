import authService from '../src/auth/auth.service';
import { prismaMock } from './singleton';

jest.mock('bcrypt', () => ({
    hashSync: (data: string) => data,
}));

describe('AuthService', () => {
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
