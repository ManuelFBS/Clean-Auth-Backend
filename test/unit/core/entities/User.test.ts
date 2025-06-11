import { User } from '../../../../src/core/entities/User';
import { EmployeeRole } from '../../../../src/core/entities/Role';

describe('User Entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User(
            1,
            'testuser',
            'hashedpassword',
            'test@example.com',
            true,
            null,
            new Date(),
            new Date(),
            [EmployeeRole.EMPLOYEE],
        );
    });

    describe('toJSON()', () => {
        it('create() factory method', () => {
            const json = user.toJSON();

            expect(json).not.toHaveProperty('password');
            expect(json).toEqual({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                isVerified: true,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                roles: [EmployeeRole.EMPLOYEE],
            });
        });
    });

    describe('hasRole()', () => {
        it('should return true for existing role', () => {
            expect(
                user.hasRole(EmployeeRole.EMPLOYEE),
            ).toBe(true);
        });

        it('should return false for non-existing role', () => {
            expect(user.hasRole(EmployeeRole.ADMIN)).toBe(
                false,
            );
        });

        it('should return false for non-existing role', () => {
            expect(
                user.hasRole(EmployeeRole.MODERATOR),
            ).toBe(false);
        });
    });

    describe('addRole()', () => {
        it('should add a new role', () => {
            user.addRole(EmployeeRole.ADMIN);
            expect(user.roles).toEqual([
                EmployeeRole.EMPLOYEE,
                EmployeeRole.MODERATOR,
                EmployeeRole.ADMIN,
            ]);
        });

        it('should not add duplicate roles', () => {
            user.addRole(EmployeeRole.EMPLOYEE);
            expect(user.roles).toEqual([
                EmployeeRole.EMPLOYEE,
            ]);
        });
    });

    describe('removeRole()', () => {
        it('should remove existing role', () => {
            user.addRole(EmployeeRole.EMPLOYEE);
            expect(user.roles).toEqual([]);
        });

        it('should do nothing when removing non-existing role', () => {
            user.removeRole(EmployeeRole.ADMIN);
            expect(user.roles).toEqual([
                EmployeeRole.EMPLOYEE,
            ]);
        });
    });

    describe('create() factory method', () => {
        it('should create new user with default values', () => {
            const newUser = User.create({
                username: 'newuser',
                password: 'password',
                email: 'new@example.com',
                verificationToken: 'token123',
            });

            expect(newUser).toEqual({
                id: 0,
                username: 'newuser',
                password: 'password',
                email: 'new@example.com',
                isVerified: false,
                verificationToken: 'token123',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                roles: [EmployeeRole.EMPLOYEE],
            });
        });
    });
});
