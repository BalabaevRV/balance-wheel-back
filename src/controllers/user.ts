import { Request, Response } from 'express'
import { deleteCurrentUser, getUserInfoByName, getUserInfoById } from '@/models/UserModel'

export const deleteUser = async(req: Request, res: Response) => {
    await deleteCurrentUser({login: req.user})
}


export const getCurrentUserInfo = async(req: Request, res: Response) => {
     const userInfo = await getUserInfoByName({login: req.user})
     res.status(200).json({ 
          user: userInfo
     });
}


export const getUserInfo = async(req: Request, res: Response) => {
    const userInfo = await getUserInfoById({id: Number(req.params.id)})
     res.status(200).json({ 
          user: userInfo
     });
}

