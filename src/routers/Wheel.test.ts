import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/DatabasePool'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { TestUser } from '@/types/tests'
import { getAuthToken } from '@/helpers/tests/Auth' 
import { Field, Wheel } from '@/types'


 describe('User routes Integration Tests', () => {
    let currentUser: TestUser 
    const wheelItemFirst: Wheel = {
        name: 'wheelTest1',
        intervalSeconds: 86400    
    }
    const wheelItemSecond: Wheel = {
        name: 'wheelTest2',
        intervalSeconds: 604800    
    }
    const FieldsArrayFirst: Field[] = [
        { name: 'Red', color_hex: '#FF0000' },
        { name: 'Green', color_hex: '#00FF00' },
        { name: 'Blue', color_hex: '#0000FF' },
        { name: 'Yellow', color_hex: '#FFFF00' },
        { name: 'Purple', color_hex: '#800080' },
        { name: 'Orange', color_hex: '#FFA500' }
    ]

    const FieldsArraySecond: Field[] = [
        { name: 'Red', color_hex: '#FF0000' },
        { name: 'Green', color_hex: '#00FF00' },
        { name: 'Blue', color_hex: '#0000FF' },
        { name: 'Yellow', color_hex: '#FFFF00' },
        { name: 'Purple', color_hex: '#800080' },
        { name: 'Orange', color_hex: '#FFA500' },
        { name: 'Pink', color_hex: '#FFC0CB' },
        { name: 'Cyan', color_hex: '#00FFFF' }
    ]

    beforeAll(async () => {
        currentUser = await getAuthToken();
    })
    describe('POST /wheel', () => {
        test('should create wheel', async () => {
            const response = await request(app)
                .post('/wheel')
                .set('Authorization', `Bearer ${currentUser.authToken}`)
                .send({wheel: wheelItemFirst, fields: FieldsArrayFirst})
                .expect(201);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toMatchObject({
                wheel: wheelItemFirst,
                fields: FieldsArrayFirst
            })
            wheelItemFirst.wheel_id = response.body.data.wheel.wheel_id
            const dbResultWheel = await pool.query(
                'SELECT * FROM wheels WHERE name = $1',
                [wheelItemFirst.name]
            );
            
            expect(dbResultWheel.rows).toHaveLength(1);

            const dbResultFields = await pool.query(
                'SELECT * FROM wheels LEFT JOIN wheels_fields ON wheels.wheel_id = wheels_fields.wheel_id WHERE wheels.name = $1',
                [wheelItemFirst.name]
            )

            expect(dbResultFields.rows).toHaveLength(FieldsArrayFirst.length);

            const dbResultUser = await pool.query(
                'SELECT * FROM users LEFT JOIN users_wheels ON users.user_id = users_wheels.wheel_id WHERE users.user_id = $1',
                [currentUser.userId]
            )

            expect(dbResultUser.rows).toHaveLength(1);
        })
    })
    // describe('POST /wheel/:id', () => {
    //     test('should get wheel list', async () => {})
    // })
    // describe('GET /wheel', () => {
    //     test('should get wheel list', async () => {
    //         const response = await request(app)
    //         .get('/wheel')
    //         .set('Authorization', `Bearer ${currentUser.authToken}`)
    //         .expect(200);
    //     })
    // })
    // describe('GET /wheel/:id', () => {
    //     test('should get wheel list', async () => {})
    // })
    // describe('DELETE /wheel', () => {
    //     test('should get wheel list', async () => {})
    // })
    afterAll(async () => {
        const fieldsIdArray = []
        for (const field of FieldsArrayFirst) {
            fieldsIdArray.push(field.field_id)
        }
        const wheelsId = [wheelItemFirst.wheel_id, wheelItemSecond.wheel_id];

        await pool.query('DELETE FROM wheels_fields WHERE wheel_id = ANY($1::int[])', [wheelsId]);
        console.log(`✅ Test fields deleted`);   

        await pool.query('DELETE FROM fields WHERE field_id = ANY($1::int[])', [fieldsIdArray]);
        console.log(`✅ Test fields deleted`);   

        await pool.query('DELETE FROM wheels WHERE wheel_id = ANY($1::int[])', [wheelsId]);
        console.log(`✅ Test wheels deleted`);        
        console.log('✅ Test data cleaned up');   
    })
})

