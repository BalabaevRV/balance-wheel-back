import request from 'supertest'
import app from '@/app'
import { beforeAll, describe, expect, test } from '@jest/globals'
import { getAuthToken } from '@/tests/helper/auth'
import { TestUser } from '@/modules/user/user.types'
import { IWheel } from '@/modules/wheel/wheel.types'
import { IRecord } from '../record/record.types'

describe('User routes Integration Tests', () => {
	let currentUser: TestUser
	beforeAll(async () => {
		currentUser = await getAuthToken()
	})
	describe('GET /user', () => {
		test('should get current user info', async () => {
			const response = await request(app)
				.get('/api/user')
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.expect(200)

			expect(response.body.data).toMatchObject({
				name: currentUser.name,
				user_id: currentUser.userId
			})
		})

		test('should return 401 without token', async () => {
			await request(app).get('/api/user').expect(401)
		})

		test('should return 401 with invalid token', async () => {
			await request(app).get('/api/user').set('Authorization', 'Bearer invalid_token').expect(401)
		})
	})
	describe('GET /api/user/:id/wheels', () => {
		test('should get wheels for a specific user', async () => {
			const response = await request(app)
				.get(`/api/user/${currentUser.userId}/wheels`)
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.expect(200)
			response.body.data.length > 0 &&
				response.body.data.forEach((wheel: IWheel) => {
					expect(wheel).toHaveProperty('wheel_id')
					expect(wheel).toHaveProperty('name')
					expect(wheel).toHaveProperty('interval_seconds')
					expect(wheel).toHaveProperty('fields')
					expect(Array.isArray(wheel.fields)).toBe(true)
				})
		})
	})
	describe('GET /api/user/:id/records', () => {
		test('should get records for a specific user', async () => {
			const response = await request(app)
				.get(`/api/user/${currentUser.userId}/records`)
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.expect(200)
			response.body.data.length > 0 &&
				response.body.data.forEach((record: IRecord) => {
					expect(record).toHaveProperty('record_id')
					expect(record).toHaveProperty('wheel_id')
					expect(record).toHaveProperty('user_id')
					expect(record).toHaveProperty('values')
				})
		})
	})
})

export { TestUser }
