import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { config } from '@/config/env';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.authorization) {
        verify(req.headers.authorization.split('')[1], config.secret, (err, payload) => {
            if (err) {

            }
        })
    }

}

export const authGuard = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
        return next()
    }
    res.status(401).send({'error': 'Ошибка авторизации'})
} 