import request from 'supertest';
import { createServer } from '../../src/infrastructure/web/server';
import { initializeDatabase } from '../../src/infrastructure/db/database';
import { Application } from 'express';
import {
    container,
    setupContainer,
} from '../../src/infrastructure/container';
import { Employee } from '../../src/core/entities/Employee';
import { App } from 'supertest/types';

describe('Employee API', () => {
    let app: Application;
    let connection: any;
    let authToken: string;

    beforeAll(async () => {
        connection = await initializeDatabase();
        await setupContainer();
        app = await createServer();

        //* Login para obtener token...
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: 'adminpass',
            });
        authToken = loginResponse.body.token;
    });

    afterAll(async () => {
        await connection.end();
    });

    describe('POST /api/employees', () => {
        it('should create a new employee', async () => {
            const response = await request(app)
                .post('/api/employees')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    dni: '12345678',
                    name: 'Test',
                    lastName: 'Employee',
                    email: 'test@example.com',
                    role: 'EMPLOYEE',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    //? Más tests para otras rutas...
});
