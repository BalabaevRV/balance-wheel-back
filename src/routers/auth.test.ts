import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/DatabasePool'
import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';

describe('Auth Routes Integration Tests', () => {
    describe('POST /api/signup', () => {
      const userData = {
          name: 'John Doe',
          login: 'john_doe',
          email: 'john@example.com',
          password: 'SecurePass123!'
        };
      test('should create new user successfully', async () => {
        const response = await request(app)
          .post('/api/signup')
          .send(userData)
          .expect(201);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toMatchObject({
          name: 'John Doe',
          login: 'john_doe',
        });
        
        // Проверяем, что пользователь реально создан в БД
        const dbResult = await pool.query(
          'SELECT * FROM users WHERE login = $1',
          ['john_doe']
        );
        
        expect(dbResult.rows).toHaveLength(1);
        expect(dbResult.rows[0].name).toBe('John Doe');
        expect(dbResult.rows[0].email).toBe('john@example.com');
        
        // Проверяем, что пароль захеширован
        expect(dbResult.rows[0].password).not.toBe('SecurePass123!');
      });
      test('should return 400 if user already exists', async () => {
      
      const response = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  })

  

})