import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/DatabasePool'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { hash } from 'bcryptjs';
import { config } from '@/config/env';

describe('User routes Integration Tests', () => {
    let authToken: string
    let userId: number
    const userData = {
        name: 'Billy Jean',
        login: 'billy_jean',
        email: 'billy@example.com',
        password: 'SecurePass12345!'
    };
    beforeAll(async () => {
        const existingUser = await pool.query('SELECT user_id FROM users WHERE login = $1 LIMIT 1', [userData.login]);
        if (existingUser.rowCount === 0) {
            const passwordHash = await hash(userData.password, config.salt)
            const createUserResult = await pool.query('INSERT INTO users (name, login, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, name, login, email', [userData.name, userData.login, userData.email, passwordHash])
            userId = createUserResult.rows[0].user_id
        } else {
            userId = existingUser.rows[0].user_id
        }
        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                login: userData.login,
                password: userData.password
            });
        
        authToken = loginResponse.body.token;

    })

    describe('GET /user', () => {
        test('should get current user info', async () => {            
            const response = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
            
            expect(response.body.user).toMatchObject({
            name: userData.name,
            user_id: userId
            });
        })
        
        test('should return 401 without token', async () => {
            await request(app)
                .get('/user')
                .expect(401);
        });
    
        test('should return 401 with invalid token', async () => {
            await request(app)
                .get('/user')
                .set('Authorization', 'Bearer invalid_token')
                .expect(401);
        });
    })
    describe('GET /user/:id', () => {})
})