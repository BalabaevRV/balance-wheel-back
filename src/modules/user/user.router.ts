import { getUserInfo, getWheelsByUser, getRecordsByUser } from '@/modules/user/user.controller'
import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'

const express = require('express')
const router = express.Router()

router.get('/user', authMiddleware, authGuard,  getUserInfo)
router.get('/user/:id', authMiddleware, authGuard, getUserInfo)
router.get('/user/:id/wheels', authMiddleware, authGuard, getWheelsByUser)
router.get('/user/:id/records', authMiddleware, authGuard, getRecordsByUser)

export default router