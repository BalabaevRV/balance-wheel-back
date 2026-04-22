import { getUserInfo } from '@/modules/user/user.controller'
import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'

const express = require('express')
const router = express.Router()

router.get('/api/user', authMiddleware, authGuard,  getUserInfo)
router.get('/api/user/:id', authMiddleware, authGuard, getUserInfo)

export default router