import request from 'supertest'
import app from '@/app'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { getAuthToken } from '@/tests/helper/auth'
import { TestUser } from '@/modules/user/user.types'
import { IWheel } from '@/modules/wheel/wheel.types'
import { IRecord } from '../record/record.types'
import path from 'path/win32'
import fs from 'fs'
import { config } from '@/config/env'

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
				user_id: currentUser.userId,
				avatar_url: null
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
					expect(record).toHaveProperty('note')
					expect(record).toHaveProperty('values')
				})
		})
	})
	describe('POST /api/user/avatar', () => {
		let testImagePath: string

		beforeAll(() => {
			// Создаём тестовое изображение 1x1 пиксель (base64)
			const base64Image =
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
			const buffer = Buffer.from(base64Image, 'base64')

			testImagePath = path.join(__dirname, 'test-avatar.png')
			fs.writeFileSync(testImagePath, buffer)
		})

		afterAll(() => {
			if (fs.existsSync(testImagePath)) {
				fs.unlinkSync(testImagePath)
			}
		})
		test('should update user avatar', async () => {
			const response = await request(app)
				.post(`/api/user/avatar`)
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.attach('avatar', testImagePath)
				.expect(200)
			expect(response.body.data).toMatchObject({
				name: currentUser.name,
				user_id: currentUser.userId,
				avatar_url: expect.any(String)
			})
		})
		test('should return 400 if no file uploaded', async () => {
			const response = await request(app)
				.post('/api/user/avatar')
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.expect(400)

			expect(response.body).toHaveProperty('success', false)
		})
		test('should return 400 if file size exceeds limit', async () => {
			const largeImagePath = path.join(__dirname, 'large-image.jpg')
			const largeBuffer = Buffer.alloc((config.maxAvatarSize + 1) * 1024 * 1024, 'A')
			fs.writeFileSync(largeImagePath, largeBuffer)

			try {
				const response = await request(app)
					.post('/api/user/avatar')
					.set('Authorization', `Bearer ${currentUser.authToken}`)
					.attach('avatar', largeImagePath)
					.expect(400)

				expect(response.body).toHaveProperty('success', false)
				expect(response.body.message).toBe('File too large (max 5MB)')
			} finally {
				// Очистка
				if (fs.existsSync(largeImagePath)) {
					fs.unlinkSync(largeImagePath)
				}
			}
		})
		test('should return 400 for invalid file type', async () => {
			const txtPath = path.join(__dirname, 'test.txt')
			fs.writeFileSync(txtPath, 'not an image')

			const response = await request(app)
				.post('/api/user/avatar')
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.attach('avatar', txtPath)
				.expect(400)

			expect(response.body).toHaveProperty('success', false)

			fs.unlinkSync(txtPath)
		})
	})
	describe('DELETE /api/user/avatar', () => {
		test('should update user avatar', async () => {
			const response = await request(app)
				.delete(`/api/user/avatar`)
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.expect(200)
			expect(response.body.data.avatar_url).toBeNull()
		})
	})
})

export { TestUser }
