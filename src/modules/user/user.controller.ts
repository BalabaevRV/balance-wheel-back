import { Request, Response } from 'express'
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
        
        const userInfo = await findUserById(userId)

        if (!userInfo) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        res.status(200).json({ 
            user: userInfo
        });
    } catch(error) {
        if (error instanceof Error) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

