import { deleteUser, getCurrentUserInfo, getUserInfo } from '@/controllers/user'
import { authGuard, authMiddleware } from '@/middleware/AuthMiddleware'

const express = require('express')
const router = express.Router()

router.get('/user', authMiddleware, authGuard,  getCurrentUserInfo)
router.get('/user/:id', authMiddleware, authGuard, getUserInfo)

export default router