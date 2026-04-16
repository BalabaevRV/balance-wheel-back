import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/database'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';


describe('Auth routes Integration Tests', () => {
    const userData = {
          name: 'John Doe',
          login: 'john_doe',
          email: 'john@example.com',
          password: 'SecurePass123!'
    };
    let createdUserId: number
    beforeAll(async () => {

    })
    describe('POST /api/signup', () => {
      test('should create new user successfully', async () => {
        const response = await request(app)
          .post('/api/signup')
          .send(userData)
          .expect(201);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.user).toHaveProperty('user_id');
        expect(response.body.data.user).toHaveProperty('records');
        expect(response.body.data.user).toHaveProperty('wheels');
        expect(response.body.data.user).toMatchObject({
          name: userData.name,
          login: userData.login
        });
        
        createdUserId = response.body.data.user.user_id;

        // Проверяем, что пользователь реально создан в БД
        const dbResult = await pool.query(
          'SELECT * FROM users WHERE login = $1',
          [userData.login]
        );
        
        expect(dbResult.rows).toHaveLength(1);
        expect(dbResult.rows[0].name).toBe(userData.name);
        expect(dbResult.rows[0].email).toBe(userData.email);
        
        // Проверяем, что пароль захеширован
        expect(dbResult.rows[0].password).not.toBe(userData.password);
      });
      test('should return 400 if user already exists', async () => {
      
      const response = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  })

   describe('POST /api/login', () => {
    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          login: userData.login,
          password: userData.password
        })
        .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.user).toHaveProperty('user_id');
        expect(response.body.data.user).toHaveProperty('records');
        expect(response.body.data.user).toHaveProperty('wheels');
        expect(response.body.data.user).toMatchObject({
          name: userData.name,
          login: userData.login
        });
    });
    
    test('should return 401 with wrong password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          login: userData.login,
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.error).toBeDefined();
    });
  }); 
      afterAll(async () => {
          await pool.query('DELETE FROM users WHERE login = $1', [userData.login]);
          console.log(`✅ Test user deleted`);        
          console.log('✅ Test data cleaned up');   
    });

})