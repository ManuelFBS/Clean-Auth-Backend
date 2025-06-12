import { RegisterUser } from '../../../../src/core/usecases/RegisterUser';
import { UserRepository } from '../../../../src/infrastructure/repositories/UserRepository';
import { EmailService } from '../../../../src/infrastructure/services/EmailService';
import { User } from '../../../../src/core/entities/User';
import { ApplicationError } from '../../../../src/core/errors';
import { UserValidator } from '../../../../src/core/validators/UserValidator';

describe('RegisterUser', () => {
    let registerUser: RegisterUser;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockEmailService: jest.Mocked<EmailService>;
    let mockValidator: jest.Mocked<UserValidator>;

    beforeEach(() => {
        // Configurar mocks más robustos
        mockUserRepository = {
            findByUsername: jest
                .fn()
                .mockResolvedValue(null), // Por defecto no existe
            findByEmail: jest.fn().mockResolvedValue(null),
            save: jest
                .fn()
                .mockImplementation(async (user) => ({
                    id: 1,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    isVerified: false,
                    verificationToken: 'test-token',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    roles: [],
                })),
        } as any;

        mockEmailService = {
            sendVerificationEmail: jest
                .fn()
                .mockResolvedValue(undefined),
        } as any;

        mockValidator = {
            validateUsername: jest.fn(),
            validatePassword: jest.fn(),
            validateEmail: jest.fn(),
        } as any;

        registerUser = new RegisterUser(
            mockUserRepository,
            mockEmailService,
            mockValidator,
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
            // Configurar mock específico para este test
            mockUserRepository.findByUsername.mockResolvedValueOnce(
                {
                    id: 1,
                    username: 'existinguser',
                    password: 'hash',
                    email: 'existing@example.com',
                    isVerified: true,
                    verificationToken: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    roles: [],
                },
            );

            await expect(
                registerUser.execute(
                    'existinguser',
                    'ValidPass123',
                    'test@example.com',
                ),
            ).rejects.toThrow(ApplicationError);

            expect(
                mockUserRepository.findByUsername,
            ).toHaveBeenCalledWith('existinguser');
            expect(
                mockUserRepository.save,
            ).not.toHaveBeenCalled();
        });

        it('should throw for invalid email', async () => {
            mockValidator.validateEmail.mockImplementationOnce(
                () => {
                    throw new Error('Invalid email format');
                },
            );

            await expect(
                registerUser.execute(
                    'newuser',
                    'ValidPass123',
                    'invalid-email',
                ),
            ).rejects.toThrow('Invalid email format');
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
