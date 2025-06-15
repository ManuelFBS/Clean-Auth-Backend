import { EmployeeController } from '../../../../src/application/controllers/EmployeeController';
import { CreateEmployee } from '../../../../src/core/usecases/CreateEmployee';
import { Employee } from '../../../../src/core/entities/Employee';
import { EmployeeRole } from '../../../../src/core/entities/Role';
import { ApplicationError } from '../../../../src/core/errors';
import { GetAllEmployees } from '../../../../src/core/usecases/GetAllEmployees';
import { GetEmployeeByDNI } from '../../../../src/core/usecases/GetEmployeeByDNI';

describe('EmployeeController', () => {
    let controller: EmployeeController;
    let mockCreateEmployee: jest.Mocked<CreateEmployee>;
    let mockGetAllEmployees: jest.Mocked<any>;
    let mockGetEmployeeById: jest.Mocked<any>;
    let mockGetEmployeeByDNI: jest.Mocked<any>;
    let mockUpdateEmployee: jest.Mocked<any>;
    let mockDeleteEmployee: jest.Mocked<any>;

    beforeEach(() => {
        mockCreateEmployee = {
            execute: jest.fn(),
        } as any;

        mockGetAllEmployees = {
            execute: jest.fn(),
        };

        mockGetEmployeeById = {
            execute: jest.fn(),
        };

        mockUpdateEmployee = {
            execute: jest.fn(),
        };

        mockDeleteEmployee = {
            execute: jest.fn(),
        };

        controller = new EmployeeController(
            mockCreateEmployee,
            mockGetAllEmployees,
            mockGetEmployeeById,
            mockGetEmployeeByDNI,
            mockUpdateEmployee,
            mockDeleteEmployee,
        );
    });

    describe('create', () => {
        it('should create an employee and return 201', async () => {
            const mockEmployee = new Employee(
                1,
                '12345678',
                'Test',
                'Employee',
                'test@example.com',
                '',
                EmployeeRole.EMPLOYEE,
                new Date(),
                new Date(),
            );

            mockCreateEmployee.execute.mockResolvedValue(
                mockEmployee,
            );

            const req = {
                body: {
                    dni: '12345678',
                    name: 'Test',
                    lastName: 'Employee',
                    email: 'test@example.com',
                    role: 'EMPLOYEE',
                },
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    name: 'Test',
                }),
            );
        });
    });

    //? Resto de lo test...
});
