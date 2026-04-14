import { getUserInfo } from '@/modules/users/user.controller'
import { authGuard, authMiddleware } from '@/shared/middleware/auth.middleware'

const express = require('express')
const router = express.Router()

router.get('/user', authMiddleware, authGuard,  getUserInfo)
router.get('/user/:id', authMiddleware, authGuard, getUserInfo)

export default router