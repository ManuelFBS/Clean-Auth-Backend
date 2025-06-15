import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateEmployee } from '../../core/usecases/CreateEmployee';
import { IEmployeeRepository } from '../../core/interfaces/IEmployeeRepository';
import {
    CreateEmployeeDTO,
    EmployeeResponseDTO,
    UpdateEmployeeDTO,
} from '../dtos/EmployeeDTO';
import { ApplicationError } from '../../core/errors';
import { GetAllEmployees } from '../../core/usecases/GetAllEmployees';
import { GetEmployeeById } from '../../core/usecases/GetEmployeeById';
import { GetEmployeeByDNI } from '../../core/usecases/GetEmployeeByDNI';
import { UpdateEmployee } from '../../core/usecases/UpdateEmployee';
import { DeleteEmployee } from '../../core/usecases/DeleteEmployee';
import { Employee } from '../../core/entities/Employee';
import { error } from 'console';

@injectable()
export class EmployeeController {
    constructor(
        @inject('CreateEmployee')
        private createEmployee: CreateEmployee,
        @inject('CreateEmployee')
        private getAllEmployees: GetAllEmployees,
        @inject('CreateEmployee')
        private getEmployeeById: GetEmployeeById,
        @inject('GetEmployeeByDNI')
        private getEmployeeByDNI: GetEmployeeByDNI,
        @inject('UpdateEmployee')
        private updateEmployee: UpdateEmployee,
        @inject('DeleteEmployee')
        private deleteEmployee: DeleteEmployee,
    ) {}

    async create(req: Request, res: Response) {
        try {
            const dto: CreateEmployeeDTO = req.body;
            const employee =
                await this.createEmployee.execute(dto);

            return res
                .status(201)
                .json(this.toResponseDTO(employee));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const employees =
                await this.getAllEmployees.execute();

            return res.json(
                employees.map(this.toResponseDTO),
            );
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const employee =
                await this.getEmployeeById.execute(id);

            if (!employee) {
                return res
                    .status(404)
                    .json({ error: 'Employee not found' });
            }
            return res
                .status(200)
                .json(this.toResponseDTO(employee));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getByDNI(req: Request, res: Response) {
        try {
            const dni = req.body;
            const employee =
                await this.getEmployeeByDNI.execute(dni);

            if (!employee) {
                return res
                    .status(404)
                    .json({ error: 'Employee not found' });
            }
            return res
                .status(200)
                .json(this.toResponseDTO(employee));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const dto: UpdateEmployeeDTO = {
                ...req.body,
                id: parseInt(req.params.id),
            };
            const employee =
                await this.updateEmployee.execute(dto);
            return res.json(this.toResponseDTO(employee));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const dni = req.body;
            await this.deleteEmployee.execute(dni);
            return res.status(204).send();
        } catch (error) {
            this.handleError(res, error);
        }
    }

    private toResponseDTO(
        employee: Employee,
    ): EmployeeResponseDTO {
        return {
            id: employee.id,
            dni: employee.dni,
            name: employee.name,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            role: employee.role,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
        };
    }

    private handleError(res: Response, error: unknown) {
        if (error instanceof ApplicationError) {
            return res
                .status(error.statusCode)
                .json({ error: error.message });
        }

        console.error(error);

        return res
            .status(500)
            .json({ error: 'Internal server error...!' });
    }
}
