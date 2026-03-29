import { Request, Response } from 'express'
import { authGuard, authMiddleware } from '@/middleware/AuthMiddleware'
import { createWheel1, deleteWheel1, editWheel1 } from '@/models/WheelModel'

const express = require('express')
const router = express.Router()

export const createWheel = (req: Request, res: Response) => {

}

export const editWheel = (req: Request, res: Response) => {

}

export const deleteWheel = (req: Request, res: Response) => {

}

export default router