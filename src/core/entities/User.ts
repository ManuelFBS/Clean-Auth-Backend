import { EmployeeRole } from './Role';

export class User {
    constructor(
        public readonly id: number,
        public username: string,
        public password: string,
        public email: string,
        public isVerified: boolean,
        public verificationToken: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date,
        public roles: EmployeeRole[],
    ) {}

    // Método para serialización (oculta campos sensibles)
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            isVerified: this.isVerified,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            roles: this.roles,
        };
    }

    //* Métodos de negocio...
    hasRole(role: EmployeeRole): boolean {
        return this.roles.includes(role);
    }

    addRole(role: EmployeeRole): void {
        if (!this.hasRole(role)) {
            this.roles.push(role);
            this.updatedAt = new Date();
        }
    }

    removeRole(role: EmployeeRole): void {
        this.roles = this.roles.filter((r) => r !== role);
        this.updatedAt = new Date();
    }

    //* Factory method para creación de nuevos usuarios...
    static create({
        username,
        password,
        email,
        verificationToken,
    }: {
        username: string;
        password: string;
        email: string;
        verificationToken: string;
    }): User {
        return new User(
            0, //> ID temporal...
            username,
            password,
            email,
            false, //> isVerified...
            verificationToken,
            new Date(), //> createdAt...
            new Date(), //> updatedAt...
            [EmployeeRole.EMPLOYEE], //> roles por defecto...
        );
    }
}
