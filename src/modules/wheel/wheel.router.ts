import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { getWheels, getWheelById, saveWheel, attachWheel, detachWheel } from '@/modules/wheel/wheel.controller'

const express = require('express')
const router = express.Router()

router.get('/api/wheels', authMiddleware, authGuard,  getWheels)
router.get('/api/wheels/:id', authMiddleware, authGuard,  getWheelById)
router.post('/api/wheels', authMiddleware, authGuard,  saveWheel)
router.post('/api/wheels/:wheelId/attach', authMiddleware, authGuard,  attachWheel)
router.post('/api/wheels/:wheelId/detach', authMiddleware, authGuard,  detachWheel)

export default router