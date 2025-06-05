import bcrypt from 'bcrypt';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';

export class RegisterUser {
    constructor(private userRepository: IUserRepository) {}

    async execute(
        username: string,
        password: string,
    ): Promise<User> {
        const existingUser =
            await this.userRepository.findByUsername(
                username,
            );

        if (existingUser) {
            throw new Error('Username already exists...!');
        }

        //* Crear el nuevo usuario...
        const hashedPassword = await bcrypt.hash(
            password,
            10,
        );
        const newUser = new User(
            0,
            username,
            hashedPassword,
            new Date(),
            new Date(),
        );

        //* Guardar en la base de datos...
        return await this.userRepository.save(newUser);
    }
}
