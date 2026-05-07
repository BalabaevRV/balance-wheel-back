import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/database'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { TestUser } from '@/modules/user/user.types'
import { getAuthToken } from '@/tests/helper/auth' 
import { IWheelSave } from './wheel.types'
import { IField } from './field.types'


 describe('User routes Integration Tests', () => {
    let currentUser: TestUser 
    const FieldsArrayFirst: IField[] = [
        { name: 'Red', color_hex: '#FF0000' },
        { name: 'Green', color_hex: '#00FF00' },
        { name: 'Blue', color_hex: '#0000FF' },
        { name: 'Yellow', color_hex: '#FFFF00' },
        { name: 'Purple', color_hex: '#800080' },
        { name: 'Orange', color_hex: '#FFA500' }
    ]
    const wheelItemFirst: IWheelSave = {
        name: 'wheelTest1',
        interval_seconds: 86400,
        fields: FieldsArrayFirst 
    }

    const expectedFields = FieldsArrayFirst.map(field => 
        expect.objectContaining({
            name: field.name,
            color_hex: field.color_hex
        })
    );

    beforeAll(async () => {
        currentUser = await getAuthToken();
    })
    describe('POST /api/wheels', () => {
        test('should create wheel', async () => {
            const response = await request(app)
                .post('/api/wheels')
                .set('Authorization', `Bearer ${currentUser.authToken}`)
                .send({...wheelItemFirst, fields: FieldsArrayFirst})
                .expect(201);
            
    
            console.log(124356)
            console.log(response.body.data)
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toMatchObject({
                ...wheelItemFirst,
                fields:  expectedFields
            })

            wheelItemFirst.wheel_id = response.body.data.wheel_id
            const dbResultWheel = await pool.query(
                'SELECT * FROM wheels WHERE wheel_id = $1',
                [wheelItemFirst.wheel_id]
            );
            
            expect(dbResultWheel.rows).toHaveLength(1);

            const dbResultFields = await pool.query(
                'SELECT * FROM wheels LEFT JOIN wheels_fields ON wheels.wheel_id = wheels_fields.wheel_id WHERE wheels.wheel_id = $1',
                [wheelItemFirst.wheel_id]
            )

            expect(dbResultFields.rows).toHaveLength(FieldsArrayFirst.length);

            const dbResultUser = await pool.query(
                'SELECT * FROM users LEFT JOIN users_wheels ON users.user_id = users_wheels.wheel_id WHERE users.user_id = $1',
                [currentUser.userId]
            )

            expect(dbResultUser.rows).toHaveLength(1);
        })
    })
    describe('POST /api/wheels', () => {
        test('should edit wheel by id', async () => {
            wheelItemFirst.name = 'wheelTest1Edit'
            FieldsArrayFirst[0] = { name: 'Cyan', color_hex: '#00FFFF' }
            const response = await request(app)
                .post(`/api/wheels`)
                .set('Authorization', `Bearer ${currentUser.authToken}`)
                .send({...wheelItemFirst, fields: FieldsArrayFirst})
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
        
            expectedFields.splice(0, 1)
            expectedFields.push(expect.objectContaining({
                name: FieldsArrayFirst[0].name,
                color_hex: FieldsArrayFirst[0].color_hex
            }))
            expect(response.body.data).toMatchObject({
                name: wheelItemFirst.name,
                interval_seconds: wheelItemFirst.interval_seconds,
                fields:  expectedFields
            })
        })
    })
    // describe('GET /wheel', () => {
    //     test('should get wheel list', async () => {
    //         const response = await request(app)
    //         .get('/wheel')
    //         .set('Authorization', `Bearer ${currentUser.authToken}`)
    //         .expect(200);
    //     })
    // })
    describe('GET /api/wheels/:id', () => {
         test('should get wheel by id', async () => {
            const response = await request(app)
                    .get(`/api/wheels/${wheelItemFirst.wheel_id}`)
                    .set('Authorization', `Bearer ${currentUser.authToken}`)
                    .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toMatchObject({
                name: wheelItemFirst.name,
                interval_seconds: wheelItemFirst.interval_seconds,
                fields:  expectedFields
            }) 
         })
    })
    afterAll(async () => {
        const fieldsIdArray = []
        for (const field of FieldsArrayFirst) {
            fieldsIdArray.push(field.field_id)
        }
        const wheelsId = [wheelItemFirst.wheel_id];

        await pool.query('DELETE FROM wheels_fields WHERE wheel_id = ANY($1::int[])', [wheelsId]);
        console.log(`✅ Test fields deleted`);   

        await pool.query('DELETE FROM fields WHERE field_id = ANY($1::int[])', [fieldsIdArray]);
        console.log(`✅ Test fields deleted`);   

        await pool.query('DELETE FROM wheels WHERE wheel_id = ANY($1::int[])', [wheelsId]);
        console.log(`✅ Test wheels deleted`);        
        console.log('✅ Test data cleaned up');   
    })
})

