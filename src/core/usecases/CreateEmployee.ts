import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { Employee } from '../entities/Employee';
import { EmployeeValidator } from '../validators/EmployeeValidator';
import { DatabaseError, ValidationError } from '../errors';
import { EmployeeRole } from '../entities/Role';

export class CreateEmployee {
    constructor(
        private employeeRepository: IEmployeeRepository,
    ) {}

    async execute(input: {
        dni: string;
        name: string;
        lastName: string;
        email: string;
        phone?: string;
        role: string;
    }): Promise<Employee> {
        //* Validación...
        EmployeeValidator.validateEmployeeData(input);

        //* Verificar unicidad...
        if (
            await this.employeeRepository.existsByDNI(
                input.dni,
            )
        ) {
            throw new ValidationError(
                'Employee with this DNI already exists...!',
            );
        }

        if (
            await this.employeeRepository.existsByEmail(
                input.email,
            )
        ) {
            throw new ValidationError(
                'Employee with this email already exists...!',
            );
        }

        //* Crear entidad...
        const employee = new Employee(
            0, //> ID temporal...
            input.dni,
            input.name,
            input.lastName,
            input.email,
            input.phone || '',
            input.role as EmployeeRole,
            new Date(),
            new Date(),
        );

        //* Persistir...
        try {
            return await this.employeeRepository.save(
                employee,
            );
        } catch (error) {
            throw new DatabaseError(
                'Failed to create new employee...!',
            );
        }
    }
}
