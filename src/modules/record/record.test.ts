import request from 'supertest'
import app from '@/app'
import { pool } from '@/config/database'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { IUser, TestUser } from '@/modules/user/user.types'
import { getAuthToken } from '@/tests/helper/auth'
import { IWheel } from '@/modules/wheel/wheel.types'
import { IRecordSave } from '@/modules/record/record.types'
import { IField } from '../wheel/field.types'

describe('Record routes Integration Tests', () => {
	let currentUserInfo: IUser
	let currentUser: TestUser
	let currentWheel: IWheel
	let newRecord: IRecordSave
	let testWheel = {
		name: 'Test Wheel for Records',
		interval_seconds: 86400,
		fields: [
			{ name: 'Field 1', color_hex: '#FF0000' },
			{ name: 'Field 2', color_hex: '#00FF00' },
			{ name: 'Field 3', color_hex: '#0000FF' },
			{ name: 'Field 4', color_hex: '#FFFF00' },
			{ name: 'Field 5', color_hex: '#800080' },
			{ name: 'Field 6', color_hex: '#FFA500' }
		]
	}
	beforeAll(async () => {
		currentUser = await getAuthToken()
		const responseUser = await request(app)
			.get('/api/user')
			.set('Authorization', `Bearer ${currentUser.authToken}`)
			.expect(200)
		currentUserInfo = responseUser.body.data
		const userWheel = currentUserInfo.wheels.find((wheel: IWheel) => wheel.name === testWheel.name)
		if (userWheel) {
			currentWheel = userWheel
		}
		if (!currentWheel) {
			const responseWheel = await request(app)
				.post('/api/wheels')
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.send(testWheel)
				.expect(201)
			currentWheel = responseWheel.body.data
		}
		if (currentWheel) {
			newRecord = { wheel_id: currentWheel.wheel_id, user_id: currentUserInfo.user_id, values: [], note: 'Initial record' }
			newRecord.values = currentWheel.fields.map((field: IField) => ({
				name: field.name,
				color_hex: field.color_hex,
				field_id: field.field_id,
				value: Math.floor(Math.random() * 10) + 1
			}))
		}
	})
	describe('POST /api/records create', () => {
		test('should create record', async () => {
			const response = await request(app)
				.post('/api/records')
				.set('Authorization', `Bearer ${currentUser.authToken}`)
				.send(newRecord)
				.expect(201)
			expect(response.body).toHaveProperty('success', true)
			expect(response.body.data).toMatchObject({
				record_id: expect.any(Number),
				wheel_id: newRecord?.wheel_id,
				user_id: newRecord?.user_id,
				note: newRecord?.note,
				values: expect.arrayContaining(newRecord?.values || [])
			})

			newRecord.record_id = response.body.data.record_id
			const dbResultRecord = await pool.query(
				'SELECT * FROM records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
				[newRecord.user_id]
			)

			expect(dbResultRecord.rows).toHaveLength(1)
			expect(dbResultRecord.rows[0].wheel_id).toBe(newRecord.wheel_id)
		})
		describe('POST /api/records edit', () => {
			test('should edit record', async () => {
				const updatedValues = newRecord.values.map((field) => ({
					...field,
					value: field.value === 10 ? 1 : field.value + 1
				}))
				newRecord.note = 'Updated record note'
				const response = await request(app)
					.post('/api/records')
					.set('Authorization', `Bearer ${currentUser.authToken}`)
					.send({ ...newRecord, values: updatedValues })
					.expect(200)

				expect(response.body).toHaveProperty('success', true)
				expect(response.body.data).toMatchObject({
					record_id: newRecord.record_id,
					wheel_id: newRecord.wheel_id,
					user_id: newRecord.user_id,
					note: newRecord.note,
					values: expect.arrayContaining(updatedValues || [])
				})
				newRecord.values = updatedValues
			})
		})
		describe('GET /api/records/:id', () => {
			test('should get records by id', async () => {
				const response = await request(app)
					.get(`/api/records/${newRecord.record_id}`)
					.set('Authorization', `Bearer ${currentUser.authToken}`)
					.expect(200)

				expect(response.body).toHaveProperty('success', true)
				expect(response.body.data).toMatchObject({
					record_id: newRecord.record_id,
					wheel_id: newRecord.wheel_id,
					user_id: newRecord.user_id,
					note: newRecord.note,
					values: expect.arrayContaining(newRecord.values || [])
				})
			})
		})
		describe('DELETE /api/records/:id', () => {
			test('should delete record', async () => {
				const response = await request(app)
					.delete(`/api/records/${newRecord.record_id}`)
					.set('Authorization', `Bearer ${currentUser.authToken}`)
					.expect(200)
				expect(response.body).toHaveProperty('success', true)
				const dbResultRecord = await pool.query('SELECT * FROM records WHERE record_id = $1', [newRecord.record_id])
				expect(dbResultRecord.rows).toHaveLength(0)
			})
		})
		afterAll(async () => {
			await pool.query('DELETE FROM record_values WHERE record_id = $1', [newRecord.record_id])
			await pool.query('DELETE FROM records WHERE user_id = $1', [newRecord.record_id])
		})
	})
})
