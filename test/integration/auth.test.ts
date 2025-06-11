import request from 'supertest';
import { createServer } from '../../src/infrastructure/web/server';
import { initializeDatabase } from '../../src/infrastructure/db/database';
import { Application } from 'express';
import { User } from '../../src/core/entities/User';
import {
    container,
    setupContainer,
} from '../../src/infrastructure/container';
import { UserRepository } from '../../src/infrastructure/repositories/UserRepository';
import { injectable } from 'inversify';

// Mock EmailService for tests
@injectable()
class MockEmailService {
    async sendVerificationEmail(email: string, token: string): Promise<void> {
        // Mock implementation - do nothing
        console.log(`Mock: Would send verification email to ${email} with token ${token}`);
        return Promise.resolve();
    }
}

describe('Auth API', () => {
    let app: Application;
    let connection: any;
    let userRepository: UserRepository;
    let testUser: User;

    beforeAll(async () => {
        // Clear container to avoid duplicate bindings
        container.unbindAll();
        
        connection = await initializeDatabase();
        await setupContainer();
        
        // Override EmailService with mock for tests
        if (container.isBound('EmailService')) {
            container.unbind('EmailService');
        }
        container.bind('EmailService').to(MockEmailService).inSingletonScope();
        
        app = await createServer();
        userRepository = container.get<UserRepository>(
            'IUserRepository',
        );

        // Clean up any existing test users
        try {
            await connection.execute('DELETE FROM users WHERE username = ?', ['testuser']);
        } catch (error) {
            // User might not exist, that's okay
        }

        //* Crear un usuario de prueba
        testUser = await userRepository.save(
            new User(
                0,
                'testuser',
                '$2b$10$57GvNyRCIDfTwkgxFgm0UuxKNOPL0Uhs9MrYnFbN6xuZ5rPEmEzc.', //> bcrypt hash de "testpass"
                'test@example.com',
                true,
                null,
                new Date(),
                new Date(),
                [],
            ),
        );
    });

    afterAll(async () => {
        // Close the test database connection
        if (connection) {
            await connection.end();
        }
        
        // Clear the container to release all bindings
        container.unbindAll();
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const uniqueUsername = `testuser_${Date.now()}`;
            const response = await request(app)
                .post('/register')
                .send({
                    username: uniqueUsername,
                    password: 'ValidPass123',
                    email: `${uniqueUsername}@example.com`,
                });

            console.log('Register response:', response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                'username',
                uniqueUsername,
            );
            expect(response.body).not.toHaveProperty(
                'password',
            );
        });

        it('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    username: 'invaliduser',
                    password: 'ValidPass123',
                    email: 'invalid-email',
                });

            console.log('Invalid email response:', response.body);
            expect(response.status).toBe(400);
            expect(response.body.error).toContain(
                'Invalid email format',
            );
        });
    });

    describe('POST /login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'testpass',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.username).toBe(
                'testuser',
            );
        });

        it('should fail with invalid password', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword',
                });

            console.log('Invalid password response:', response.body);
            expect(response.status).toBe(401);
            expect(response.body.error).toContain(
                'Invalid password',
            );
        });

        it('should fail with non-existent user', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'nonexistent',
                    password: 'somepass',
                });

            console.log('Non-existent user response:', response.body);
            expect(response.status).toBe(401);
            expect(response.body.error).toContain(
                'User not found',
            );
        });
    });

    describe('GET /profile', () => {
        let authToken: string;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'testpass',
                });
            authToken = loginResponse.body.token;
        });

        it('should return user profile with valid token', async () => {
            const response = await request(app)
                .get('/profile')
                .set(
                    'Authorization',
                    `Bearer ${authToken}`,
                );

            expect(response.status).toBe(200);
            expect(response.body.userId).toBe(testUser.id);
        });

        it('should fail without token', async () => {
            const response =
                await request(app).get('/profile');

            expect(response.status).toBe(401);
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/profile')
                .set(
                    'Authorization',
                    'Bearer invalidtoken',
                );

            expect(response.status).toBe(401);
        });
    });
});
