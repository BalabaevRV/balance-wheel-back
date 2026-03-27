import { Request, Response } from 'express'
import { userSignup, userLogin } from '@/models/UserModel'

export const loginUser = async (req: Request, res: Response)  => {
    const { login, password } = req.body
    const jwt = await userLogin({login, password})
    res.status(201).json({ 
        jwt: jwt
    });
}

export const logoutUser = async () => {
     console.log('logoutUser')
}

export const signupUser = async (req: Request, res: Response) => {
    const { login, password, name, email } = req.body
    const token = await userSignup({login, password, name, email })
    res.status(201).json({ 
        message: 'User created successfully',
        success: true,
        token: token,
        user: { login, name, email }
    });
}
