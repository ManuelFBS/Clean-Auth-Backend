import { ValidationError } from '../errors';
import { EmployeeRole } from '../entities/Role';

export class EmployeeValidator {
    static validateDNI(dni: string): void {
        if (!dni)
            throw new ValidationError(
                'DNI is required...!',
            );
        if (dni.length < 8)
            throw new ValidationError(
                'DNI must be at least 8 characters...!',
            );
    }

    static validateName(name: string): void {
        if (!name)
            throw new ValidationError(
                'Name is required...!',
            );
        if (name.length < 2)
            throw new ValidationError(
                'Name must be at least 2 characters...!',
            );
    }

    static validateLastName(last_name: string): void {
        if (!last_name)
            throw new ValidationError(
                'Name is required...!',
            );
        if (last_name.length < 2)
            throw new ValidationError(
                'Name must be at least 2 characters...!',
            );
    }

    static validateEmail(email: string): void {
        if (!email)
            throw new ValidationError(
                'Email is required...!',
            );
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new ValidationError(
                'Invalid email format...!',
            );
        }
    }

    static validateRole(role: string): void {
        if (!EmployeeRole.isValid(role)) {
            throw new ValidationError(
                `Invalid role. Valid roles are: ${EmployeeRole.getAll().join(', ')}`,
            );
        }
    }

    static validateEmployeeData(data: {
        dni: string;
        name: string;
        lastName: string;
        email: string;
        role: string;
    }): void {
        this.validateDNI(data.dni);
        this.validateName(data.name);
        this.validateLastName(data.lastName);
        this.validateEmail(data.email);
        this.validateRole(data.role);
    }
}
