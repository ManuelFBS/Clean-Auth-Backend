import { injectable, inject } from 'inversify';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { Employee } from '../entities/Employee';
import { EmployeeValidator } from '../validators/EmployeeValidator';
import { ValidationError } from '../errors';

@injectable()
export class UpdateEmployee {
    constructor(
        @inject('IEmployeeRepository')
        private repository: IEmployeeRepository,
    ) {}

    async execute(
        dto: { id: number } & Partial<Employee>,
    ): Promise<Employee> {
        const existing = await this.repository.findById(
            dto.id,
        );
        if (!existing) {
            throw new ValidationError('Employee not found');
        }

        if (dto.email && dto.email !== existing.email) {
            EmployeeValidator.validateEmail(dto.email);
        }

        existing.updateDetails(dto);
        return this.repository.update(existing);
    }
}
