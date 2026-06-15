import { Request, Response } from 'express'
import { getUserInfoById } from '@/modules/user/user.service'
import { getWheelsByUserId } from '@/modules/wheel/wheel.service'
import { getRecordsByUserId } from '@/modules/record/record.service'
import { successResponse, errorResponse } from '@/shared/utils/response'

export const getUserInfo = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id) || Number(req.user)

		if (!userId || isNaN(userId)) {
			return errorResponse(res, 'Invalid user ID', 400)
		}

		const userInfo = await getUserInfoById(userId)
		successResponse(res, userInfo, 'User info retrieved successfully')
	} catch (error) {
		console.error('Get user info error:', error)

		if (error instanceof Error && error.message === 'User already exists') {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const getWheelsByUser = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id) || Number(req.user)
		const wheels = await getWheelsByUserId(userId)

		successResponse(res, wheels, 'Wheels retrieved successfully')
	} catch (error) {
		console.error('Get wheels error:', error)

		if (error instanceof Error && error.message === 'Failed to retrieve user wheels') {
			return errorResponse(res, error.message, 400)
		}

		errorResponse(res, 'Internal server error', 500)
	}
}

export const getRecordsByUser = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id) || Number(req.user)
		const records = await getRecordsByUserId(userId)

		successResponse(res, records, 'Records retrieved successfully')
	} catch (error) {
		console.error('Get records error:', error)

		if (error instanceof Error && error.message === 'Failed to retrieve user records') {
			return errorResponse(res, error.message, 400)
		}

		errorResponse(res, 'Internal server error', 500)
	}
}
