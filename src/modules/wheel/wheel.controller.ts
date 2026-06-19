import { Request, Response } from 'express'
import {
	saveWheelInfo,
	attachWheelToUser,
	detachWheelFromUser,
	getWheelsWithPagination
} from '@/modules/wheel/wheel.service'
import { getWheelsByIdArray } from '@/modules/wheel/wheel.model'
import { successResponse, errorResponse } from '@/shared/utils/response'

export const getWheels = async (req: Request, res: Response) => {
	try {
		const wheelsList = await getWheelsWithPagination({
			page: Number(req.query.page) || 1,
			limit: Number(req.query.limit) || 10,
			sortBy: (req.query.sortBy as string) || 'created_at',
			sortOrder: (req.query.sortOrder as string) || 'DESC'
		})
		successResponse(res, wheelsList, 'Wheels retrieved successfully')
	} catch (error) {
		console.error('Get wheels error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const getWheelById = async (req: Request, res: Response) => {
	try {
		const wheelInfo = await getWheelsByIdArray([Number(req.params.id)])

		if (!wheelInfo || wheelInfo.length === 0) {
			return errorResponse(res, 'Wheel not found', 404)
		}

		successResponse(res, wheelInfo[0], 'Wheel info retrieved successfully')
	} catch (error) {
		console.error('Get wheel by id error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const saveWheel = async (req: Request, res: Response) => {
	try {
		const wheel = await saveWheelInfo(req.body, Number(req.user))
		const statusCode = req.body.wheel_id ? 200 : 201
		const message = req.body.wheel_id ? 'Wheel updated successfully' : 'Wheel created successfully'

		successResponse(res, wheel, message, statusCode)
	} catch (error) {
		console.error('Save wheel error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const attachWheel = async (req: Request, res: Response) => {
	try {
		const userInfo = await attachWheelToUser(Number(req.params.wheelId), Number(req.user))
		successResponse(res, userInfo, 'Wheel attached to user successfully')
	} catch (error) {
		console.error('Attach wheel error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const detachWheel = async (req: Request, res: Response) => {
	try {
		const userInfo = await detachWheelFromUser(Number(req.params.wheelId), Number(req.user))
		successResponse(res, userInfo, 'Wheel detached from user successfully')
	} catch (error) {
		console.error('Detach wheel error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}
