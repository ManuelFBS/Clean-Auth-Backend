import { EmployeeRole } from '../../core/entities/Role';

export interface CreateEmployeeDTO {
    dni: string;
    name: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
}

export interface UpdateEmployeeDTO
    extends Partial<Omit<CreateEmployeeDTO, 'role'>> {
    id: number;
    role?: EmployeeRole;
}

export interface EmployeeResponseDTO {
    id: number;
    dni: string;
    name: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
