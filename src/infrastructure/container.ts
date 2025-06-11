import { Container } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/IEmployeeRepository';
import { EmployeeRepository } from './repositories/EmployeeRepository';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { UserRepository } from './repositories/UserRepository';
import { AuthenticateUser } from '../core/usecases/AuthenticateUser';
import { EmailService } from './services/EmailService';
import { RegisterUser } from '../core/usecases/RegisterUser';
import { AuthController } from '../application/controllers/AuthController';
import { createConnection } from './db/database';

export const container = new Container();

export async function setupContainer() {
    const connection = await createConnection();

    if (!container.isBound('IEmployeeRepository')) {
        container
            .bind<IEmployeeRepository>(
                'IEmployeeRepository',
            )
            .toDynamicValue(
                () => new EmployeeRepository(connection),
            )
            .inRequestScope();
    }

    if (!container.isBound('IUserRepository')) {
        container
            .bind<IUserRepository>('IUserRepository')
            .toDynamicValue(
                () => new UserRepository(connection),
            )
            .inRequestScope();
    }

    //* Registrar servicios...
    if (!container.isBound('EmailService')) {
        container
            .bind<EmailService>('EmailService')
            .to(EmailService)
            .inSingletonScope();
    }

    if (!container.isBound(AuthenticateUser)) {
        container
            .bind<AuthenticateUser>(AuthenticateUser)
            .toSelf()
            .inRequestScope();
    }

    if (!container.isBound(RegisterUser)) {
        container
            .bind<RegisterUser>(RegisterUser)
            .toSelf()
            .inRequestScope();
    }

    if (!container.isBound(AuthController)) {
        container
            .bind<AuthController>(AuthController)
            .toSelf()
            .inRequestScope();
    }
}
