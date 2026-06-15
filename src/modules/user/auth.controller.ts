import { Request, Response } from 'express'
import { userSignup, userLogin } from '@/modules/user/auth.service'
import { successResponse, errorResponse } from '@/shared/utils/response'

export const loginUser = async (req: Request, res: Response) => {
	try {
		const user = await userLogin(req.body)
		successResponse(res, user, 'User login successfully')
	} catch (error) {
		console.error('Login error:', error)

		if (error instanceof Error) {
			if (error.message === 'wrong password') {
				return errorResponse(res, error.message, 401)
			}
			if (error.message === 'User not found') {
				return errorResponse(res, error.message, 404)
			}
		}

		errorResponse(res, 'Internal server error', 500)
	}
}

export const logoutUser = async () => {
	//TODO
	//надо ли оно
}

export const signupUser = async (req: Request, res: Response) => {
	try {
		const user = await userSignup(req.body)
		successResponse(res, user, 'User created successfully', 201)
	} catch (error) {
		console.error('Signup error:', error)

		if (error instanceof Error) {
			if (error.message === 'User already exists') {
				return errorResponse(res, error.message, 400)
			}
		}

		return errorResponse(res, 'Internal server error', 500)
	}
}
