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
            // Use a unique username to avoid conflicts with previous test runs
            const uniqueUsername = `testuser_${Date.now()}`;
            
            const response = await request(app)
                .post('/register')
                .send({
                    username: uniqueUsername,
                    password: 'ValidPass123',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                'username',
                uniqueUsername,
            );
            expect(response.body).not.toHaveProperty(
                'password',
            );
        });
    });

    //! Más tests para login, etc...
});
