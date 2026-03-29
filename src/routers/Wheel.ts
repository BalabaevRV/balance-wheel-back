import { authGuard, authMiddleware } from '@/middleware/AuthMiddleware'
import { createWheel, editWheel, deleteWheel } from '@/controllers/WheelController'

const express = require('express')
const router = express.Router()

router.post('/wheel', authMiddleware, authGuard,  createWheel)
router.get('/wheel/:id', authMiddleware, authGuard, editWheel)
router.delete('/wheel/:id', authMiddleware, authGuard, deleteWheel)

export default router