import { Request, Response } from 'express'
import { userSignup, userLogin } from '@/models/UserModel'

export const loginUser = async (req: Request, res: Response)  => {
    const { login, password } = req.body
    const jwt = await userLogin({login, password})
    console.log(jwt)
    res.status(201).json({ 
        jwt: jwt
    });
}

export const logoutUser = async () => {
     console.log('logoutUser')
}

export const signupUser = async (req: Request, res: Response) => {
    const { login, password, name } = req.body
    await userSignup({login, password, name})
    res.status(201).json({ 
        message: 'User created successfully',
        user: { login, name }
    });
}
