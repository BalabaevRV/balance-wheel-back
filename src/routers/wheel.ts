import { Request, Response } from 'express'
import { authGuard, authMiddleware } from '@/middleware/AuthMiddleware'
import { createWheel, deleteWheel, editWheel } from '@/models/WheelModel'

const express = require('express')
const router = express.Router()

router.post('/wheel', authMiddleware, authGuard,  createWheel)
router.get('/wheel/:id', authMiddleware, authGuard, editWheel)
router.delete('/wheel/:id', authMiddleware, authGuard, deleteWheel)

export default router