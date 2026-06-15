import { Request, Response } from 'express'
import { getUserInfoById } from '@/modules/user/user.service'
import { getWheelsByUserId } from '@/modules/wheel/wheel.service'
import { getRecordsByUserId } from '@/modules/record/record.service'

export const getUserInfo = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id) || Number(req.user)
		if (!userId || isNaN(userId)) {
			return res.status(400).json({
				error: 'Invalid user ID'
			})
		}
		const userInfo = await getUserInfoById(userId)
		const answer = {
			message: 'User info got successfully',
			success: true,
			data: userInfo
		}
		res.status(200).json(answer)
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'User already exists') {
				return res.status(400).json({ error: error.message })
			}
		}
		console.error('Signup error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const getWheelsByUser = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id) || Number(req.user)
		const wheels = await getWheelsByUserId(userId)
		const answer = {
			message: 'Wheels got successfully',
			success: true,
			data: wheels
		}
		res.status(200).json(answer)
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Failed to retrieve user wheels') {
				return res.status(400).json({ error: error.message })
			}
		}
		console.error('Signup error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const getRecordsByUser = async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id) || Number(req.user)
		const records = await getRecordsByUserId(userId)
		const answer = {
			message: 'Records got successfully',
			success: true,
			data: records
		}
		res.status(200).json(answer)
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Failed to retrieve user records') {
				return res.status(400).json({ error: error.message })
			}
		}
		console.error('Signup error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}
