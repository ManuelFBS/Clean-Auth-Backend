import { injectable, inject } from 'inversify';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { NotFoundError } from '../errors';

@injectable()
export class DeleteEmployee {
    constructor(
        @inject('IEmployeeRepository')
        private repository: IEmployeeRepository,
    ) {}

    async execute(dni: string): Promise<void> {
        const exists = await this.repository.findByDNI(dni);
        if (!exists) {
            throw new NotFoundError('Employee not found');
        }
        return this.repository.delete(dni);
    }
}
