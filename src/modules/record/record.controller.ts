import { Request, Response } from 'express'
import { deleteRecordById, getRecordsByIdArray } from '@/modules/record/record.model'
import { saveRecordInfo } from '@/modules/record/record.service'

export const saveRecord = async (req: Request, res: Response) => {
	try {
		const record = await saveRecordInfo(req.body, Number(req.user))
		const answer = {
			message: 'Record info saved successfully',
			success: true,
			data: record
		}
		const statusCode = req.body.record_id ? 200 : 201
		res.status(statusCode).json(answer)
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ error: error.message })
		}
		console.error('Signup error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const getRecordById = async (req: Request, res: Response) => {
	try {
		const recordId = Number(req.params.id)
		const record = await getRecordsByIdArray([recordId])
		const answer = {
			message: 'Record info got successfully',
			success: true,
			data: record[0]
		}
		res.status(200).json(answer)
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ error: error.message })
		}
		console.error('Signup error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}
export const deleteRecord = async (req: Request, res: Response) => {
	try {
		const recordId = Number(req.params.id)
		await deleteRecordById(recordId)
		const answer = {
			message: 'Record deleted successfully',
			success: true
		}
		res.status(200).json(answer)
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ error: error.message })
		}
		console.error('Signup error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}
