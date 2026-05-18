import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'
import { getWheels, getWheelById, saveWheel, attachWheel, detachWheel } from '@/modules/wheel/wheel.controller'

const express = require('express')
const router = express.Router()

router.get('/wheels', authMiddleware, authGuard,  getWheels)
router.get('/wheels/:id', authMiddleware, authGuard,  getWheelById)
router.post('/wheels', authMiddleware, authGuard,  saveWheel)
router.post('/wheels/:wheelId/attach', authMiddleware, authGuard,  attachWheel)
router.post('/wheels/:wheelId/detach', authMiddleware, authGuard,  detachWheel)

export default router