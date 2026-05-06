import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { getWheels, getWheelById, saveWheel } from '@/modules/wheel/wheel.controller'

const express = require('express')
const router = express.Router()

router.get('/api/wheels', authMiddleware, authGuard,  getWheels)
router.get('/api/wheels/:id', authMiddleware, authGuard,  getWheelById)
router.post('/api/wheels', authMiddleware, authGuard,  saveWheel)

export default router