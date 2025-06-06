import request from 'supertest';
import { createServer } from '../../src/infrastructure/web/server';
import { initializeDatabase } from '../../src/infrastructure/db/database';
import { UserRepository } from '../../src/infrastructure/repositories/UserRepository';
import { Application } from 'express';

describe('Auth API', () => {
    let app: Application;
    let connection: any;

    beforeAll(async () => {
        connection = await initializeDatabase();
        app = await createServer();
    });

    afterAll(async () => {
        await connection.end();
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'ValidPass123',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                'username',
                'testuser',
            );
            expect(response.body).not.toHaveProperty(
                'password',
            );
        });
    });

    //! Más tests para login, etc...
});
