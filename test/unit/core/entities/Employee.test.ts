import { Employee } from '../../../../src/core/entities/Employee';
import { EmployeeRole } from '../../../../src/core/entities/Role';

describe('Employee Entity', () => {
    let employee: Employee;

    beforeEach(() => {
        employee = new Employee(
            1,
            '12345678',
            'John',
            'Doe',
            'john@example.com',
            '123456789',
            EmployeeRole.ADMIN,
            new Date(),
            new Date(),
        );
    });

    describe('toJSON()', () => {
        it('should return employee data without sensitive info', () => {
            const json = employee.toJSON();

            expect(json).toEqual({
                id: 1,
                dni: '12345678',
                name: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '123456789',
                role: EmployeeRole.ADMIN,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });
    });

    describe('isAdmid()', () => {
        it('should return true for admin role', () => {
            expect(employee.isAdmin()).toBe(true);
        });

        it('should return false for non-admin role', () => {
            employee.role = EmployeeRole.EMPLOYEE;
            expect(employee.isAdmin()).toBe(false);
        });
    });

    describe('updateDetails()', () => {
        it('should update specified fields', () => {
            const originalUpdatedAt = employee.updatedAt;

            employee.updateDetails({
                name: 'Jane',
                phone: '987654321',
                role: EmployeeRole.EMPLOYEE,
            });

            expect(employee.name).toBe('Jane');
            expect(employee.phone).toBe('987654321');
            expect(employee.role).toBe(
                EmployeeRole.EMPLOYEE,
            );
            expect(employee.updatedAt).not.toBe(
                originalUpdatedAt,
            );
        });

        it('should not update unspecified fields', () => {
            const originalEmail = employee.email;

            employee.updateDetails({
                name: 'Jane',
            });

            expect(employee.name).toBe('Jane');
            expect(employee.email).toBe(originalEmail);
        });
    });
});
