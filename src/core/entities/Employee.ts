import { EmployeeRole } from './Role';

export class Employee {
    constructor(
        public id: number,
        public dni: string,
        public name: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public role: EmployeeRole,
        public readonly createdAt: Date,
        public updatedAt: Date,
    ) {}

    //* Método para serializar el objeto (ocultar campos sensibles)...
    toJSON() {
        return {
            id: this.id,
            dni: this.dni,
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    //* Métodos de negocio pueden ir aquí...
    isAdmin(): boolean {
        return this.role === EmployeeRole.ADMIN;
    }

    updateDetails(
        details: Partial<
            Omit<
                Employee,
                'id' | 'dni' | 'createdAt' | 'updatedAt'
            >
        >,
    ) {
        this.name = details.name || this.name;
        this.lastName = details.lastName || this.lastName;
        this.email = details.email || this.email;
        this.phone = details.phone || this.phone;
        this.role = details.role || this.role;
        this.updatedAt = new Date();
    }
}
