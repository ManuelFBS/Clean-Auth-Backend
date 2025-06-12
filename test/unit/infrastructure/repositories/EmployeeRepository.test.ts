import { EmployeeRepository } from '../../../../src/infrastructure/repositories/EmployeeRepository';
import { initializeDatabase } from '../../../../src/infrastructure/db/database';
import { Employee } from '../../../../src/core/entities/Employee';
import { EmployeeRole } from '../../../../src/core/entities/Role';

describe('EmployeeRepository', () => {
    let repository: EmployeeRepository;
    let connection: any;
    let testEmployee: Employee;

    beforeAll(async () => {
        connection = await initializeDatabase();
        repository = new EmployeeRepository(connection);

        //* Crear un empleado de prueba...
        testEmployee = await repository.save(
            new Employee(
                0,
                '87654321',
                'Test',
                'Employee',
                'test@example.com',
                '123456789',
                EmployeeRole.EMPLOYEE,
                new Date(),
                new Date(),
            ),
        );
    });

    afterAll(async () => {
        await connection.end();
    });

    describe('save()', () => {
        it('should create a new employee', async () => {
            const newEmployee = new Employee(
                0,
                '12345678',
                'John',
                'Doe',
                'john@example.com',
                '987654321',
                EmployeeRole.ADMIN,
                new Date(),
                new Date(),
            );

            const savedEmployee =
                await repository.save(newEmployee);
            expect(savedEmployee.id).toBeGreaterThan(0);
            expect(savedEmployee.dni).toBe('12345678');
        });
    });

    describe('findById()', () => {
        it('should find an existing employee', async () => {
            const found = await repository.findById(
                testEmployee.id,
            );
            expect(found?.id).toBe(testEmployee.id);
            expect(found?.name).toBe('Test');
        });

        it('should return null for non-existent employee', async () => {
            const found = await repository.findById(99999);
            expect(found).toBeNull();
        });
    });

    describe('findByDNI()', () => {
        it('should find employee by DNI', async () => {
            const found = await repository.findByDNI(
                testEmployee.dni,
            );
            expect(found?.id).toBe(testEmployee.id);
        });
    });

    describe('update()', () => {
        it('should update employee details', async () => {
            testEmployee.name = 'Updated Name';
            const updated =
                await repository.update(testEmployee);
            expect(updated.name).toBe('Updated Name');
        });
    });

    describe('delete()', () => {
        it('should delete an employee', async () => {
            const newEmployee = await repository.save(
                new Employee(
                    0,
                    '99999999',
                    'ToDelete',
                    'Employee',
                    'delete@example.com',
                    '111111111',
                    EmployeeRole.EMPLOYEE,
                    new Date(),
                    new Date(),
                ),
            );

            await expect(
                repository.delete(newEmployee.dni),
            ).resolves.not.toThrow();
            await expect(
                repository.findById(newEmployee.id),
            ).resolves.toBeNull();
        });
    });
});
