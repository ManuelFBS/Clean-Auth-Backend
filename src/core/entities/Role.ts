export enum EmployeeRole {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE',
    MODERATOR = 'MODERATOR',
}

//~ Se pueden agregar métodos útiles para el enum...
export namespace EmployeeRole {
    export function getAll(): EmployeeRole[] {
        return [
            EmployeeRole.ADMIN,
            EmployeeRole.EMPLOYEE,
            EmployeeRole.MODERATOR,
        ];
    }

    export function isValid(role: string): boolean {
        return EmployeeRole.getAll().includes(
            role as EmployeeRole,
        );
    }
}
