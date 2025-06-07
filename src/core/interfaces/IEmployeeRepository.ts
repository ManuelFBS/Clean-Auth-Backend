import { Employee } from '../entities/Employee';
import { EmployeeRole } from '../entities/Role';

export interface IEmployeeRepository {
    //* Operaciones básicas CRUD...
    save(employee: Employee): Promise<Employee>;
    findById(id: number): Promise<Employee | null>;
    findAll(): Promise<Employee[]>;
    update(employee: Employee): Promise<Employee>;
    delete(dni: string): Promise<void>;

    //* Búsquedas específicas...
    findByDNI(dni: string): Promise<Employee | null>;
    findByEmail(email: string): Promise<Employee | null>;
    findByRole(role: EmployeeRole): Promise<Employee[]>;

    //* Búsquedas avanzadas...
    existsByDNI(dni: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
}
