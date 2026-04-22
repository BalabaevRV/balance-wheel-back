import { Request, Response } from 'express'
import { getUserInfoById } from '@/modules/user/user.service'
import { findUserById } from '@/modules/user/user.model'

export const deleteUser = async(req: Request, res: Response) => {
    //TODO
    //нужно ли
}

export const getUserInfo = async(req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id) || Number(req.user)
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ 
                error: 'Invalid user ID' 
            });
        }

        const result = await getUserInfoById(userId);
        res.status(201).json(result);
      } catch (error) {
        // Проверяем тип ошибки
        if (error instanceof Error) {
          if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
          }
        }
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

