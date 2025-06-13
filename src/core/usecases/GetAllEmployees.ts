import { injectable, inject } from 'inversify';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { Employee } from '../entities/Employee';

@injectable()
export class GetAllEmployees {
    constructor(
        @inject('IEmployeeRepository')
        private repository: IEmployeeRepository,
    ) {}

    async execute(): Promise<Employee[]> {
        return this.repository.findAll();
    }
}
