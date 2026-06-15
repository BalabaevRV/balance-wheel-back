import { Request, Response } from 'express'
import { deleteRecordById, getRecordsByIdArray } from '@/modules/record/record.model'
import { saveRecordInfo } from '@/modules/record/record.service'
import { successResponse, errorResponse } from '@/shared/utils/response'

export const saveRecord = async (req: Request, res: Response) => {
	try {
		const record = await saveRecordInfo(req.body, Number(req.user))
		const isUpdate = !!req.body.record_id

		successResponse(
			res,
			record,
			isUpdate ? 'Record updated successfully' : 'Record created successfully',
			isUpdate ? 200 : 201
		)
	} catch (error) {
		console.error('Save record error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const getRecordById = async (req: Request, res: Response) => {
	try {
		const recordId = Number(req.params.id)
		const record = await getRecordsByIdArray([recordId])

		if (!record || record.length === 0) {
			return errorResponse(res, 'Record not found', 404)
		}

		successResponse(res, record[0], 'Record info retrieved successfully')
	} catch (error) {
		console.error('Get record by id error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}

export const deleteRecord = async (req: Request, res: Response) => {
	try {
		const recordId = Number(req.params.id)
		await deleteRecordById(recordId)
		successResponse(res, null, 'Record deleted successfully')
	} catch (error) {
		console.error('Delete record error:', error)

		if (error instanceof Error) {
			return errorResponse(res, error.message, 400)
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}
