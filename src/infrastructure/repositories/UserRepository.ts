import mysql from 'mysql2/promise';
import { User } from '../../core/entities/User';
import { IUserRepository } from '../../core/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { logger } from '../services/Logger';
import { DatabaseError } from '../../core/errors';

export class UserRepository implements IUserRepository {
    private connection: mysql.Connection;

    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }

    async findByUsername(
        username: string,
    ): Promise<User | null> {
        try {
            logger.debug(`Buscando usuario: ${username}`);

            const [rows]: any =
                await this.connection.execute(
                    'SELECT * FROM users WHERE username = ?',
                    [username],
                );

            if (rows.length === 0) {
                logger.debug(
                    `Usuario no encontrado: ${username}`,
                );
                return null;
            }

            logger.debug(`Usuario encontrado: ${username}`);

            const userData = rows[0];

            return new User(
                userData.id,
                userData.username,
                userData.password,
                userData.email,
                userData.isVerify,
                userData.verificationToken,
                new Date(userData.created_at),
                new Date(userData.updated_at),
                userData.roles,
            );
        } catch (error) {
            logger.error(
                `Error al buscar usuario: ${username}`,
            );
            throw new DatabaseError(
                'Error al buscar usuario...!',
            );
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            logger.debug(`Buscando email: ${email}`);

            const [rows]: any =
                await this.connection.execute(
                    'SELECT * FROM users WHERE email = ?',
                    [email],
                );

            if (rows.length === 0) {
                logger.debug(
                    `Email no encontrado: ${email}`,
                );

                return null;
            }

            logger.debug(`Email encontrado: ${email}`);

            const userData = rows[0];

            return new User(
                userData.id,
                userData.username,
                userData.password,
                userData.email,
                userData.isVerify,
                userData.verificationToken,
                new Date(userData.created_at),
                new Date(userData.updated_at),
                userData.roles,
            );
        } catch (error) {
            logger.error(
                `Error al buscar el email: ${email}`,
            );
            throw new DatabaseError(
                'Error al buscar el email...!',
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
                userData.email,
                userData.isVerify,
                userData.verificationToken,
                new Date(userData.created_at),
                new Date(userData.updated_at),
                userData.roles,
            );
        } catch (error) {
            console.error('Error in save:', error);
            throw new Error(
                'Database error when saving user',
            );
        }
    }
}
