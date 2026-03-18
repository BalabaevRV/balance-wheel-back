import { Request, Response } from 'express'
import { userSignup } from '@/models/UserModel'

export const loginUser = () => {
    console.log('loginUser')
}

export const logoutUser = () => {
    console.log('logoutUser')
}


export const signupUser = async (req: Request, res: Response) => {
    const { login, password, name } = req.body
    const response = await userSignup(login, password, name)
    console.log(response)
    res.status(201).json({ 
        message: 'User created successfully',
        user: { login, name }
    });

}
