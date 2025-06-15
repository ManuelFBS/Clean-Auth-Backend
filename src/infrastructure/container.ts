import { Container } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/IEmployeeRepository';
import { EmployeeRepository } from './repositories/EmployeeRepository';
import { CreateEmployee } from '../core/usecases/CreateEmployee';
import { GetAllEmployees } from '../core/usecases/GetAllEmployees';
import { GetEmployeeById } from '../core/usecases/GetEmployeeById';
import { GetEmployeeByDNI } from '../core/usecases/GetEmployeeByDNI';
import { UpdateEmployee } from '../core/usecases/UpdateEmployee';
import { DeleteEmployee } from '../core/usecases/DeleteEmployee';
import { EmployeeController } from '../application/controllers/EmployeeController';
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

    container
        .bind<CreateEmployee>(CreateEmployee)
        .toSelf()
        .inRequestScope();
    container
        .bind<GetAllEmployees>(GetAllEmployees)
        .toSelf()
        .inRequestScope();
    container
        .bind<GetEmployeeById>(GetEmployeeById)
        .toSelf()
        .inRequestScope();
    container
        .bind<GetEmployeeByDNI>(GetEmployeeByDNI)
        .toSelf()
        .inRequestScope();
    container
        .bind<UpdateEmployee>(UpdateEmployee)
        .toSelf()
        .inRequestScope();
    container
        .bind<DeleteEmployee>(DeleteEmployee)
        .toSelf()
        .inRequestScope();
    container
        .bind<EmployeeController>(EmployeeController)
        .toSelf()
        .inRequestScope();

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
