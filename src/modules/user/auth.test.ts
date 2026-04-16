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
    let testWheelId: number;
    let testRecordId: number;

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

      // ✅ Создаём тестовое колесо
      const wheelResult = await pool.query(`
          INSERT INTO wheels (owner_id, name, interval_seconds)
          VALUES ($1, $2, $3)
          RETURNING wheel_id
      `, [createdUserId, 'Test Wheel', 86400]);
      testWheelId = wheelResult.rows[0].wheel_id;
      
      await pool.query(`
          INSERT INTO users_wheels (user_id, wheel_id)
          VALUES ($1, $2)
      `, [createdUserId, testWheelId]);

      // ✅ Создаём тестовую запись
      const recordResult = await pool.query(`
          INSERT INTO records (user_id, wheel_id, date)
          VALUES ($1, $2, NOW())
          RETURNING record_id
      `, [createdUserId, testWheelId]);
      testRecordId = recordResult.rows[0].record_id;


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
        // ✅ Проверяем, что wheels загрузились
        expect(response.body.data.user).toHaveProperty('wheels');
        expect(Array.isArray(response.body.data.user.wheels)).toBe(true);
        expect(response.body.data.user.wheels.length).toBeGreaterThan(0);
        
        // ✅ Проверяем содержимое колеса
        const wheel = response.body.data.user.wheels[0];
        expect(wheel).toHaveProperty('wheel_id', testWheelId);
        expect(wheel).toHaveProperty('name', 'Test Wheel');
        expect(wheel).toHaveProperty('fields');
        expect(Array.isArray(wheel.fields)).toBe(true);
        
        // ✅ Проверяем, что records загрузились
        expect(response.body.data.user).toHaveProperty('records');
        expect(Array.isArray(response.body.data.user.records)).toBe(true);
        expect(response.body.data.user.records.length).toBeGreaterThan(0);
        
        // ✅ Проверяем содержимое записи
        const record = response.body.data.user.records[0];
        expect(record).toHaveProperty('record_id', testRecordId);
        expect(record).toHaveProperty('wheel_id', testWheelId);
        expect(record).toHaveProperty('values');
        expect(Array.isArray(record.values)).toBe(true);

        
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
        await pool.query('DELETE FROM records WHERE record_id = $1', [testRecordId]);
        await pool.query('DELETE FROM users_wheels WHERE user_id = $1 AND wheel_id = $2', [createdUserId, testWheelId]);
        await pool.query('DELETE FROM wheels WHERE wheel_id = $1', [testWheelId]);
        await pool.query('DELETE FROM users WHERE login = $1', [userData.login]);
        console.log('✅ Test data cleaned up');
        await pool.end();
    });

})