import bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';
import { UserValidator } from '../validators/UserValidator';
import { EmailService } from '../../infrastructure/services/EmailService';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationError } from '../errors';

@injectable()
export class RegisterUser {
    constructor(
        @inject('IUserRepository')
        private userRepository: IUserRepository,
        @inject('EmailService')
        private emailService: EmailService,
    ) {}

    async execute(
        username: string,
        password: string,
        email: string,
    ): Promise<User> {
        try {
            // Validaciones
            UserValidator.validateUsername(username);
            UserValidator.validatePassword(password);
            UserValidator.validateEmail(email);

            // Verificar unicidad
            const existingUser =
                await this.userRepository.findByUsername(
                    username,
                );
            if (existingUser) {
                throw new ApplicationError(
                    'Username already exists',
                    'USERNAME_EXISTS',
                    400,
                );
            }

            const existingEmail =
                await this.userRepository.findByEmail(
                    email,
                );
            if (existingEmail) {
                throw new ApplicationError(
                    'Email already registered',
                    'EMAIL_EXISTS',
                    400,
                );
            }

            // Crear token de verificación
            const verificationToken = uuidv4();

            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(
                password,
                10,
            );

            // Crear nueva instancia de usuario
            const newUser = User.create({
                username,
                password: hashedPassword,
                email,
                verificationToken,
            });

            // Enviar email de verificación
            await this.emailService.sendVerificationEmail(
                email,
                verificationToken,
            );

            // Guardar en base de datos
            const createdUser =
                await this.userRepository.save(newUser);

            return createdUser;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError(
                'Registration failed',
                'REGISTRATION_FAILED',
                500,
            );
        }
    }
}
