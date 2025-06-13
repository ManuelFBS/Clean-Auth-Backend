export interface CreateEmployeeDTO {
    dni: string;
    name: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
}

export interface UpdateEmployeeDTO
    extends Partial<CreateEmployeeDTO> {
    id: number;
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
