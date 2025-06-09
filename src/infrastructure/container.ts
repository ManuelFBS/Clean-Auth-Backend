import { Container } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/IEmployeeRepository';
import { EmployeeRepository } from './repositories/EmployeeRepository';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { UserRepository } from './repositories/UserRepository';
import { AuthenticateUser } from '../core/usecases/AuthenticateUser';
import { RegisterUser } from '../core/usecases/RegisterUser';
import { AuthController } from '../application/controllers/AuthController';
import { createConnection } from './db/database';

export const container = new Container();

export async function setupContainer() {
    const connection = await createConnection();

    container
        .bind<IEmployeeRepository>('IEmployeeRepository')
        .toDynamicValue(
            () => new EmployeeRepository(connection),
        )
        .inRequestScope();

    container
        .bind<IUserRepository>('IUserRepository')
        .toDynamicValue(
            () => new UserRepository(connection),
        )
        .inRequestScope();

    container
        .bind<AuthenticateUser>(AuthenticateUser)
        .toSelf()
        .inRequestScope();

    container
        .bind<RegisterUser>(RegisterUser)
        .toSelf()
        .inRequestScope();

    container
        .bind<AuthController>(AuthController)
        .toSelf()
        .inRequestScope();
}
