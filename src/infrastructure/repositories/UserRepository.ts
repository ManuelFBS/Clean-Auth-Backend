import mysql from 'mysql2/promise';
import { User } from '../../core/entities/User';
import { IUserRepository } from '../../core/interfaces/IUserRepository';
import bcrypt from 'bcrypt';

export class UserRepository implements IUserRepository {
    private connection: mysql.Connection;

    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }

    async findByUsername(
        username: string,
    ): Promise<User | null> {
        try {
            const [rows]: any =
                await this.connection.execute(
                    'SELECT * FROM users WHERE username = ?',
                    [username],
                );

            if (rows.length === 0) {
                return null;
            }

            const userData = rows[0];
            return new User(
                userData.id,
                userData.username,
                userData.password,
                new Date(userData.created_at),
                new Date(userData.updated_at),
            );
        } catch (error) {
            console.error(
                'Error in findByUsername:',
                error,
            );
            throw new Error(
                'Database error when finding user',
            );
        }
    }

    async save(user: User): Promise<User> {
        try {
            const [result]: any =
                await this.connection.execute(
                    'INSERT INTO users (username, password) VALUES (?, ?)',
                    [user.username, user.password],
                );

            // Obtener el usuario recién creado para devolverlo con todos los datos
            const [rows]: any =
                await this.connection.execute(
                    'SELECT * FROM users WHERE id = ?',
                    [result.insertId],
                );

            const userData = rows[0];
            return new User(
                userData.id,
                userData.username,
                userData.password,
                new Date(userData.created_at),
                new Date(userData.updated_at),
            );
        } catch (error) {
            console.error('Error in save:', error);
            throw new Error(
                'Database error when saving user',
            );
        }
    }
}
