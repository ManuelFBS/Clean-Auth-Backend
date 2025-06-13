import { injectable, inject } from 'inversify';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { Employee } from '../entities/Employee';
import { NotFoundError } from '../errors';

@injectable()
export class GetEmployeeByDNI {
    constructor(
        @inject('IEmployeeRepository')
        private repository: IEmployeeRepository,
    ) {}

    async execute(dni: string): Promise<Employee | null> {
        const employee =
            await this.repository.findByDNI(dni);
        if (!employee) {
            throw new NotFoundError(
                'Employee not found...!',
            );
        }
        return employee;
    }
}
