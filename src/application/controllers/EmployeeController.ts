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

    async create(req: Request, res: Response) {}
    async getAll(req: Request, res: Response) {}
    async getById(req: Request, res: Response) {}
    async getByDNI(req: Request, res: Response) {}
    async update(req: Request, res: Response) {}
    async delete(req: Request, res: Response) {}
}
