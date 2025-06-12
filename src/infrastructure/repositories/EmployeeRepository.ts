import mysql from 'mysql2/promise';
import { Employee } from '../../core/entities/Employee';
import { IEmployeeRepository } from '../../core/interfaces/IEmployeeRepository';
import { EmployeeRole } from '../../core/entities/Role';
import { logger } from '../services/Logger';
import { DatabaseError } from '../../core/errors';

export class EmployeeRepository
    implements IEmployeeRepository
{
    constructor(private connection: mysql.Connection) {}

    async save(employee: Employee): Promise<Employee> {
        try {
            const [result]: any =
                await this.connection.execute(
                    `INSERT INTO employees 
                        (dni, name, lastName, email, phone, role) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        employee.dni,
                        employee.name,
                        employee.lastName,
                        employee.email,
                        employee.phone,
                        employee.role,
                    ],
                );

            //* Obtenemos el empleado recién creado...
            const savedEmployee = await this.findById(
                result.insertId,
            );

            if (!savedEmployee) {
                throw new DatabaseError(
                    'Failed to retrieve created employee',
                );
            }

            return savedEmployee;
        } catch (error) {
            await this.connection.rollback();
            logger.error(`Error saving employee: ${error}`);
            throw new DatabaseError(
                'Failed to save employee...!',
            );
        }
    }

    async findById(id: number): Promise<Employee | null> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT * FROM employees WHERE id = ?`,
                    [id],
                );

            if (rows.length === 0) return null;

            return this.rowToEmployee(rows[0]);
        } catch (error) {
            logger.error(
                `Error finding employee by id ${id}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to find employee',
            );
        }
    }

    async findAll(): Promise<Employee[]> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT * FROM employees`,
                );

            return rows.map((row: any) =>
                this.rowToEmployee(row),
            );
        } catch (error) {
            logger.error(
                `Error finding all employees: ${error}`,
            );
            throw new DatabaseError(
                'Failed to retrieve employees',
            );
        }
    }

    async update(employee: Employee): Promise<Employee> {
        try {
            await this.connection.execute(
                `UPDATE employees SET 
        dni = ?, name = ?, lastName = ?, 
        email = ?, phone = ?, role = ?
        WHERE id = ?`,
                [
                    employee.dni,
                    employee.name,
                    employee.lastName,
                    employee.email,
                    employee.phone,
                    employee.role,
                    employee.id,
                ],
            );

            const updatedEmployee = await this.findById(
                employee.id,
            );

            if (!updatedEmployee) {
                throw new DatabaseError(
                    'Employee not found after update',
                );
            }

            return updatedEmployee;
        } catch (error) {
            logger.error(
                `Error updating employee ${employee.id}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to update employee',
            );
        }
    }

    async delete(dni: string): Promise<void> {
        try {
            await this.connection.execute(
                `DELETE FROM employees WHERE dni = ?`,
                [dni],
            );
        } catch (error) {
            logger.error(
                `Error deleting employee ${dni}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to delete employee',
            );
        }
    }

    async findByDNI(dni: string): Promise<Employee | null> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT * FROM employees WHERE dni = ?`,
                    [dni],
                );

            if (rows.length === 0) return null;

            return this.rowToEmployee(rows[0]);
        } catch (error) {
            logger.error(
                `Error finding employee by dni ${dni}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to find employee by dni',
            );
        }
    }

    async findByEmail(
        email: string,
    ): Promise<Employee | null> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT * FROM employees WHERE email = ?`,
                    [email],
                );

            if (rows.length === 0) return null;

            return this.rowToEmployee(rows[0]);
        } catch (error) {
            logger.error(
                `Error finding employee by email ${email}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to find employee by email',
            );
        }
    }

    async findByRole(
        role: EmployeeRole,
    ): Promise<Employee[]> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT * FROM employees WHERE role = ?`,
                    [role],
                );

            return rows.map((row: any) =>
                this.rowToEmployee(row),
            );
        } catch (error) {
            logger.error(
                `Error finding employees by role ${role}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to find employees by role',
            );
        }
    }

    async existsByDNI(dni: string): Promise<boolean> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT 1 FROM employees WHERE dni = ?`,
                    [dni],
                );

            return rows.length > 0;
        } catch (error) {
            logger.error(
                `Error checking existence by dni ${dni}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to check employee existence by dni',
            );
        }
    }

    async existsByEmail(email: string): Promise<boolean> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    `SELECT 1 FROM employees WHERE email = ?`,
                    [email],
                );

            return rows.length > 0;
        } catch (error) {
            logger.error(
                `Error checking existence by email ${email}: ${error}`,
            );
            throw new DatabaseError(
                'Failed to check employee existence by email',
            );
        }
    }

    private rowToEmployee(row: any): Employee {
        return new Employee(
            row.id,
            row.dni,
            row.name,
            row.lastName,
            row.email,
            row.phone,
            row.role as EmployeeRole,
            new Date(row.createdAt),
            new Date(row.updatedAt),
        );
    }
}
