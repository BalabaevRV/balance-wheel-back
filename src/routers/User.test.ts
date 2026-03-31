import request from 'supertest'
import app from '@/app'
import { beforeAll, describe, expect, test } from '@jest/globals';
import { getAuthToken } from '@/helpers/tests/Auth' 
import { TestUser } from '@/types/tests'

describe('User routes Integration Tests', () => {
    let currentUser: TestUser 
    beforeAll(async () => {
        currentUser = await getAuthToken();
    })

    describe('GET /user', () => {
        test('should get current user info', async () => {            
            const response = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${currentUser.authToken}`)
            .expect(200);
            
            expect(response.body.user).toMatchObject({
            name: currentUser.name,
            user_id: currentUser.userId
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