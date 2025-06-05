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
        const [rows] = (await this.connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username],
        )) as [any[], any];

        if (rows.length === 0) {
            return null;
        }

        const userData = rows[0];

        return new User(
            userData.id,
            userData.username,
            userData.password,
            userData.created_at,
            userData.updated_at,
        );
    }

    async save(user: User): Promise<User> {
        const hashedPassword = await bcrypt.hash(
            user.password,
            10,
        );

        const [result]: any = await this.connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [user.username, hashedPassword],
        );

        return new User(
            result.insertId,
            user.username,
            hashedPassword,
            new Date(),
            new Date(),
        );
    }
}
