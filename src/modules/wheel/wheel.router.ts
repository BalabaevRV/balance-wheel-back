import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { getWheels, getWheelById, createWheel, editWheel, deleteWheel } from '@/modules/wheel/wheel.controller'

const express = require('express')
const router = express.Router()

router.get('/wheel', authMiddleware, authGuard,  getWheels)
router.get('/wheel/:id', authMiddleware, authGuard,  getWheelById)
router.post('/wheel', authMiddleware, authGuard,  createWheel)
router.post('/wheel/:id', authMiddleware, authGuard, editWheel)
router.delete('/wheel/:id', authMiddleware, authGuard, deleteWheel)

export default router