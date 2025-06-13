import { injectable, inject } from 'inversify';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { Employee } from '../entities/Employee';
import { NotFoundError } from '../errors';

@injectable()
export class GetEmployeeById {
    constructor(
        @inject('IEmployeeRepository')
        private repository: IEmployeeRepository,
    ) {}

    async execute(id: number): Promise<Employee | null> {
        const employee = await this.repository.findById(id);
        if (!employee) {
            throw new NotFoundError(
                'Employee not found...!',
            );
        }
        return employee;
    }
}
