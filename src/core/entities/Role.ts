export enum EmployeeRole {
    ADMIN = 'Admin',
    EMPLOYEE = 'Employee',
}

//~ Se pueden agregar métodos útiles para el enum...
export namespace EmployeeRole {
    export function getAll(): EmployeeRole[] {
        return [EmployeeRole.ADMIN, EmployeeRole.EMPLOYEE];
    }

    export function isValid(role: string): boolean {
        return EmployeeRole.getAll().includes(
            role as EmployeeRole,
        );
    }
}
