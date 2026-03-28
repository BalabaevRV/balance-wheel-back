import { Request, Response } from 'express'
import { userSignup, userLogin } from '@/models/UserModel'

export const loginUser = async (req: Request, res: Response)  => {
    try {
        const result = await userLogin(req.body);
        res.status(200).json(result);
    } catch (error) {
        // Проверяем тип ошибки
        if (error instanceof Error) {
        if (error.message === 'wrong password') {
            return res.status(401).json({ error: error.message });
        }
        }
        
        // Общая ошибка сервера
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const logoutUser = async () => {
     console.log('logoutUser')
}

export const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await userSignup(req.body);
    res.status(201).json(result);
  } catch (error) {
    // Проверяем тип ошибки
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return res.status(400).json({ error: error.message });
      }
    }
    
    // Общая ошибка сервера
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};