import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/DatabasePool'
import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';

describe('Auth Routes Integration Tests', () => {
    describe('POST /api/signup', () => {
    test('should create new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        login: 'john_doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };
      
      const response = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        name: 'John Doe',
        login: 'john_doe',
        email: 'john@example.com'
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
})})