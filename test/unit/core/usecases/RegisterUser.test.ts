import { RegisterUser } from '../../../../src/core/usecases/RegisterUser';
import { IUserRepository } from '../../../../src/core/interfaces/IUserRepository';
import { EmailService } from '../../../../src/infrastructure/services/EmailService';
import { User } from '../../../../src/core/entities/User';
import { ApplicationError } from '../../../../src/core/errors';
import { UserValidator } from '../../../../src/core/validators/UserValidator';

// Mock completo de UserRepository
const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByUsername: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
    save: jest
        .fn()
        .mockImplementation(
            async (user: User) =>
                new User(
                    1,
                    user.username,
                    user.password,
                    user.email,
                    false,
                    'test-token',
                    new Date(),
                    new Date(),
                    [],
                ),
        ),
    // Añadir otros métodos requeridos por la interfaz
    // update: jest.fn(),
    // delete: jest.fn(),
    // findById: jest.fn(),
};

// Mock completo de EmailService
const mockEmailService: jest.Mocked<
    Pick<EmailService, 'sendVerificationEmail'>
> = {
    sendVerificationEmail: jest
        .fn()
        .mockResolvedValue(undefined),
};

// Mock completo de UserValidator
const mockValidator: jest.Mocked<UserValidator> = {
    validateUsername: jest.fn(),
    validatePassword: jest.fn(),
    validateEmail: jest.fn(),
};

describe('RegisterUser', () => {
    let registerUser: RegisterUser;

    beforeEach(() => {
        // Resetear todos los mocks antes de cada test
        jest.clearAllMocks();

        registerUser = new RegisterUser(
            mockUserRepository,
            mockEmailService as unknown as EmailService,
        );
    });

    describe('execute()', () => {
        it('should register a new user successfully', async () => {
            const result = await registerUser.execute(
                'newuser',
                'ValidPass123',
                'new@example.com',
            );

            expect(result.id).toBe(1);
            expect(
                mockUserRepository.save,
            ).toHaveBeenCalled();
            expect(
                mockEmailService.sendVerificationEmail,
            ).toHaveBeenCalled();
        });

        it('should throw for existing username', async () => {
            mockUserRepository.findByUsername.mockResolvedValueOnce(
                new User(
                    1,
                    'existinguser',
                    'hash',
                    'existing@example.com',
                    true,
                    null,
                    new Date(),
                    new Date(),
                    [],
                ),
            );

            await expect(
                registerUser.execute(
                    'existinguser',
                    'ValidPass123',
                    'test@example.com',
                ),
            ).rejects.toThrow(ApplicationError);
        });

        it('should hash the password before saving', async () => {
            const result = await registerUser.execute(
                'newuser',
                'ValidPass123',
                'new@example.com',
            );

            expect(result.password).not.toBe(
                'ValidPass123',
            );
            expect(result.password.startsWith('$2b$')).toBe(
                true,
            );
        });
    });
});
